<template>
    <div class="bg-white p-6 shadow-xl rounded-2xl max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">📦 Inventory List</h2>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-xl">
            <table class="min-w-full divide-y divide-gray-100 text-sm text-left">
                <thead class="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                    <tr>
                        <th class="px-6 py-4">Name</th>
                        <th class="px-6 py-4">Type</th>
                        <th class="px-6 py-4">Category</th>
                        <th class="px-6 py-4">Brand</th>
                        <th class="px-6 py-4">Serial</th>
                        <th class="px-6 py-4">Qty</th>
                        <th class="px-6 py-4">Unit</th>
                        <th class="px-6 py-4">Reorder</th>
                        <th class="px-6 py-4">Location</th>
                        <th class="px-6 py-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="item in items" :key="item.id"
                        class="hover:bg-gray-50 transition duration-150 ease-in-out">
                        <td class="px-6 py-4 font-medium text-gray-800">{{ item.name }}</td>
                        <td class="px-6 py-4">
                            <span :class="badgeClass(item.type)">{{ item.type }}</span>
                        </td>
                        <td class="px-6 py-4 text-gray-700">{{ item.category }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ item.brand }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ item.serial_number }}</td>
                        <td class="px-6 py-4 font-bold" :class="{ 'text-red-600': item.quantity < item.reorder_level }">
                            {{ item.quantity }}
                        </td>
                        <td class="px-6 py-4 text-gray-700">{{ item.unit }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ item.reorder_level }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ item.location }}</td>
                        <td class="px-6 py-4 text-center space-x-2">
                            <button @click="$emit('edit', item)"
                                class="inline-flex items-center justify-center p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition"
                                title="Edit">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M15.232 5.232l3.536 3.536M4 20h4.586a2 2 0 0 0 1.414-.586l10-10a2 2 0 0 0 0-2.828l-3.536-3.536a2 2 0 0 0-2.828 0l-10 10A2 2 0 0 0 4 20z" />
                                </svg>
                            </button>
                            <button @click="deleteItem(item.id)"
                                class="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50 transition"
                                title="Delete">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path
                                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                    <tr v-if="items.length === 0">
                        <td colspan="10" class="px-6 py-8 text-center text-gray-400 italic">
                            No items found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const props = defineProps({ refresh: Number })
const items = ref([])

const token = localStorage.getItem('token')
const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
}

const loadItems = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/items', { headers })
        items.value = res.data
    } catch (err) {
        console.error('Failed to load items:', err)
        alert('Failed to load inventory items.')
    }
}

const deleteItem = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await axios.delete(`http://localhost:8000/api/items/${id}`, { headers })
            loadItems()
        } catch (err) {
            console.error('Failed to delete item:', err)
            alert('Failed to delete item.')
        }
    }
}

const badgeClass = (type) => {
    return type === 'Consumable'
        ? 'inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold'
        : 'inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-semibold'
}

watch(() => props.refresh, loadItems, { immediate: true })
onMounted(loadItems)
</script>
