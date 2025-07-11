<template>
    <div class="bg-white p-4 shadow rounded mt-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold">Inventory Logs</h2>
            <input type="text" placeholder="Search logs..." class="border rounded px-2 py-1" />
        </div>
        <table class="w-full text-sm table-auto">
            <thead class="bg-gray-100">
                <tr>
                    <th class="text-left p-2">Date</th>
                    <th class="text-left p-2">Item</th>
                    <th class="text-left p-2">Action</th>
                    <th class="text-left p-2">User</th>
                    <th class="text-left p-2">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in logs" :key="log.id" class="border-t">
                    <td class="p-2">{{ log.date }}</td>
                    <td class="p-2">{{ log.item }}</td>
                    <td class="p-2">{{ log.action }}</td>
                    <td class="p-2">{{ log.user }}</td>
                    <td class="p-2">{{ log.quantity }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const logs = [
    { id: 1, date: '2025-07-08', item: 'Keyboard', action: 'OUT', user: 'Robert', quantity: 2 },
    { id: 2, date: '2025-07-08', item: 'Monitor', action: 'IN', user: 'Jane', quantity: 5 },
    { id: 3, date: '2025-07-09', item: 'Mouse', action: 'OUT', user: 'Aljon', quantity: 1 },
]
</script>
