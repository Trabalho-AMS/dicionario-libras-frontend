<script setup>
import { RouterLink, RouterView } from 'vue-router'
import StatusApi from './components/StatusApi.vue'
</script>

<template>
  <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>

  <header class="topo">
    <RouterLink to="/" class="marca">Dicionário de Libras</RouterLink>
    <nav aria-label="Navegação principal">
      <RouterLink to="/">Buscar</RouterLink>
      <RouterLink to="/enviar-sinal">Enviar sinal</RouterLink>
      <RouterLink to="/minhas-submissoes">Minhas submissões</RouterLink>
      <RouterLink to="/curadoria">Curadoria</RouterLink>
      <RouterLink to="/administracao">Administração</RouterLink>
    </nav>
  </header>

  <main id="conteudo">
    <RouterView />
  </main>

  <footer class="rodape">
    <StatusApi />
  </footer>
</template>

<style scoped>
.pular-conteudo {
  position: absolute;
  left: -9999px;
}
.pular-conteudo:focus {
  left: 1rem;
  top: 1rem;
}
.topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--cor-borda);
}
.marca {
  font-weight: 700;
  font-size: 1.25rem;
}
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
nav a.router-link-exact-active {
  font-weight: 700;
  text-decoration: underline;
}
main {
  padding: 2rem 0;
}
.rodape {
  border-top: 1px solid var(--cor-borda);
  padding: 1rem 0;
  font-size: 0.875rem;
}
</style>
