import { createRouter, createWebHistory } from 'vue-router'
import MinhasSubmissoesView from '../views/MinhasSubmissoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'submissoes', component: MinhasSubmissoesView, meta: { titulo: 'Minhas submissões' } },
    {
      path: '/enviar-sinal',
      name: 'enviar-sinal',
      component: () => import('../views/EnviarSinalView.vue'),
      meta: { titulo: 'Enviar sinal' },
    },
    {
      path: '/submissoes/:id/editar',
      name: 'editar-submissao',
      component: () => import('../views/EnviarSinalView.vue'),
      meta: { titulo: 'Editar submissão' },
    },
    { path: '/:caminho(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.titulo ? `${to.meta.titulo} · Dicionário de Libras` : 'Dicionário de Libras'
})

export default router
