<script setup lang="ts">
defineProps<{ titulo: string; descricao?: string }>()
</script>

<template>
  <header class="cabecalho">
    <div>
      <h1>{{ titulo }}</h1>
      <p v-if="descricao">{{ descricao }}</p>
    </div>
    <div class="acoes"><slot name="acoes" /></div>
  </header>
</template>

<style scoped>
.cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}
h1 {
  font-size: 1.625rem;
  font-weight: 700;
}
p {
  margin: 0.375rem 0 0;
  color: var(--texto-suave);
  max-width: 60ch;
}
.acoes {
  display: flex;
  gap: 0.5rem;
}
</style>
