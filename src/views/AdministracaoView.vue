<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'
import Tag from 'primevue/tag'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'
import { ASSUNTOS, CONFIGURACOES_MAO, REGIOES } from '@/data/apoio'

const regioes = REGIOES.filter((r) => r.uf)
const assuntos = ASSUNTOS.map((nome) => ({ nome }))
const configuracoes = CONFIGURACOES_MAO.map((codigo) => ({ codigo }))
const usuarios: { nome: string; email: string; perfil: string }[] = []
</script>

<template>
  <CabecalhoPagina titulo="Administração" descricao="Usuários, perfis e tabelas de apoio usadas na busca e nas variações regionais." />

  <div class="cartao painel">
    <Tabs value="usuarios">
      <TabList>
        <Tab value="usuarios"><i class="pi pi-users" aria-hidden="true" /> Usuários</Tab>
        <Tab value="regioes"><i class="pi pi-map-marker" aria-hidden="true" /> Regiões <Tag :value="regioes.length" rounded /></Tab>
        <Tab value="assuntos"><i class="pi pi-tags" aria-hidden="true" /> Assuntos <Tag :value="assuntos.length" rounded /></Tab>
        <Tab value="cm"><i class="pi pi-hand-pointer" aria-hidden="true" /> Configurações de mão</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="usuarios">
          <DataTable :value="usuarios" data-key="email">
            <Column field="nome" header="Nome" />
            <Column field="email" header="E-mail" />
            <Column field="perfil" header="Perfil" />
            <template #empty>
              <EstadoVazio icone="pi pi-users" titulo="Nenhum usuário cadastrado" descricao="Colaboradores, curadores e administradores aparecem aqui." />
            </template>
          </DataTable>
        </TabPanel>
        <TabPanel value="regioes">
          <DataTable :value="regioes" data-key="uf" paginator :rows="9" striped-rows>
            <Column field="uf" header="UF" style="width: 6rem" />
            <Column field="nome" header="Estado" />
          </DataTable>
        </TabPanel>
        <TabPanel value="assuntos">
          <DataTable :value="assuntos" data-key="nome" striped-rows>
            <Column field="nome" header="Assunto" />
          </DataTable>
        </TabPanel>
        <TabPanel value="cm">
          <div class="cms">
            <div v-for="c in configuracoes" :key="c.codigo" class="cm">
              <span><i class="pi pi-image" aria-hidden="true" /></span>
              {{ c.codigo }}
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.painel {
  padding: 0.5rem;
}
:deep(.p-tab) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cms {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}
.cm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--borda);
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
}
.cm span {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--superficie-suave);
  color: var(--texto-suave);
  font-size: 1.25rem;
}
</style>
