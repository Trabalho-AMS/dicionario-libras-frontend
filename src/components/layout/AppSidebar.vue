<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MarcaLogo from './MarcaLogo.vue'
import StatusApi from '../StatusApi.vue'

defineEmits<{ navegou: [] }>()

const grupos = [
  {
    titulo: 'Submissões',
    itens: [
      { rota: '/', rotulo: 'Minhas submissões', icone: 'pi pi-inbox' },
      { rota: '/enviar-sinal', rotulo: 'Enviar sinal', icone: 'pi pi-video' },
    ],
  },
]
</script>

<template>
  <div class="sidebar">
    <RouterLink to="/" class="marca" @click="$emit('navegou')">
      <MarcaLogo />
      <span>
        <strong>Dicionário de Libras</strong>
        <small>Expansão colaborativa</small>
      </span>
    </RouterLink>

    <nav aria-label="Navegação principal">
      <div v-for="grupo in grupos" :key="grupo.titulo" class="grupo">
        <p class="grupo-titulo">{{ grupo.titulo }}</p>
        <RouterLink
          v-for="item in grupo.itens"
          :key="item.rota"
          :to="item.rota"
          class="item"
          @click="$emit('navegou')"
        >
          <i :class="item.icone" aria-hidden="true" />
          <span>{{ item.rotulo }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="rodape">
      <div class="cartao-ajuda">
        <i class="pi pi-sparkles" aria-hidden="true" />
        <p><strong>Toda contribuição</strong> passa por um curador antes de ser publicada.</p>
      </div>
      <StatusApi />
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 1rem;
  gap: 1.5rem;
}
.marca {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
  color: var(--texto);
}
.marca strong {
  display: block;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}
.marca small {
  display: block;
  color: var(--texto-suave);
  font-size: 0.75rem;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}
.grupo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.grupo-titulo {
  margin: 0 0 0.375rem;
  padding: 0 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--texto-suave);
}
.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  color: var(--texto-suave);
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.item i {
  font-size: 1rem;
  width: 1.1rem;
}
.item:hover {
  background: var(--superficie-suave);
  color: var(--texto);
}
.item.router-link-exact-active {
  background: var(--primaria-suave);
  color: var(--primaria);
  font-weight: 600;
}
.rodape {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.cartao-ajuda {
  display: flex;
  gap: 0.625rem;
  padding: 0.875rem;
  border-radius: 12px;
  background: var(--destaque-suave);
  color: var(--texto);
  font-size: 0.8125rem;
  line-height: 1.45;
}
.cartao-ajuda i {
  color: var(--destaque);
  margin-top: 2px;
}
.cartao-ajuda p {
  margin: 0;
}
</style>
