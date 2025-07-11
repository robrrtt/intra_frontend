<template>
    <div class="bg-white p-4 shadow rounded">
        <h2 class="font-semibold mb-2">Item Categories</h2>
        <canvas id="categoryChart"></canvas>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'

const token = localStorage.getItem('token')
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/json',
}

const loadItemsAndRenderChart = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/items/all', { headers })
    const items = res.data

    // ✅ Group by item name
    const nameCounts = {}
    items.forEach(item => {
      const name = item.name || 'Unnamed'
      nameCounts[name] = (nameCounts[name] || 0) + 1
    })

    const labels = Object.keys(nameCounts)
    const data = Object.values(nameCounts)

    console.log('📊 Labels:', labels)
    console.log('📦 Data:', data)

    const ctx = document.getElementById('categoryChart')
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
            '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e',
            '#22c55e', '#0ea5e9', '#a855f7', '#f97316',
            '#6366f1', '#e11d48', '#84cc16', '#facc15'
          ].slice(0, labels.length) // adjust if there are many names
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ''
                const value = context.parsed
                return `${label}: ${value} item${value !== 1 ? 's' : ''}`
              }
            }
          }
        }
      }
    })

  } catch (error) {
    console.error('❌ Error loading items:', error)
    alert('Failed to load item name data.')
  }
}

onMounted(() => {
  loadItemsAndRenderChart()
})
</script>

