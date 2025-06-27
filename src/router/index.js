import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import TechnicalDashboard from '../Role/Technical/TechnicalDashboard.vue'
import UserDashboard from '../Role/User/UserDashboard.vue'
import AdminDashboard from '../Role/Admin/AdminDashboard.vue'


const routes = [
    {
        path: '/',
        component: Login,
        meta: { guestOnly: true }, // ✅ Only for unauthenticated users
    },
    {
        path: '/user',
        component: UserDashboard,
        meta: { requiresAuth: true, role: 'user' },
    },
    {
        path: '/technical',
        component: TechnicalDashboard,
        meta: { requiresAuth: true, role: 'technical' },
    },
    {
        path: '/admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    // ⛔ Block logged-in users from accessing login page again
    if (to.meta.guestOnly && token && user) {
        switch (user.role) {
            case 'admin':
                return next('/admin')
            case 'technical':
                return next('/technical')
            case 'user':
                return next('/user')
            default:
                return next('/')
        }
    }

    // 🔒 Auth required but no token
    if (to.meta.requiresAuth && !token) {
        return next('/')
    }

    // 🔐 Auth required and role doesn't match
    if (to.meta.requiresAuth && user?.role !== to.meta.role) {
        return next('/')
    }

    // ✅ All good, proceed
    next()
})

export default router
