<script setup lang="ts">
defineProps<{ icone: string; titulo: string; descricao?: string }>()
</script>

<template>
  <div class="vazio">
    <span class="icone"><i :class="icone" aria-hidden="true" /></span>
    <p class="titulo">{{ titulo }}</p>
    <p v-if="descricao" class="descricao">{{ descricao }}</p>
    <slot />
  </div>
</template>

<style scoped>
.vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
  gap: 0.25rem;
}
.icone {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primaria-suave);
  color: var(--primaria);
  font-size: 1.35rem;
  margin-bottom: 0.75rem;
}
.titulo {
  margin: 0;
  font-weight: 600;
}
.descricao {
  margin: 0 0 1rem;
  color: var(--texto-suave);
  font-size: 0.9rem;
  max-width: 44ch;
}
.icone i {
  font-size: inherit;
}
</style>
