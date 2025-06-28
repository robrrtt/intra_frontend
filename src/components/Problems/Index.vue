<template>
    <AdminLayout>
        <div class="min-h-screen bg-gray-100">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h1 class="text-2xl font-bold">Problems</h1>
                    <button @click="showProblemModal = true"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        + Create Problem
                    </button>
                </div>

                <!-- Create Modal -->
                <CreateProblem v-if="showProblemModal" @close="showProblemModal = false"
                    @problem-created="handleProblemCreated" />

                <EditProblem
                v-if="showEditModal"
                :problem-id="selectedProblemId"
                @close="showEditModal = false"
                @problem-updated="handleProblemUpdated"
                />



                    
                <!-- Problem Table -->
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Severity</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="problem in problems" :key="problem.id">
                            <td class="px-6 py-4 text-sm text-gray-900">{{ problem.name }}</td>
                            <td class="px-6 py-4 text-sm text-gray-900 capitalize">{{ problem.severity }}</td>
                            <td class="px-6 py-4 text-sm">
                                <button @click="openEditModal(problem.id)" class="text-blue-600 hover:underline mr-4">
                                    Edit
                                </button>

                                <button @click="deleteProblem(problem.id)"
                                    class="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import AdminLayout from '@/Role/Admin/AdminLayout.vue'
import CreateProblem from '@/components/Problems/Create.vue'
import EditProblem from '@/components/Problems/Edit.vue'


const problems = ref([])
const showProblemModal = ref(false)

const showEditModal = ref(false)
const selectedProblemId = ref(null)

function openEditModal(id) {
    selectedProblemId.value = id
    showEditModal.value = true
}

function handleProblemUpdated() {
    showEditModal.value = false
    fetchProblems()
}

const fetchProblems = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/problems', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        problems.value = res.data.problems
    } catch (error) {
        console.error('Failed to fetch problems:', error)
    }
}

const deleteProblem = async (id) => {
    if (confirm('Delete this problem?')) {
        try {
            await axios.delete(`http://localhost:8000/api/problems/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            await fetchProblems()
        } catch (error) {
            console.error('Delete failed:', error)
        }
    }
}

function handleProblemCreated() {
    showProblemModal.value = false
    fetchProblems() // ✅ Correct function to refresh the table
}


onMounted(fetchProblems)
</script>
