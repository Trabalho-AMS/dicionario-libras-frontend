<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import DetalheSubmissao from '@/components/DetalheSubmissao.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'
import EtiquetaStatus from '@/components/ui/EtiquetaStatus.vue'
import { formatarData, nomeRegiao } from '@/data/status'
import { submissoesApi } from '@/services/api'
import type { Submissao } from '@/types/api'

const toast = useToast()
const confirmar = useConfirm()
const router = useRouter()

const submissoes = ref<Submissao[]>([])
const carregando = ref(true)
const selecionada = ref<Submissao | null>(null)

const podeEditar = (s: Submissao) => s.status === 'EM_ANALISE' || s.status === 'AJUSTE_SOLICITADO'
const podeExcluir = (s: Submissao) => s.status !== 'APROVADA'
const visivel = computed({
  get: () => selecionada.value !== null,
  set: (v) => {
    if (!v) selecionada.value = null
  },
})

async function carregar() {
  carregando.value = true
  try {
    submissoes.value = await submissoesApi.listar()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Erro ao carregar', detail: (e as Error).message, life: 5000 })
  } finally {
    carregando.value = false
  }
}

function excluir(s: Submissao) {
  confirmar.require({
    header: 'Excluir submissão?',
    message: `O sinal de "${s.sinal.verbete.palavra}", o vídeo e o consentimento serão apagados. Essa ação não pode ser desfeita.`,
    icon: 'pi pi-trash',
    rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
    acceptProps: { label: 'Excluir', severity: 'danger' },
    accept: async () => {
      try {
        await submissoesApi.excluir(s.id)
        selecionada.value = null
        toast.add({ severity: 'success', summary: 'Submissão excluída', life: 3000 })
        await carregar()
      } catch (e) {
        toast.add({ severity: 'error', summary: 'Não foi possível excluir', detail: (e as Error).message, life: 5000 })
      }
    },
  })
}

onMounted(carregar)
</script>

<template>
  <CabecalhoPagina titulo="Minhas submissões" descricao="Os sinais que você enviou com vídeo para o dicionário.">
    <template #acoes>
      <RouterLink to="/enviar-sinal"><Button label="Enviar sinal" icon="pi pi-plus" /></RouterLink>
    </template>
  </CabecalhoPagina>

  <div class="cartao tabela">
    <DataTable :value="submissoes" data-key="id" :loading="carregando" row-hover @row-click="selecionada = $event.data">
      <Column header="Palavra">
        <template #body="{ data }">
          <strong>{{ data.sinal.verbete.palavra }}</strong>
        </template>
      </Column>
      <Column header="Região">
        <template #body="{ data }">{{ nomeRegiao(data.sinal.regiao) }}</template>
      </Column>
      <Column header="Enviada em">
        <template #body="{ data }">{{ formatarData(data.dataEnvio) }}</template>
      </Column>
      <Column header="Status">
        <template #body="{ data }"><EtiquetaStatus :status="data.status" /></template>
      </Column>
      <Column header="Ações" class="col-acoes">
        <template #body="{ data }">
          <div class="acoes" @click.stop>
            <Button icon="pi pi-eye" text rounded severity="secondary" :aria-label="`Ver ${data.sinal.verbete.palavra}`" @click="selecionada = data" />
            <Button v-if="podeEditar(data)" icon="pi pi-pencil" text rounded severity="secondary" :aria-label="`Editar ${data.sinal.verbete.palavra}`" @click="router.push(`/submissoes/${data.id}/editar`)" />
            <Button v-if="podeExcluir(data)" icon="pi pi-trash" text rounded severity="danger" :aria-label="`Excluir ${data.sinal.verbete.palavra}`" @click="excluir(data)" />
          </div>
        </template>
      </Column>
      <template #empty>
        <EstadoVazio icone="pi pi-inbox" titulo="Você ainda não enviou nenhum sinal" descricao="Os sinais que você enviar aparecem aqui, e você pode ver, editar ou excluir cada um.">
          <RouterLink to="/enviar-sinal"><Button label="Enviar o primeiro sinal" icon="pi pi-plus" /></RouterLink>
        </EstadoVazio>
      </template>
    </DataTable>
  </div>

  <Dialog v-model:visible="visivel" modal header="Submissão" :style="{ width: 'min(960px, 95vw)' }">
    <DetalheSubmissao v-if="selecionada" :submissao="selecionada" />
    <template #footer>
      <template v-if="selecionada">
        <Button v-if="podeExcluir(selecionada)" label="Excluir" icon="pi pi-trash" severity="danger" text @click="excluir(selecionada)" />
        <Button v-if="podeEditar(selecionada)" label="Editar" icon="pi pi-pencil" @click="router.push(`/submissoes/${selecionada.id}/editar`)" />
      </template>
    </template>
  </Dialog>
</template>

<style scoped>
.tabela {
  padding: 0.5rem;
  overflow: hidden;
}
:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
.acoes {
  display: flex;
  gap: 0.125rem;
}
</style>
