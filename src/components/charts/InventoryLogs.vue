<template>
    <div class="bg-white p-4 shadow rounded mt-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold">Inventory Logs</h2>
            <input type="text" placeholder="Search logs..." class="border rounded px-2 py-1" />
        </div>
<div v-if="loading" class="text-gray-600">Loading logs...</div>

<table v-else class="w-full text-sm table-auto">
    <thead class="bg-gray-100">
        <tr>
            <th class="text-left p-2">Date</th>
            <th class="text-left p-2">Item</th>
            <th class="text-left p-2">Action</th>
            <th class="text-left p-2">User</th>
            <th class="text-left p-2">Quantity</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="log in logs" :key="log.id" class="border-t">
            <td class="p-2">{{ log.date }}</td>
            <td class="p-2">{{ log.item }}</td>
            <td class="p-2">{{ log.action }}</td>
            <td class="p-2">{{ log.user }}</td>
            <td class="p-2">{{ log.quantity }}</td>
        </tr>
    </tbody>
</table>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref([])

const fetchLogs = async () => {
    const token = localStorage.getItem('token')
    try {
        const { data } = await axios.get('http://localhost:8000/api/logs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        logs.value = data
    } catch (err) {
        console.error('Failed to fetch logs:', err)
    }
}

onMounted(fetchLogs)
</script>
