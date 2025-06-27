<template>
    <TechnicalLayout>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md">
            <h2 class="text-2xl font-bold mb-4">Technical Dashboard</h2>
            <p>{{ message }}</p>
            <button @click="logout"
                class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                Logout
            </button>
        </div>
    </div>

    </TechnicalLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TechnicalLayout from './TechnicalLayout.vue'

const message = ref('Loading...')
const router = useRouter()

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/technical/dashboard', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        message.value = response.data.message
    } catch (error) {
        message.value = 'Failed to load dashboard'
        router.push('/')
    }
})

const logout = async () => {
    try {
        await axios.post('http://localhost:8000/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
    } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message)
    }

    // Clear local storage and redirect
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
}
</script>