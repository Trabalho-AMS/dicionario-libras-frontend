import { ref } from 'vue'
import { defineStore } from 'pinia'
import { dicionarioApi } from '@/services/api'
import type { Apoio } from '@/types/api'

/** Regiões, assuntos e configurações de mão vindos do backend (carregados uma vez). */
export const useApoioStore = defineStore('apoio', () => {
  const apoio = ref<Apoio>({ regioes: [], assuntos: [], configuracoesMao: [] })
  let carregamento: Promise<void> | null = null

  function carregar() {
    carregamento ??= dicionarioApi.apoio().then((dados) => {
      apoio.value = dados
    })
    return carregamento
  }

  return { apoio, carregar }
})
