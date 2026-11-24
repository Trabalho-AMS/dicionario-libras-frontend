<script setup lang="ts">
import Tag from 'primevue/tag'
import { STATUS } from '@/data/status'
import type { StatusSubmissao } from '@/types/api'

defineProps<{ status: StatusSubmissao }>()
</script>

<template>
  <Tag :value="STATUS[status].rotulo" :severity="STATUS[status].severidade" :icon="STATUS[status].icone" rounded />
</template>
