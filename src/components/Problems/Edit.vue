<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
            <button @click="emit('close')"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold">
                ×
            </button>

            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Problem</h2>

            <form @submit.prevent="updateProblem" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded-lg" required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="form.description" rows="4" class="w-full px-4 py-2 border rounded-lg"
                        required></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select v-model="form.severity" class="w-full px-4 py-2 border rounded-lg" required>
                        <option disabled value="">Select Severity</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>


                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="closeModal"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
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
    problemId: Number,
})

const emit = defineEmits(['close', 'problem-updated'])

const form = ref({
    name: '',
    description: '',
    severity: '',
})

const fetchProblem = async () => {
    try {
        const res = await axios.get(`http://localhost:8000/api/problems/${props.problemId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        form.value = {
            name: res.data.name,
            description: res.data.description,
            severity: res.data.severity,
        }
    } catch (err) {
        console.error('Failed to fetch problem:', err)
    }
}

const updateProblem = async () => {
    try {
        await axios.put(`http://localhost:8000/api/problems/${props.problemId}`, form.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        emit('problem-updated')
        emit('close')
    } catch (err) {
        console.error('Failed to update problem:', err)
    }
}

onMounted(fetchProblem)
</script>
