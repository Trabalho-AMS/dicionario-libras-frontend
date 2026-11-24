import { createRouter, createWebHistory } from 'vue-router'
import BuscaView from '../views/BuscaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'busca', component: BuscaView, meta: { secao: 'Dicionário', titulo: 'Buscar sinais' } },
    {
      path: '/verbetes/:id',
      name: 'verbete',
      component: () => import('../views/VerbeteView.vue'),
      meta: { secao: 'Dicionário', titulo: 'Verbete' },
    },
    {
      path: '/enviar-sinal',
      name: 'enviar-sinal',
      component: () => import('../views/EnviarSinalView.vue'),
      meta: { secao: 'Contribuir', titulo: 'Enviar sinal' },
    },
    {
      path: '/minhas-submissoes',
      name: 'minhas-submissoes',
      component: () => import('../views/MinhasSubmissoesView.vue'),
      meta: { secao: 'Contribuir', titulo: 'Minhas submissões' },
    },
    {
      path: '/curadoria',
      name: 'curadoria',
      component: () => import('../views/CuradoriaView.vue'),
      meta: { secao: 'Gestão', titulo: 'Curadoria' },
    },
    {
      path: '/administracao',
      name: 'administracao',
      component: () => import('../views/AdministracaoView.vue'),
      meta: { secao: 'Gestão', titulo: 'Administração' },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.titulo ? `${to.meta.titulo} · Dicionário de Libras` : 'Dicionário de Libras'
})

export default router
