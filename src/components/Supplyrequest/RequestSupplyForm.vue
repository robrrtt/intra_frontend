<template>
    <AdminLayout>
        <div class="max-w-4xl mx-auto p-6">
            <h2 class="text-2xl font-bold mb-4">Request Supplies</h2>

            <!-- Supply Request Form -->
            <form @submit.prevent="submitRequest" class="space-y-4 bg-white p-4 rounded shadow">
                <div v-for="(entry, index) in form.items" :key="index" class="grid grid-cols-12 gap-4 items-end">
                    <!-- Item Selection -->
                    <div class="col-span-7">
                        <label class="block text-sm font-medium text-gray-700">Item</label>
                        <select v-model="entry.item_id"
                            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required>
                            <option disabled value="">-- Select Item --</option>
                            <option v-for="item in items" :key="item.id" :value="item.id">
                                {{ item.name }} ({{ item.quantity }} {{ item.unit }})
                            </option>
                        </select>
                    </div>

                    <!-- Quantity -->
                    <div class="col-span-3">
                        <label class="block text-sm font-medium text-gray-700">Quantity</label>
                        <input v-model.number="entry.quantity" type="number" min="1"
                            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required />
                    </div>

                    <!-- Remove Button -->
                    <div class="col-span-2">
                        <button type="button" @click="removeItem(index)" class="text-red-600 hover:underline text-sm"
                            v-if="form.items.length > 1">
                            Remove
                        </button>
                    </div>
                </div>

                <!-- Add Another Item -->
                <button type="button" @click="addItem" class="text-blue-600 text-sm hover:underline mt-2">
                    + Add another item
                </button>

                <!-- Submit -->
                <div class="pt-4">
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
                        Submit Request
                    </button>
                </div>

                <!-- Feedback -->
                <p v-if="message" :class="{
                    'text-green-600': success,
                    'text-red-600': !success
                }" class="mt-2">
                    {{ message }}
                </p>
            </form>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UserLayout from '@/Role/User/UserLayout.vue' // adjust path as needed
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

const items = ref([])
const form = ref({
    items: [{ item_id: '', quantity: 1 }]
})

const message = ref('')
const success = ref(false)

const fetchItems = async () => {
    try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get('http://localhost:8000/api/items', {
            headers: { Authorization: `Bearer ${token}` }
        })
        items.value = data.data // assuming paginated response
    } catch (err) {
        console.error('Error fetching items:', err)
    }
}

const addItem = () => {
    form.value.items.push({ item_id: '', quantity: 1 })
}

const removeItem = (index) => {
    form.value.items.splice(index, 1)
}

const submitRequest = async () => {
    try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8000/api/supply-requests', form.value, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
        message.value = 'Supply request submitted successfully!'
        success.value = true
        form.value.items = [{ item_id: '', quantity: 1 }]
    } catch (err) {
        console.error(err)
        message.value = 'Failed to submit request. Please try again.'
        success.value = false
    }
}

onMounted(fetchItems)
</script>
