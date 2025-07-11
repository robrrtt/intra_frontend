import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import TechnicalDashboard from '../Role/Technical/TechnicalDashboard.vue'
import UserDashboard from '../Role/User/UserDashboard.vue'
import AdminDashboard from '../Role/Admin/AdminDashboard.vue'
import TicketsAdmin from '../components/Tickets/IndexAdmin.vue' // or wherever your file is
import Problem from '../components/Problems/Index.vue' // or wherever your file is
import charts from '../components/charts/Dashboard.vue' // or correct path
import AdminItem from '../components/Item/ItemDashboard.vue' // or correct path
import Inventory from '../components/Inventory/Index.vue' // or wherever your file is


const routes = [
    {
        path: '/',
        component: Login,
        meta: { guestOnly: true }, // ✅ Only for unauthenticated users
    },
    {
        path: '/user/dashboard',
        component: UserDashboard,
        meta: { requiresAuth: true, role: 'user' },
    },
    {
        path: '/technical/dashboard',
        component: TechnicalDashboard,
        meta: { requiresAuth: true, role: 'technical' },
    },
    {
        path: '/admin/dashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin' },
    },
    {
        path: '/admin/charts',
        component: charts,
        meta: { requiresAuth: true, role: 'admin' },
    },
        {
        path: '/admin/item',
        component: AdminItem,
        meta: { requiresAuth: true, role: 'admin' },
    },
    {
        path: '/admin/tickets',
        component: TicketsAdmin,
        meta: { requiresAuth: true, roles: ['admin', 'technical'] },
    },
    {
        path: '/tickets/:id/edit',
        name: 'EditTicket',
        component: () => import('@/components/Tickets/Edit.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin', 'technical'] },
    },
    {
        path: '/admin/problems',
        component: Problem,
        meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
        path: '/admin/problems/create',
        component: () => import('@/components/Problems/Create.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
        path: '/admin/problems/:id/edit',
        component: () => import('@/components/Problems/Edit.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin'] },
    },

    {
        path: '/admin/inventory',
        component: Inventory,
        meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
        path: '/admin/inventory/create',
        component: () => import('@/components/inventory/Create.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
        path: '/admin/inventory/:id/edit',
        component: () => import('@/components/inventory/Edit.vue'),
        props: true,
        meta: { requiresAuth: true, roles: ['admin'] },
    },

    //create item category
        {
        path: '/admin/itemcategory/create',
        component: () => import('@/components/ItemCategory/Create.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
    },



]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    // ⛔ Redirect authenticated users away from login
    if (to.meta.guestOnly && token && user) {
        switch (user.role) {
            case 'admin':
                return next('/admin/dashboard')
            case 'technical':
                return next('/technical/dashboard')
            case 'user':
                return next('/user/dashboard')
            default:
                return next('/')
        }
    }

    // 🔒 Requires login, but no token
    if (to.meta.requiresAuth && !token) {
        return next('/')
    }

    // ✅ Only check role match if route actually defines one
    if (to.meta.requiresAuth && to.meta.roles && !to.meta.roles.includes(user?.role)) {
        return next('/')
    }


    next()
})


export default router
