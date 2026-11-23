import { createRouter, createWebHistory } from 'vue-router'
import BuscaView from '../views/BuscaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'busca', component: BuscaView },
    { path: '/verbetes/:id', name: 'verbete', component: () => import('../views/VerbeteView.vue') },
    { path: '/enviar-sinal', name: 'enviar-sinal', component: () => import('../views/EnviarSinalView.vue') },
    {
      path: '/minhas-submissoes',
      name: 'minhas-submissoes',
      component: () => import('../views/MinhasSubmissoesView.vue'),
    },
    { path: '/curadoria', name: 'curadoria', component: () => import('../views/CuradoriaView.vue') },
    { path: '/administracao', name: 'administracao', component: () => import('../views/AdministracaoView.vue') },
  ],
})

export default router
