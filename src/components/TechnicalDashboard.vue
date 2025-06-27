<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4">Technical Dashboard</h2>
      <p>{{ message }}</p>
      <button
        @click="logout"
        class="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      message: 'Loading...',
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8000/api/technical/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      this.message = response.data.message
    } catch (error) {
      this.message = 'Failed to load dashboard'
      this.$router.push('/')
    }
  },
  methods: {
    async logout() {
      try {
        await axios.post('http://localhost:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      } catch (error) {
        console.error('Logout failed:', error)
      }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/')
    },
  },
}
</script>