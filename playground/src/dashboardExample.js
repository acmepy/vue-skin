export const dashboardExample = {
  title: 'Resumen del negocio',
  description: 'Datos de demostración · Últimos seis meses',
  summary: [
    { id: 'sales', label: 'Ventas', value: '$48.250', trend: '+12,8%', variant: 'success', description: 'Respecto al período anterior' },
    { id: 'orders', label: 'Pedidos', value: 384, trend: '+8,2%', variant: 'success', description: 'Pedidos recibidos este mes' },
    { id: 'customers', label: 'Clientes activos', value: 1240, trend: '+5,4%', variant: 'success', description: 'Clientes con actividad reciente' },
    { id: 'pending', label: 'Pendientes', value: 18, trend: 'Por revisar', variant: 'warning', description: 'Pedidos pendientes de entrega' }
  ],
  charts: [
    { id: 'sales', title: 'Ventas mensuales', type: 'bar', data: { labels: ['Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'], datasets: [{ label: 'Ventas ($)', data: [28000, 32000, 30500, 39000, 42800, 48250], backgroundColor: '#0d6efd' }] }, options: { scales: { y: { beginAtZero: true } } } },
    { id: 'orders', title: 'Evolución de pedidos', type: 'line', data: { labels: ['Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'], datasets: [{ label: 'Pedidos', data: [220, 245, 238, 310, 355, 384], borderColor: '#198754', backgroundColor: '#198754', tension: .3 }] } },
    { id: 'channels', title: 'Ventas por canal', type: 'doughnut', data: { labels: ['Tienda', 'Web', 'Distribuidores'], datasets: [{ label: 'Ventas', data: [45, 35, 20], backgroundColor: ['#0d6efd', '#198754', '#ffc107'] }] } }
  ],
  tables: [
    { id: 'orders', title: 'Últimos pedidos', filter: true, striped: true, scroll: '20rem', footer: 'Pedidos de demostración, sin conexión a un servidor.', header: { reference: { label: 'Pedido' }, customer: { label: 'Cliente' }, date: { label: 'Fecha' }, total: { label: 'Total ($)', align: 'end' }, status: { label: 'Estado', align: 'center' } }, data: [
      { id: 1, reference: 'PED-1048', customer: 'Ana López', date: '2026-09-28', total: 245, status: 'Entregado' },
      { id: 2, reference: 'PED-1049', customer: 'Luis Pérez', date: '2026-09-28', total: 580, status: 'Pendiente' },
      { id: 3, reference: 'PED-1050', customer: 'María García', date: '2026-09-29', total: 120, status: 'En preparación' },
      { id: 4, reference: 'PED-1051', customer: 'Carlos Díaz', date: '2026-09-29', total: 890, status: 'Entregado' },
      { id: 5, reference: 'PED-1052', customer: 'Sofía Torres', date: '2026-09-30', total: 360, status: 'Pendiente' }
    ] },
    { id: 'products', title: 'Productos destacados', striped: true, header: { name: { label: 'Producto' }, units: { label: 'Unidades', align: 'end' }, revenue: { label: 'Ingresos ($)', align: 'end' } }, data: [
      { id: 1, name: 'Plan profesional', units: 128, revenue: 19200 },
      { id: 2, name: 'Plan básico', units: 210, revenue: 10500 },
      { id: 3, name: 'Soporte premium', units: 45, revenue: 6750 }
    ] }
  ]
}

export const dashboardExampleCode = `<script setup>
import { UiDashboard } from '@vue-skin/layouts'

const dashboard = ${JSON.stringify(dashboardExample, null, 2)}
</script>

<template>
  <UiDashboard v-bind="dashboard" />
</template>`
