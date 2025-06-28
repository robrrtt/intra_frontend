<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
            <!-- Close Button -->
            <button @click="handleClose"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close">×</button>

            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Edit Ticket
            </h2>

            <form @submit.prevent="updateTicket" class="space-y-5">
                <!-- Title -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input v-model="form.title" id="title" type="text" placeholder="Enter ticket title"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="form.description" id="description" rows="4"
                        placeholder="Enter ticket description"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required></textarea>
                </div>

                <!-- Category -->
                <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select v-model="form.category" id="category"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option value="" disabled>Select category</option>

                        <option v-for="problem in problems" :key="problem.id" :value="problem.name">
    {{ problem.name }}
</option>

                        
                    </select>
                </div>

                <!-- Status -->
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="form.status" id="status"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="reopened">Reopened</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="text-red-600 text-center font-medium">
                    {{ errorMessage }}
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="handleClose"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        <span v-if="isSubmitting"
                            class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    ticketId: { type: Number, required: true }
})

const emit = defineEmits(['close', 'ticket-updated'])

const form = ref({
    title: '',
    description: '',
    category: '',
    status: 'open',
})

const problems = ref([])
const isSubmitting = ref(false)
const errorMessage = ref('')

const apiOptions = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true
}

async function fetchTicket() {
    try {
        const { data } = await axios.get(`http://localhost:8000/api/tickets/${props.ticketId}`, apiOptions)
        form.value = {
            title: data.ticket.title,
            description: data.ticket.description,
            category: data.ticket.category_id || '', // ✅ correct on load
            status: data.ticket.status,
        }


    } catch (err) {
        errorMessage.value = 'Failed to load ticket data.'
    }
}

async function loadProblems() {
    try {
        const { data } = await axios.get('http://localhost:8000/api/problems', apiOptions)
        problems.value = data.problems
    } catch (err) {
        console.error('Problem list fetch failed:', err)
    }
}

async function updateTicket() {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
        await axios.put(`http://localhost:8000/api/tickets/${props.ticketId}`, form.value, apiOptions)
        emit('ticket-updated')
        handleClose()
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'Update failed.'
    } finally {
        isSubmitting.value = false
    }
}

function handleClose() {
    form.value = {
        title: '',
        description: '',
        category: '',
        status: 'open'
    }
    errorMessage.value = ''
    emit('close')
}

onMounted(async () => {
    await Promise.all([fetchTicket(), loadProblems()])
})
</script>
