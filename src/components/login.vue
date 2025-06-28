<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label class="block text-gray-700">Email</label>
                    <input v-model="form.email" type="email"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required />
                </div>
                <div class="mb-6">
                    <label class="block text-gray-700">Password</label>
                    <input v-model="form.password" type="password"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required />
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
                    Login
                </button>
                <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            error: null,
        }
    },
    methods: {
        async login() {
            try {
                // Fetch CSRF token
                await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                    withCredentials: true,
                });

                // Make login request
                const response = await axios.post('http://localhost:8000/api/login', this.form, {
                    withCredentials: true,
                });
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                const role = response.data.user.role
                if (role === 'user') this.$router.push('/user/dashboard')
                else if (role === 'technical') this.$router.push('/technical/dashboard')
                else if (role === 'admin') this.$router.push('/admin/dashboard')
            } catch (error) {
                this.error = error.response?.data?.error || 'Login failed'
            }
        },
    },
    mounted() {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    if (token && user) {
        if (user.role === 'admin') this.$router.push('/admin/dashboard')
        else if (user.role === 'technical') this.$router.push('/technical/dashboard')
        else if (user.role === 'user') this.$router.push('/user/dashboard')
    }
}

}
</script>