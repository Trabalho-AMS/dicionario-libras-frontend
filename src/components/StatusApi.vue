<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { statusApi } from '@/services/api'

const status = ref('verificando...')

onMounted(async () => {
  try {
    const resposta = await statusApi.verificar()
    status.value = resposta.status === 'ok' ? 'online' : 'indisponível'
  } catch {
    status.value = 'indisponível'
  }
})
</script>

<template>
  <p>API: {{ status }}</p>
</template>
