<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-lg p-8 mx-4 animate-slide-fade">
            <!-- Close Button -->
            <button @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
                aria-label="Close">
                &times;
            </button>

            <!-- Title -->
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Edit User
            </h2>

            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-5">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input v-model="localForm.name" id="name" type="text" placeholder="John Doe"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="localForm.email" id="email" type="email" placeholder="john@example.com"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required />
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select v-model="localForm.role" id="role"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required>
                        <option value="user">User</option>
                        <option value="technical">Technical</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 transition">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'user-updated'])

const props = defineProps({
    form: Object
})

const localForm = reactive({ ...props.form })

watch(() => props.form, (newVal) => {
    Object.assign(localForm, newVal)
})

const submit = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/api/users/${localForm.id}`, localForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
        })

        emit('user-updated', response.data.user)
        emit('close')
    } catch (err) {
        console.error('Update failed:', err.response?.data || err.message)
    }
}
</script>

<style scoped>
@keyframes slide-fade {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.3s ease-out;
}
</style>
