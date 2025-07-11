<template>
    <AdminLayout>
        <div>
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-semibold">Inventory Dashboard</h1>
                <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="openModal(null)">
                    ➕ Add Item
                </button>
            </div>

            <!-- Item List -->
            <ItemList :refresh="refreshKey" @edit="openModal" />

            <!-- Modal for ItemForm -->
            <!-- Modal for ItemForm -->
            <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl relative">
                    <!-- Close Button -->
                    <button @click="closeModal"
                        class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">✖</button>

                    <!-- Form -->
                    <ItemForm :initial="editItem" @saved="handleSaved" @close="closeModal" />
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import ItemForm from './ItemForm.vue'
import ItemList from './ItemList.vue'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

const isModalOpen = ref(false)
const editItem = ref(null)
const refreshKey = ref(0)

const refresh = () => {
    refreshKey.value++
}

const openModal = (item) => {
    editItem.value = item || null
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    editItem.value = null
}

const handleSaved = () => {
    closeModal()
    refresh()
}
</script>
