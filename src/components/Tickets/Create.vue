<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">

            <!-- Close Button -->
            <button @click="closeModal"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close modal">
                ×
            </button>

            <!-- Title -->
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Create New Ticket
            </h2>

            <!-- Form -->
            <form @submit.prevent="submitTicket" class="space-y-5">
                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input v-model="form.title" id="title" type="text" placeholder="Enter ticket title"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <!-- Category -->
                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Problem Category</label>
                    <select v-model="form.category" id="category"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option value="" disabled>Select a category</option>
                        <option v-for="problem in problems" :key="problem.id" :value="problem.name">
                            {{ problem.name }}
                        </option>
                    </select>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="form.description" id="description" rows="4"
                        placeholder="Enter ticket description"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required></textarea>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="text-red-600 text-center font-medium">
                    {{ errorMessage }}
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        <span v-if="isSubmitting"
                            class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        {{ isSubmitting ? 'Creating...' : 'Create' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'ticket-created'])

const form = ref({
    title: '',
    category: '',
    description: ''
})

const problems = ref([])
const isSubmitting = ref(false)
const errorMessage = ref('')

// Load problem categories
onMounted(async () => {
    try {
        const { data } = await axios.get('http://localhost:8000/api/problems', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true
        })
        problems.value = data.problems
    } catch (err) {
        console.error('Failed to load problems:', err)
    }
})

// Submit ticket
async function submitTicket() {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        })

        const response = await axios.post(
            'http://localhost:8000/api/tickets',
            form.value,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            }
        )

        if (response.data.ticket) {
            // Emit success
            emit('ticket-created', response.data.ticket)

            // Reset form
            form.value = {
                title: '',
                category: '',
                description: ''
            }

            await nextTick()
            emit('close')
        }
    } catch (err) {
        console.error('Create ticket error:', err)
        const responseErr = err.response?.data
        errorMessage.value =
            responseErr?.message || responseErr?.error || 'Ticket creation failed.'
    } finally {
        isSubmitting.value = false
    }
}

function closeModal() {
    emit('close')
}
</script>
