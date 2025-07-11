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
                    <RouterLink to="/admin/dashboard" :class="[baseLink, isActive('/admin/dashboard') ? activeLink : '']">
                        Accounts
                    </RouterLink>
                    <!--<RouterLink to="/admin/tickets" :class="[baseLink, isActive('/admin/tickets') ? activeLink : '']">
                        Tickets
                    </RouterLink>
                    <RouterLink to="/admin/problems" :class="[baseLink, isActive('/admin/problems') ? activeLink : '']">
                        Problems
                    
                    </RouterLink>
                    -->
                    <RouterLink to="/admin/charts" :class="[baseLink, isActive('/admin/charts') ? activeLink : '']">
                        Chart
                    </RouterLink>
                    <!--
                    <RouterLink to="/admin/item" :class="[baseLink, isActive('/admin/item') ? activeLink : '']">
                        Item
                    </RouterLink>
                     -->
                    <RouterLink to="/admin/inventory" :class="[baseLink, isActive('/admin/inventory') ? activeLink : '']">
                        Supply
                    </RouterLink>
                    <RouterLink to="/admin/ItemCategory/Create" :class="[baseLink, isActive('/admin/ItemCategory/Create') ? activeLink : '']">
                        Category
                    </RouterLink>
                    <button @click="logout"
                        class="ml-2 flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm lg:text-base hover:bg-red-700 transition duration-200 shadow-sm">
                        Logout
                    </button>
                </nav>
            </div>

            <!-- Mobile Navigation 
            <transition name="fade">
                <nav v-if="isMobileNavOpen" class="md:hidden mt-2 space-y-1 bg-white px-2 py-3 rounded shadow-sm">
                    <RouterLink to="/" class="block py-2 text-gray-900 font-semibold" @click="isMobileNavOpen = false">
                        Home</RouterLink>
                    <RouterLink to="/tickets" class="block py-2 text-gray-900" @click="isMobileNavOpen = false">tickets
                    
                    </RouterLink>   


                    <button class="block py-2 text-gray-900 w-full text-left">Services</button>
                    <button class="block py-2 text-gray-900 w-full text-left">About Us</button>
                    <button @click="logout" class="block py-2 text-gray-600 w-full text-left">Logout</button>
                </nav>
            </transition>
        -->
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
        <slot />
    </main>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'

const isMobileNavOpen = ref(false)
const route = useRoute()
const router = useRouter()

// Class constants
const baseLink = 'relative block py-2 px-2 lg:px-3 transition-all text-sm lg:text-base whitespace-nowrap text-gray-950 font-bold'
const activeLink = 'text-indigo-700 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-yellow-500 after:rounded-lg'

// Route checker
const isActive = (path) => route.path === path

// Logout
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