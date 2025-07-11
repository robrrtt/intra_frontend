<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">

            <!-- Close Button -->
            <button @click="emit('close')"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close modal">
                ×
            </button>

            <!-- Title -->
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {{ form.id ? 'Edit Item' : 'Add New Item' }}
            </h2>

            <!-- Form -->
            <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input v-model="form.name" type="text" placeholder="Item Name"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select v-model="form.type"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option disabled value="">Select Type</option>
                        <option value="Consumable">Consumable</option>
                        <option value="Non-Consumable">Non-Consumable</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input v-model="form.category" type="text" placeholder="Category"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input v-model="form.brand" type="text" placeholder="Brand"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input v-model="form.serial_number" type="text" placeholder="Serial Number"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input v-model.number="form.quantity" type="number" placeholder="0" min="0"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input v-model="form.unit" type="text" placeholder="pcs, box, etc."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                    <input v-model.number="form.reorder_level" type="number" placeholder="0" min="0"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input v-model="form.location" type="text" placeholder="Room, office, etc."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <!-- Actions -->
                <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="emit('close')"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow"
                        :disabled="isSubmitting"
                        :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
                        {{ isSubmitting ? 'Saving...' : (form.id ? 'Update Item' : 'Add Item') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from 'axios'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ initial: Object })
const emit = defineEmits(['saved', 'close'])

const isSubmitting = ref(false)

const token = localStorage.getItem('token')

const emptyForm = {
    name: '',
    type: '',
    category: '',
    brand: '',
    serial_number: '',
    quantity: 0,
    unit: '',
    reorder_level: 0,
    location: '',
}

const form = reactive(props.initial ? { ...props.initial } : { ...emptyForm })

watch(() => props.initial, (newVal) => {
    if (newVal) Object.assign(form, newVal)
})

const submit = async () => {
    isSubmitting.value = true
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }

        if (form.id) {
            await axios.put(`http://localhost:8000/api/items/${form.id}`, form, { headers })
        } else {
            await axios.post('http://localhost:8000/api/items', form, { headers })
            Object.assign(form, { ...emptyForm }) // reset form
        }

        emit('saved')
        emit('close')
    } catch (e) {
        alert('Failed to save item')
        console.error(e)
    } finally {
        isSubmitting.value = false
    }
}
</script>
