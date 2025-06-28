<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <h2 class="text-xl font-bold mb-4">Create Problem</h2>

        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
            <!-- Close Button -->
            <button @click="closeModal"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close">
                ×
            </button>

            <!-- Title -->
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Create New Problem
            </h2>

            <!-- Form -->
            <form @submit.prevent="submitproblem" class="space-y-5">
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input v-model="form.name" id="name" type="text" placeholder="Enter Problem title"
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
                <div>
                    <select v-model="form.severity" class="block w-full border mb-4 p-2">
                        <option disabled value="">Select Severity</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <!-- Error Message -->
                <div v-if="errorMessage" class="text-red-600 text-center">
                    {{ errorMessage }}
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        {{ isSubmitting ? 'Creating...' : 'Create' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'problem-created'])

const form = ref({
    name: '',
    description: '',
    severity: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')

function closeModal() {
    emit('close')
}

async function submitproblem() {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
        await axios.post('http://localhost:8000/api/problems', form.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        emit('problem-created') // Let parent refresh the list
        emit('close') // Close the modal
    } catch (err) {
        errorMessage.value = err?.response?.data?.message || 'Failed to create problem.'
    } finally {
        isSubmitting.value = false
    }
}
</script>
