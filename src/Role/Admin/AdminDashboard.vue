<template>
  <AdminLayout>

    <div class="min-h-screen bg-gray-100">
      <!-- Header Component -->
      <!-- Navbar -->
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- Dashboard Message -->
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900">{{ message }}</h2>
            <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
          </div>
          <!-- Show Create User Button -->
          <div class="mb-4">
            <button @click="showCreateModal = true"
              class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              + Create New User
            </button>
          </div>

          <!-- Modal -->
          <CreateUser v-if="showCreateModal" @close="showCreateModal = false" @user-created="handleUserCreated" />

          <Editmodal v-if="showEditModal" :form="form" @close="showEditModal = false"
            @user-updated="handleUserUpdated" />


          <!-- User Management -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">User Management</h3>

            <!-- Users Table -->
            <div v-if="users.length" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.role }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                      <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-gray-600 text-center">No users found.</p>
          </div>
        </div>
      </main>
    </div>
  </AdminLayout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CreateUser from './user/Create.vue'
import Editmodal from './user/Edit.vue'

import AdminLayout from './AdminLayout.vue'

const message = ref('Loading...')
const error = ref(null)
const users = ref([])
const showEditModal = ref(false)

const handleUserUpdated = (updatedUser) => {
  users.value = users.value.map(user =>
    user.id === updatedUser.id ? updatedUser : user
  )
  showEditModal.value = false
  editing.value = false
}

const form = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'user',
})

const showCreateModal = ref(false)

const handleUserCreated = (newUser) => {
  users.value.push(newUser)
  showCreateModal.value = false
}

const success = ref(null)
const createError = ref(null)
const editing = ref(false)

const fetchData = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

    const dashboardResponse = await axios.get('http://localhost:8000/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true,
    })
    message.value = dashboardResponse.data.message

    const usersResponse = await axios.get('http://localhost:8000/api/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true,
    })
    users.value = usersResponse.data.users
  } catch (err) {
    console.error('Error:', err.response?.data || err.message)
    error.value = err.response?.data?.error || 'Failed to load dashboard'
  }
}

onMounted(fetchData)

const saveUser = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

    const payload = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
    }

    if (form.value.password) {
      payload.password = form.value.password
    }

    let response
    if (editing.value) {
      response = await axios.put(`http://localhost:8000/api/users/${form.value.id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })

      users.value = users.value.map(user =>
        user.id === form.value.id ? response.data.user : user
      )
    } else {
      response = await axios.post('http://localhost:8000/api/users', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })

      users.value.push(response.data.user)
    }

    success.value = response.data.message
    createError.value = null
    resetForm()
  } catch (err) {
    createError.value = err.response?.data?.error || 'Failed to save user'
    success.value = null
  }
}
const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })

      users.value = users.value.filter(user => user.id !== id)
      success.value = 'User deleted successfully'
      createError.value = null
    } catch (err) {
      createError.value = err.response?.data?.error || 'Failed to delete user'
      success.value = null
    }
  }
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'user',
  }
  editing.value = false
}

const editUser = (user) => {
  form.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
  }
  editing.value = true
  showEditModal.value = true
}

</script>
