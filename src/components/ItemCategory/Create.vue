<template>
    <AdminLayout>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
    <h2 class="text-2xl font-semibold mb-4">Create New Item Category</h2>

    <form @submit.prevent="submitCategory" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Type</label>
        <select v-model="form.type" class="w-full border p-2 rounded" required>
          <option disabled value="">Select type</option>
          <option>Consumable</option>
          <option>Non-Consumable</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium">Category Name</label>
        <input
          v-model="form.category"
          type="text"
          class="w-full border p-2 rounded"
          placeholder="e.g., Mouse, Monitor"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Serial Number</label>
        <input
          v-model="form.serial_number"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Category
      </button>
    </form>

    <!-- Category List (Optional) -->
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-2">Existing Categories</h3>
      <table class="w-full text-sm border">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">Type</th>
            <th class="p-2">Category</th>
            <th class="p-2">Serial Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id" class="border-t">
            <td class="p-2">{{ cat.type }}</td>
            <td class="p-2">{{ cat.category }}</td>
            <td class="p-2">{{ cat.serial_number }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

// Reactive form fields
const form = ref({
  type: '',
  category: '',
  serial_number: ''
})

// Submission state
const isSubmitting = ref(false)
const errorMessage = ref('')

// Optional: define emits if needed (e.g., for modals)
const emit = defineEmits(['item-created', 'close'])

const categories = ref([])

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:8000/api/item-categories')
  categories.value = res.data
}

const submitCategory = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await axios.post('http://localhost:8000/api/item-categories', form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Accept: 'application/json'
      },
      withCredentials: true
    })

    alert('Category created successfully!')

    // Clear form
    form.value = { type: '', category: '', serial_number: '' }

    fetchCategories()

    // Optional emits
    emit('item-created')
    emit('close')
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Failed to create item.'
    alert(errorMessage.value)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

