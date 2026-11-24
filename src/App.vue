<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import Drawer from 'primevue/drawer'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import AppSidebar from './components/layout/AppSidebar.vue'
import { useTema } from './composables/useTema'
import { useSessaoStore } from './stores/sessao'

const { escuro, alternar } = useTema()
const menuAberto = ref(false)
const rota = useRoute()
const secao = computed(() => (rota.meta.secao as string | undefined) ?? 'Dicionário')
const pagina = computed(() => (rota.meta.titulo as string | undefined) ?? '')

const sessao = useSessaoStore()
onMounted(() => sessao.carregar())

const PERFIS = { COLABORADOR: 'Colaborador', CURADOR: 'Curador', ADMINISTRADOR: 'Administrador' } as const
const opcoesUsuario = computed(() =>
  sessao.usuarios.map((u) => ({ id: u.id, nome: u.nome, perfil: PERFIS[u.perfil] })),
)
const iniciais = (nome: string) =>
  nome
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
</script>

<template>
  <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
  <Toast position="top-right" />
  <ConfirmDialog />

  <div class="layout">
    <aside class="lateral">
      <AppSidebar />
    </aside>

    <Drawer v-model:visible="menuAberto" class="gaveta" :show-close-icon="false" header="Menu">
      <AppSidebar @navegou="menuAberto = false" />
    </Drawer>

    <div class="area">
      <header class="topo">
        <Button
          class="botao-menu"
          icon="pi pi-bars"
          text
          rounded
          severity="secondary"
          aria-label="Abrir menu"
          @click="menuAberto = true"
        />
        <nav class="trilha" aria-label="Você está em">
          <span>{{ secao }}</span>
          <i class="pi pi-angle-right" aria-hidden="true" />
          <strong>{{ pagina }}</strong>
        </nav>
        <div class="topo-acoes">
          <Button
            :icon="escuro ? 'pi pi-sun' : 'pi pi-moon'"
            text
            rounded
            severity="secondary"
            :aria-label="escuro ? 'Usar tema claro' : 'Usar tema escuro'"
            @click="alternar()"
          />
          <Select
            v-if="sessao.usuarios.length"
            :model-value="sessao.usuarioId"
            :options="opcoesUsuario"
            option-label="nome"
            option-value="id"
            class="seletor-usuario"
            aria-label="Entrar como (usuário de demonstração)"
            @update:model-value="sessao.trocar"
          >
            <template #value="{ value }">
              <span v-if="sessao.usuario && value" class="usuario">
                <span class="avatar" aria-hidden="true">{{ iniciais(sessao.usuario.nome) }}</span>
                <span class="usuario-texto">
                  <strong>{{ sessao.usuario.nome }}</strong>
                  <small>{{ PERFIS[sessao.usuario.perfil] }}</small>
                </span>
              </span>
            </template>
            <template #option="{ option }">
              <span class="usuario">
                <span class="avatar" aria-hidden="true">{{ iniciais(option.nome) }}</span>
                <span class="usuario-texto">
                  <strong>{{ option.nome }}</strong>
                  <small>{{ option.perfil }}</small>
                </span>
              </span>
            </template>
          </Select>
        </div>
      </header>

      <main id="conteudo">
        <RouterView :key="sessao.usuarioId ?? ''" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.pular-conteudo {
  position: absolute;
  left: -9999px;
  z-index: 100;
}
.pular-conteudo:focus {
  left: 1rem;
  top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--superficie);
  border-radius: 8px;
}
.layout {
  min-height: 100vh;
}
.lateral {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--largura-sidebar);
  background: var(--superficie);
  border-right: 1px solid var(--borda);
  overflow-y: auto;
}
.area {
  margin-left: var(--largura-sidebar);
  min-width: 0;
}
.topo {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 64px;
  padding: 0 2rem;
  background: color-mix(in srgb, var(--fundo) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--borda);
}
.botao-menu {
  display: none;
}
.trilha {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--texto-suave);
}
.trilha i {
  font-size: 0.75rem;
}
.trilha strong {
  color: var(--texto);
  font-weight: 600;
}
.topo-acoes {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.seletor-usuario {
  border-radius: 999px;
  padding-left: 0.25rem;
}
.usuario {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.usuario-texto {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.usuario-texto strong {
  font-size: 0.85rem;
  font-weight: 600;
}
.usuario-texto small {
  font-size: 0.72rem;
  color: var(--texto-suave);
}
.avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--gradiente-marca);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}
main {
  padding: 2rem;
  max-width: 1200px;
}

@media (max-width: 960px) {
  .lateral {
    display: none;
  }
  .area {
    margin-left: 0;
  }
  .botao-menu {
    display: inline-flex;
  }
  .topo {
    padding: 0 1rem;
  }
  .trilha,
  .seletor-usuario .usuario-texto {
    display: none;
  }
  main {
    padding: 1.25rem 1rem;
  }
}
</style>

<style>
.gaveta.p-drawer {
  width: var(--largura-sidebar);
}
.gaveta .p-drawer-content {
  padding: 0;
}
</style>
