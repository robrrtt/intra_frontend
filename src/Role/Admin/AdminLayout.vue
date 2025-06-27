<template>
    <header class="sticky top-0 z-50 bg-white shadow-sm rounded-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <div class="flex items-center space-x-4">
                    <a href="/" class="flex items-center space-x-3 min-w-0">
                        <img src="/src/assets/favicon.ico" alt="Intrastrata Logo" class="h-10 flex-shrink-0" />
                        <!-- Mobile Title -->
                        <h4 class="text-base font-extrabold text-gray-900 tracking-tight md:hidden">
                            Intrastrata Assurance Corp.
                        </h4>
                        <!-- Desktop Title -->
                        <h4
                            class="hidden md:block text-lg lg:text-xl xl:text-1xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            INTRASTRATA ASSURANCE CORPORATION
                        </h4>
                    </a>
                </div>

                <!-- Hamburger Button (Mobile) -->
                <button class="md:hidden text-gray-700 focus:outline-none" @click="isMobileNavOpen = !isMobileNavOpen">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            :d="isMobileNavOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
                    </svg>
                </button>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6 ml-auto">
                    <RouterLink to="/"
                        class="relative block py-2 px-2 lg:px-3 transition-all text-sm lg:text-base whitespace-nowrap text-gray-950 font-bold after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-yellow-500 after:rounded-lg"
                        exact-active-class="router-link-exact-active">
                        Home
                    </RouterLink>
                    <RouterLink to="/claims"
                        class="relative block py-2 px-2 lg:px-3 transition-all text-sm lg:text-base whitespace-nowrap text-gray-950 hover:font-bold">
                        Claims
                    </RouterLink>
                    <button
                        class="flex items-center py-2 px-2 lg:px-3 text-gray-950 hover:bg-gray-100 text-sm lg:text-base rounded-sm">
                        Services
                        <svg class="w-2.5 h-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <button
                        class="flex items-center py-2 px-2 lg:px-3 text-gray-950 hover:bg-gray-100 text-sm lg:text-base rounded-sm">
                        About Us
                        <svg class="w-2.5 h-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <button @click="logout"
                        class="ml-2 flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm lg:text-base hover:bg-red-700 transition duration-200 shadow-sm">
                        Logout
                    </button>
                </nav>
            </div>

            <!-- Mobile Navigation -->
            <transition name="fade">
                <nav v-if="isMobileNavOpen" class="md:hidden mt-2 space-y-1 bg-white px-2 py-3 rounded shadow-sm">
                    <RouterLink to="/" class="block py-2 text-gray-900 font-semibold" @click="isMobileNavOpen = false">
                        Home</RouterLink>
                    <RouterLink to="/claims" class="block py-2 text-gray-900" @click="isMobileNavOpen = false">Claims
                    </RouterLink>
                    <button class="block py-2 text-gray-900 w-full text-left">Services</button>
                    <button class="block py-2 text-gray-900 w-full text-left">About Us</button>
                    <button @click="logout" class="block py-2 text-gray-600 w-full text-left">Logout</button>
                </nav>
            </transition>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
        <slot />
    </main>
</template>


<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const logout = async () => {
    try {
        await axios.post('http://localhost:8000/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
    } catch (error) {
        console.error('Logout failed:', error)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
}
</script>
