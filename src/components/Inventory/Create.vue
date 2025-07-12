<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
            <!-- Close Button -->
            <button @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close">
                ×
            </button>

            <!-- Title -->
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Inventory Item</h2>

            <!-- Form -->
            <form @submit.prevent="submitItem" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Type -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Type</label>
                    <select v-model="form.type"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option disabled value="">Select Type</option>
                        <option value="Consumable">Consumable</option>
                        <option value="Non-Consumable">Non-Consumable</option>
                    </select>
                </div>
                <!-- Category (Filtered by Type) -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select v-model="form.category" :disabled="!form.type"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option disabled value="">Select Category</option>
                        <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.category">
                            {{ cat.category }}
                        </option>
                    </select>
                </div>

                <!-- Item Name -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                    <input v-model="form.name" type="text" placeholder="e.g., Wireless Mouse"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>



                <!-- Brand -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Brand</label>
                    <input v-model="form.brand" type="text" placeholder="e.g., Logitech"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <!-- Serial Number 
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Serial Number</label>
                    <input v-model="form.serial_number" type="text" placeholder="e.g., SN12345678"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
-->
                <!-- Quantity -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                    <input v-model.number="form.quantity" type="number" min="0" placeholder="e.g., 10"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <!-- Unit -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                    <input v-model="form.unit" type="text" placeholder="e.g., pcs, box, ream"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <!-- Reorder Level -->
                <div>
                    <label class="block mb-1 text-sm font-medium text-gray-700">Reorder Level</label>
                    <input v-model.number="form.reorder_level" type="number" min="0" placeholder="e.g., 5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <!-- Location 
                <div class="md:col-span-2">
                    <label class="block mb-1 text-sm font-medium text-gray-700">Location</label>
                    <input v-model="form.location" type="text" placeholder="e.g., IT Room A"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
-->
                <!-- Error -->
                <div v-if="errorMessage" class="md:col-span-2 text-red-600 text-center">
                    {{ errorMessage }}
                </div>

                <!-- Actions -->
                <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                        class="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        {{ isSubmitting ? 'Saving...' : 'Save Item' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
const emit = defineEmits(['close', 'item-created'])
const filteredCategories = ref([])

const form = ref({
    name: '',
    type: '',
    category: '',
    brand: '',
    serial_number: '',
    quantity: 0,
    unit: '',
    reorder_level: 0,
    location: '',
})

const errorMessage = ref('')
const isSubmitting = ref(false)

const submitItem = async () => {
    isSubmitting.value = true
    errorMessage.value = ''

    try {
        await axios.post('http://localhost:8000/api/items', form.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: 'application/json'
            },
            withCredentials: true
        })
        emit('item-created') // optional: parent can refresh list
        emit('close') // close modal
    } catch (err) {
        errorMessage.value = err?.response?.data?.message || 'Failed to create item.'
    } finally {
        isSubmitting.value = false
    }
}

watch(() => form.value.type, async (newType) => {
    if (!newType) {
        filteredCategories.value = []
        form.value.category = ''
        return
    }

    try {
        const res = await axios.get(`http://localhost:8000/api/item-categories/type/${newType}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: 'application/json'
            },
            withCredentials: true
        })
        filteredCategories.value = res.data
    } catch (err) {
        console.error('Failed to fetch categories by type:', err)
    }
})
</script>

<style scoped>
/* Optional modal animation */
@keyframes slide-fade {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slide-fade {
    animation: slide-fade 0.25s ease-out;
}
</style>
