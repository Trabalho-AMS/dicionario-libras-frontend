<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import Drawer from 'primevue/drawer'
import Toast from 'primevue/toast'
import AppSidebar from './components/layout/AppSidebar.vue'
import { useTema } from './composables/useTema'

const { escuro, alternar } = useTema()
const menuAberto = ref(false)
const rota = useRoute()
const pagina = computed(() => (rota.meta.titulo as string | undefined) ?? '')
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
          <span>Submissões</span>
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
        </div>
      </header>

      <main id="conteudo">
        <RouterView />
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
  .trilha {
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
