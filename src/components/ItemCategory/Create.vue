<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
      <!-- Close Button -->
      <button @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
        aria-label="Close">
        ×
      </button>
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Create New Item Category</h2>

        <form @submit.prevent="submitCategory" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Type -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <select v-model="form.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required>
              <option disabled value="">Select type</option>
              <option>Consumable</option>
              <option>Non-Consumable</option>
            </select>
          </div>

          <!-- Category Name -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Category Name</label>
            <input v-model="form.category" type="text" placeholder="e.g., Mouse, Monitor"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required />
          </div>

          <!-- Serial Number (read-only) -->
          <div class="md:col-span-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Serial Number</label>
            <input v-model="form.serial_number" type="text" readonly
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required />
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="form.description" placeholder="e.g., Used for printing office documents"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3" required></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="md:col-span-2 text-red-600 text-center">
            {{ errorMessage }}
          </div>

          <!-- Buttons -->
          <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button type="reset" class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
              Reset
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }">
              {{ isSubmitting ? 'Saving...' : 'Save Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'

import axios from 'axios'

// Reactive form fields
const form = ref({
  type: '',
  category: '',
  serial_number: '',
  description: ''

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

// Utility to generate a random ID
const generateRandomId = () => {
  return Math.floor(100 + Math.random() * 900) // 3-digit random number
}

// Watch the form.type and auto-generate serial_number
watch(() => form.value.type, (newType) => {
  if (newType === 'Consumable') {
    form.value.serial_number = `ISAC-CON-${generateRandomId()}`
  } else if (newType === 'Non-Consumable') {
    form.value.serial_number = `ISAC-NCON-${generateRandomId()}`
  } else {
    form.value.serial_number = ''
  }
})


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
