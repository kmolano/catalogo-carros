import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CarDetailView from '../views/CarDetailView.vue'
import ComprarView from '../views/ComprarView.vue'
import CompraExitosaView from '../views/CompraExitosaView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auto/:id',
      name: 'car-detail',
      component: CarDetailView,
    },
    {
      path: '/auto/:id/comprar',
      name: 'comprar',
      component: ComprarView,
    },
    {
      path: '/compra-exitosa',
      name: 'compra-exitosa',
      component: CompraExitosaView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
