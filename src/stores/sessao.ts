import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { CHAVE_USUARIO, usuariosApi } from '@/services/api'
import type { Usuario } from '@/types/api'

function lerUsuarioSalvo(): string | null {
  try {
    return localStorage.getItem(CHAVE_USUARIO)
  } catch {
    return null
  }
}

/**
 * Usuário atual. Enquanto o protótipo não tem login, o usuário escolhe um dos perfis de demonstração
 * (colaborador ou curador) no topo da tela.
 */
export const useSessaoStore = defineStore('sessao', () => {
  const usuarios = ref<Usuario[]>([])
  const usuarioId = ref<string | null>(lerUsuarioSalvo())
  const carregado = ref(false)

  const usuario = computed(() => usuarios.value.find((u) => u.id === usuarioId.value) ?? null)
  const ehCurador = computed(() => usuario.value?.perfil === 'CURADOR' || usuario.value?.perfil === 'ADMINISTRADOR')

  function trocar(id: string) {
    usuarioId.value = id
    try {
      localStorage.setItem(CHAVE_USUARIO, id)
    } catch {
      // sem armazenamento local, a escolha vale só nesta aba
    }
  }

  async function carregar() {
    try {
      usuarios.value = await usuariosApi.listar()
    } catch {
      usuarios.value = []
    }
    if (!usuario.value && usuarios.value.length) trocar(usuarios.value[0]!.id)
    carregado.value = true
  }

  return { usuarios, usuario, usuarioId, ehCurador, carregado, trocar, carregar }
})
