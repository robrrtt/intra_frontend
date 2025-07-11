<template>
    <AdminLayout>
        <div class="p-6 space-y-6 bg-gray-100 min-h-screen">
            <h1 class="text-2xl font-bold">📦 Inventory Dashboard</h1>

            <SummaryCards />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StockChart />
                <CategoryChart />
            </div>

            <InventoryLogs />
        </div>
    </AdminLayout>
</template>

<script setup>
import SummaryCards from './SummaryCards.vue'
import StockChart from './StockChart.vue'
import CategoryChart from './CategoryChart.vue'
import InventoryLogs from './InventoryLogs.vue'
import AdminLayout from '@/Role/Admin/AdminLayout.vue'

</script>
