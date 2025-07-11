<template>
    <AuthenticatedLayout />
    <div class="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        <!-- Navbar -->
        <header class="bg-white border-b shadow-sm">
            <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold tracking-tight text-gray-900">Admins Dashboard</h1>
                <button @click="logout"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
                    Logout
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 max-w-6xl mx-auto py-10 px-6">
            <div class="mb-8">
                <h2 class="text-xl font-semibold"> {{ message }}</h2>
                <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
            </div>

            <div class="bg-white rounded-xl shadow p-8 border border-gray-200">
                <h3 class="text-lg font-bold mb-6 border-b pb-2">Create a New User</h3>

                <form @submit.prevent="createUser" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium">Name</label>
                            <input type="text" v-model="form.name"
                                class="mt-1 w-full px-4 py-2 bg-gray-50 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                placeholder="John Doe" required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium">Email</label>
                            <input type="email" v-model="form.email"
                                class="mt-1 w-full px-4 py-2 bg-gray-50 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                placeholder="john@example.com" required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium">Password</label>
                            <input type="password" v-model="form.password"
                                class="mt-1 w-full px-4 py-2 bg-gray-50 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium">Role</label>
                            <select v-model="form.role"
                                class="mt-1 w-full px-4 py-2 bg-gray-50 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                                required>
                                <option value="" disabled>Select role</option>
                                <option value="user">User</option>
                                <option value="technical">Technical</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                            class="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                            ➕ Create User
                        </button>
                    </div>

                    <div v-if="success" class="text-green-600 text-center font-medium">
                        {{ success }}
                    </div>
                    <div v-if="createError" class="text-red-500 text-center font-medium">
                        {{ createError }}
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout.vue'

const router = useRouter()

const message = ref('Loading...')
const error = ref(null)
const success = ref(null)
const createError = ref(null)

const form = ref({
    name: '',
    email: '',
    password: '',
    role: 'user',
})

const getDashboard = async () => {
    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
        const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
        })
        message.value = response.data.message
    } catch (err) {
        error.value = err.response?.data?.error || 'Failed to load dashboard'
    }
}

const createUser = async () => {
    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })
        const response = await axios.post('http://localhost:8000/api/users', form.value, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
        })
        success.value = response.data.message
        createError.value = null
        form.value = {
            name: '',
            email: '',
            password: '',
            role: 'user',
        }
    } catch (err) {
        createError.value = err.response?.data?.error || 'Failed to create user'
        success.value = null
    }
}

const logout = async () => {
    try {
        await axios.post(
            'http://localhost:8000/api/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
    } catch (err) {
        console.error('Logout failed:', err)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
}

onMounted(getDashboard)
</script>
