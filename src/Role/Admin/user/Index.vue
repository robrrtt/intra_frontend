<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">User Management</h2>
            <RouterLink to="/admin/users/create" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                ➕ Create New User
            </RouterLink>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4">{{ user.name }}</td>
                    <td class="px-6 py-4">{{ user.email }}</td>
                    <td class="px-6 py-4">{{ user.role }}</td>
                    <td class="px-6 py-4 space-x-4">
                        <RouterLink :to="`/admin/users/${user.id}/edit`" class="text-indigo-600 hover:underline">Edit
                        </RouterLink>
                        <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-if="!users.length" class="text-center text-gray-500 mt-6">No users found.</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            users: [],
        }
    },
    async mounted() {
        await this.loadUsers()
    },
    methods: {
        async loadUsers() {
            const res = await axios.get('http://localhost:8000/api/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true,
            })
            this.users = res.data.users
        },
        async deleteUser(id) {
            if (confirm('Are you sure you want to delete this user?')) {
                await axios.delete(`http://localhost:8000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    withCredentials: true,
                })
                this.users = this.users.filter(u => u.id !== id)
            }
        },
    },
}
</script>
