<template>
    <AdminLayout>
    <div class="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
        <h2 class="text-xl font-semibold mb-4">Request Supply</h2>

        <div class="mb-4">
            <label class="block text-gray-700 mb-1">Select Item</label>
            <select v-model="selectedItemId" class="w-full border rounded p-2">
                <option disabled value="">-- Select an item --</option>
                <option v-for="item in items" :key="item.id" :value="item.id">
                    {{ item.name }} ({{ item.quantity }} in stock)
                </option>
            </select>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700 mb-1">Quantity</label>
            <input type="number" v-model="quantity" min="1" class="w-full border rounded p-2"
                placeholder="Enter quantity" />
        </div>

        <button @click="requestItem" :disabled="loading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            {{ loading ? 'Requesting...' : 'Request Supply' }}
        </button>

        <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
        <p v-if="error" class="mt-4 text-red-600">{{ error }}</p>
    </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

const items = ref([])
const selectedItemId = ref('')
const quantity = ref(1)
const loading = ref(false)
const message = ref('')
const error = ref('')

const fetchItems = async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:8000/api/items', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        })
        items.value = res.data.data || res.data
    } catch (err) {
        console.error('❌ Failed to fetch items:', err)
        error.value = 'Failed to load items'
    }
}

const requestItem = async () => {
    message.value = ''
    error.value = ''
    if (!selectedItemId.value || quantity.value <= 0) {
        error.value = 'Please select an item and enter a valid quantity.'
        return
    }

    try {
        loading.value = true
        const token = localStorage.getItem('token')
        const res = await axios.post(
            `http://localhost:8000/api/items/${selectedItemId.value}/request`,
            { quantity: quantity.value },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        )

        message.value = res.data.message
        fetchItems() // update stock
    } catch (err) {
        console.error(err)
        error.value = err.response?.data?.message || 'Request failed'
    } finally {
        loading.value = false
    }
}

onMounted(fetchItems)
</script>
