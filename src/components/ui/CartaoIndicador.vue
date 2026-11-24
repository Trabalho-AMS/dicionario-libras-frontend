<script setup lang="ts">
defineProps<{ rotulo: string; valor: number | string; icone: string; cor?: 'primaria' | 'destaque' | 'alerta' | 'perigo' }>()
</script>

<template>
  <div class="indicador cartao">
    <span class="icone" :class="cor ?? 'primaria'"><i :class="icone" aria-hidden="true" /></span>
    <div>
      <p class="rotulo">{{ rotulo }}</p>
      <p class="valor">{{ valor }}</p>
    </div>
  </div>
</template>

<style scoped>
.indicador {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
}
.icone {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 1.1rem;
}
.primaria {
  background: var(--primaria-suave);
  color: var(--primaria);
}
.destaque {
  background: var(--destaque-suave);
  color: var(--destaque);
}
.alerta {
  background: rgb(245 158 11 / 0.14);
  color: #d97706;
}
.perigo {
  background: rgb(239 68 68 / 0.12);
  color: #dc2626;
}
.rotulo {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--texto-suave);
}
.valor {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.icone i {
  font-size: inherit;
}
</style>
