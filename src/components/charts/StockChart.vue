<template>
  <div class="bg-white p-4 shadow rounded">
    <h2 class="font-semibold mb-2">Stock Levels</h2>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import axios from 'axios'

const chartRef = ref(null)
let chartInstance = null

const token = localStorage.getItem('token')

const fetchStockData = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/items?per_page=10', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
const items = res.data.data // because it's paginated

    const labels = items.map(item => item.name)
    const quantities = items.map(item => item.quantity)

    renderChart(labels, quantities)
  } catch (err) {
    console.error('Failed to load stock data:', err)
  }
}

const renderChart = (labels, data) => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Stock',
        data,
        backgroundColor: '#3b82f6',
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(fetchStockData)
</script>
