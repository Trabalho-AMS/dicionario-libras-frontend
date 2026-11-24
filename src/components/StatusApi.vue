<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { statusApi } from '@/services/api'

const status = ref<'verificando...' | 'online' | 'indisponível'>('verificando...')

onMounted(async () => {
  try {
    const resposta = await statusApi.verificar()
    status.value = resposta.status === 'ok' ? 'online' : 'indisponível'
  } catch {
    status.value = 'indisponível'
  }
})

const classe = computed(() => ({ online: status.value === 'online', fora: status.value === 'indisponível' }))
</script>

<template>
  <p class="status" :class="classe" role="status">
    <span class="ponto" aria-hidden="true" />
    API: {{ status }}
  </p>
</template>

<style scoped>
.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  color: var(--texto-suave);
}
.ponto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}
.online .ponto {
  background: #10b981;
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.2);
}
.fora .ponto {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2);
}
</style>
