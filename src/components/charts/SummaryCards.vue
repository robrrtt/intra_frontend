<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-4 shadow rounded">
            <p class="text-gray-500">Total Items</p>
            <h2 class="text-xl font-bold">{{ total }}</h2>
        </div>
        <div class="bg-yellow-100 p-4 shadow rounded">
            <p class="text-gray-700">Low Stock</p>
            <h2 class="text-xl font-bold">{{ lowStock }}</h2>
        </div>
        <div class="bg-red-100 p-4 shadow rounded">
            <p class="text-gray-700">Out of Stock</p>
            <h2 class="text-xl font-bold">{{ outOfStock }}</h2>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const total = ref(0)
const lowStock = ref(0)
const outOfStock = ref(0)

const token = localStorage.getItem('token')

const fetchStats = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/items/all', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        })

        const items = res.data
        total.value = items.length
        lowStock.value = items.filter(item => item.quantity < item.reorder_level && item.quantity > 0).length
        outOfStock.value = items.filter(item => item.quantity === 0).length
    } catch (err) {
        console.error('Error fetching inventory stats:', err)
    }
}

onMounted(fetchStats)
</script>
