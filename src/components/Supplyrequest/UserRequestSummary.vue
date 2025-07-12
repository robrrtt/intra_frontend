<template>
    <AdminLayout>
        <div class="max-w-7xl mx-auto p-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">📋 All Supply Requests</h2>

            <div v-if="loading" class="text-gray-500">Loading requests...</div>

            <div v-else class="bg-white shadow rounded-lg overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead class="bg-gray-100 text-gray-700 uppercase tracking-wide">
                        <tr>
                            <th class="px-4 py-3">User</th>
                            <th class="px-4 py-3">Request ID</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3">Approved At</th>
                            <th class="px-4 py-3">Items</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="row in flattenedRequests" :key="row.request_id + '-' + row.user_id"
                            class="hover:bg-gray-50">
                            <td class="px-4 py-3 font-medium text-gray-800">{{ row.user_name }}</td>
                            <td class="px-4 py-3">{{ row.request_id }}</td>
                            <td class="px-4 py-3">
                                <span :class="[
                                    'px-2 py-1 rounded text-xs font-semibold',
                                    row.status === 'approved'
                                        ? 'bg-green-100 text-green-700'
                                        : row.status === 'declined'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-yellow-100 text-yellow-700'
                                ]">
                                    {{ row.status.toUpperCase() }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-gray-600">{{ row.approved_at ?? '—' }}</td>
                            <td class="px-4 py-3 text-gray-700">
                                <ul class="list-disc list-inside">
                                    <li v-for="item in row.items" :key="item.name">
                                        {{ item.name }} – {{ item.quantity }} {{ item.unit }}
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

const userRequests = ref([])
const loading = ref(true)

const fetchUserRequestSummary = async () => {
    try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get(
            'http://localhost:8000/api/user-requests-summary',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        )
        userRequests.value = Array.isArray(data) ? data : []
    } catch (err) {
        console.error('Failed to load summary:', err)
    } finally {
        loading.value = false
    }
}

// 🔄 Flatten the grouped data into one table-friendly array
const flattenedRequests = computed(() => {
    return userRequests.value.flatMap(user =>
        user.requests.map(request => ({
            user_id: user.user_id,
            user_name: user.user_name,
            request_id: request.request_id,
            status: request.status,
            approved_at: request.approved_at,
            items: request.items,
        }))
    )
})

onMounted(fetchUserRequestSummary)
</script>
