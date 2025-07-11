<template>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">
        <h2 class="text-2xl font-bold mb-4">Supply Request #{{ request?.id }}</h2>

        <p><strong>Status:</strong> {{ request?.status }}</p>
        <p><strong>Requested By:</strong> {{ request?.requested_by }}</p>

        <ul class="mt-4 list-disc pl-6">
            <li v-for="item in request?.items || []" :key="item.item_id">
                {{ item.item_name }} — {{ item.quantity }} {{ item.unit }}
            </li>
        </ul>

        <div v-if="request?.status === 'pending'" class="mt-4 flex gap-2">
            <button @click="approveRequest" class="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
            <button @click="declineRequest" class="bg-red-600 text-white px-4 py-2 rounded">Decline</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const request = ref(null)

onMounted(async () => {
    const res = await axios.get(`/api/supply-requests/${route.params.id}`)
    request.value = res.data
})

const approveRequest = async () => {
    await axios.post(`/api/supply-requests/${route.params.id}/approve`)
    alert('Approved')
    router.push('/supply-requests')
}

const declineRequest = async () => {
    await axios.post(`/api/supply-requests/${route.params.id}/decline`, { remarks: 'Declined by admin' })
    alert('Declined')
    router.push('/supply-requests')
}
</script>