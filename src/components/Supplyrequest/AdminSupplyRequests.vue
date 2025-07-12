<template>
    <AdminLayout>
        <div class="max-w-6xl mx-auto p-6">
            <h2 class="text-2xl font-bold mb-4">Supply Requests</h2>

            <div v-if="loading" class="text-gray-600">Loading requests...</div>

            <div v-else>
                <div v-for="request in requests" :key="request.id" class="bg-white shadow p-4 rounded-lg mb-4 border">
                    <div class="flex justify-between items-center">
                        <div>
                            <p><strong>Requested by:</strong> {{ request.requested_by }}</p>
                            <p><strong>Status:</strong>
                                <span :class="statusClass(request.status)">
                                    {{ request.status.toUpperCase() }}
                                </span>
                            </p>
                        </div>
                        <div v-if="request.status === 'pending'" class="flex gap-2">
                            <button @click="approveRequest(request.id)"
                                class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                Approve
                            </button>
                            <button @click="declineRequest(request.id)"
                                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                Decline
                            </button>
                        </div>
                    </div>

                    <table class="mt-4 w-full text-sm">
                        <thead class="text-gray-600 border-b">
                            <tr>
                                <th class="py-1 text-left">Item</th>
                                <th class="py-1 text-left">Qty</th>
                                <th class="py-1 text-left">Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in request.items" :key="item.item_id" class="border-b last:border-none">
                                <td class="py-1">{{ item.item_name }}</td>
                                <td class="py-1">{{ item.quantity }}</td>
                                <td class="py-1">{{ item.unit }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'


const requests = ref([])
const loading = ref(true)

const fetchRequests = async () => {
    loading.value = true
    const token = localStorage.getItem('token')
    try {
        const { data } = await axios.get('http://localhost:8000/api/supply-requests', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
        requests.value = data
    } catch (err) {
        console.error('Error fetching requests:', err)
    } finally {
        loading.value = false
    }
}

const approveRequest = async (id) => {
    const token = localStorage.getItem('token')
    try {
        await axios.post(`http://localhost:8000/api/supply-requests/${id}/approve`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        fetchRequests()
    } catch (err) {
        console.error('Failed to approve:', err)
    }
}

const declineRequest = async (id) => {
    const token = localStorage.getItem('token')
    try {
        await axios.post(`http://localhost:8000/api/supply-requests/${id}/decline`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        fetchRequests()
    } catch (err) {
        console.error('Failed to decline:', err)
    }
}

const statusClass = (status) => {
    switch (status) {
        case 'approved':
            return 'text-green-600 font-semibold'
        case 'pending':
            return 'text-yellow-600 font-semibold'
        case 'declined':
            return 'text-red-600 font-semibold'
        default:
            return ''
    }
}

onMounted(fetchRequests)
</script>
