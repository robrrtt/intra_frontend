<template>
    <AdminLayout>
        <div class="max-w-7xl mx-auto p-6">
            <!-- Header -->

            <!-- Modal Trigger -->
            <div class="mt-6 flex justify-end">
                <button @click="isModalOpen = true"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
                    Add Stocks
                </button>
            </div>

            <!-- Supply Modal -->
            <EditInventory v-if="isModalOpen" @close="isModalOpen = false" />

            <!-- Inventory Table -->
            <div class="bg-white shadow-lg rounded-xl overflow-x-auto mt-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr class="text-sm text-gray-600 uppercase tracking-wide text-left">
                            <th class="px-6 py-3">ID</th>
                            <th class="px-6 py-3">Item Name</th>
                            <th class="px-6 py-3">Type</th>
                            <th class="px-6 py-3 text-center">Quantity</th>
                            <th class="px-6 py-3">Unit</th>
                            <th class="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-sm text-gray-800">
                        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition duration-150">
                            <td class="px-6 py-4 font-medium text-gray-700">{{ item.id }}</td>
                            <td class="px-6 py-4">{{ item.name }}</td>
                            <td class="px-6 py-4">
                                <span :class="[
                                    'text-xs px-2 py-1 rounded-full font-medium',
                                    item.type === 'Consumable'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                ]">
                                    {{ item.type }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center font-semibold">
                                {{ item.quantity }}
                            </td>
                            <td class="px-6 py-4">{{ item.unit }}</td>
                            <td class="px-6 py-4 text-right">
                                <router-link :to="`/items/${item.id}/edit`"
                                    class="text-blue-600 hover:underline font-medium">
                                    View / Edit
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center items-center gap-2 mt-6">
                <button @click="prevPage" :disabled="pagination.current_page === 1"
                    class="px-3 py-1 rounded-md text-sm font-medium transition border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Prev
                </button>
                <template v-for="page in pagination.last_page" :key="page">
                    <button @click="goToPage(page)" :class="[
                        'px-3 py-1 rounded-md text-sm font-medium transition',
                        page === pagination.current_page
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-700 border border-gray-300 hover:bg-gray-100'
                    ]">
                        {{ page }}
                    </button>
                </template>
                <button @click="nextPage" :disabled="pagination.current_page === pagination.last_page"
                    class="px-3 py-1 rounded-md text-sm font-medium transition border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'
import EditInventory from '@/components/inventory/Create.vue'
import EditSupply from '@/components/inventory/Edit.vue'



const isModalOpen = ref(false)

const items = ref([])
const pagination = ref({})
const currentPage = ref(1)
const perPage = 10

const fetchItems = async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await axios.get(
            `http://localhost:8000/api/items?page=${currentPage.value}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        )

        items.value = res.data.data
        pagination.value = {
            current_page: res.data.current_page,
            last_page: res.data.last_page,
        }
    } catch (e) {
        console.error('❌ Failed to load items:', e)
    }
}

onMounted(fetchItems)

const nextPage = () => {
    if (currentPage.value < pagination.value.last_page) {
        currentPage.value++
        fetchItems()
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchItems()
    }
}

const goToPage = (page) => {
    if (page !== pagination.value.current_page) {
        currentPage.value = page
        fetchItems()
    }
}
</script>
