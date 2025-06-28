<template>
    <AdminLayout>
        <div class="min-h-screen bg-gray-100">
            <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">

                    <!-- Header -->
                    <section class="bg-white shadow rounded-lg p-6 mb-6">
                        <h2 class="text-lg font-semibold text-gray-900">Ticket Management</h2>
                        <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
                    </section>

                    <!-- Create Button -->
                    <div class="mb-4">
                        <button @click="showCreateModal = true"
                            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            + Create New Ticket
                        </button>
                    </div>

                    <!-- Modals -->

                        <CreateTicket v-if="showCreateModal" @close="showCreateModal = false" @ticket-created="handleTicketCreated" />

                    <EditTicket v-if="showEditModal" :ticket-id="selectedTicketId" @close="showEditModal = false"
                        @ticket-updated="handleTicketUpdated" />

                    <!-- Success Message -->
                    <div v-if="showSuccess"
                        class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
                        Ticket created successfully!
                    </div>

                    <!-- Ticket Table -->
                    <section class="bg-white shadow rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Tickets</h3>

                        <div v-if="tickets.length">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted By</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="ticket in tickets" :key="ticket.id">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ ticket.title }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ ticket.status
                                        }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                            ticket.submitted_by }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                                            ticket.assigned_to || '—' }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button @click="openEditModal(ticket.id)"
                                                class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Pagination -->
                            <div class="mt-4 flex justify-center gap-2">
                                <button @click="fetchTickets(meta.current_page - 1)" :disabled="meta.current_page === 1"
                                    class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                                    Previous
                                </button>

                                <span class="px-3 py-1">{{ meta.current_page }} / {{ meta.last_page }}</span>

                                <button @click="fetchTickets(meta.current_page + 1)"
                                    :disabled="meta.current_page === meta.last_page"
                                    class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                                    Next
                                </button>
                            </div>
                        </div>

                        <p v-else class="text-gray-600 text-center">No tickets found.</p>
                    </section>

                </div>
            </main>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import AdminLayout from '@/Role/Admin/AdminLayout.vue'
import CreateTicket from '@/components/Tickets/Create.vue'
import EditTicket from '@/components/Tickets/Edit.vue'

// State
const tickets = ref([])
const meta = ref({ current_page: 1, last_page: 1, total: 0 })
const error = ref('')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showSuccess = ref(false)
const selectedTicketId = ref(null)

const perPage = 10

// Fetch
async function fetchTickets(page = 1) {
    try {
        const response = await axios.get(`http://localhost:8000/api/tickets?page=${page}&per_page=${perPage}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
        })
        tickets.value = response.data.data
        meta.value = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            total: response.data.total,
        }
    } catch (err) {
        console.error(err)
        error.value = 'Failed to load tickets'
    }
}

// Modal Logic
function openEditModal(id) {
    selectedTicketId.value = id
    showEditModal.value = true
}

function handleTicketCreated() {
    showCreateModal.value = false
    showSuccess.value = true
    fetchTickets()
    setTimeout(() => (showSuccess.value = false), 1000)
}

function handleTicketUpdated() {
    showEditModal.value = false
    fetchTickets()
}

onMounted(() => fetchTickets())
</script>
