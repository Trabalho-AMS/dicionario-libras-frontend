<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import DetalheSubmissao from '@/components/DetalheSubmissao.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import CartaoIndicador from '@/components/ui/CartaoIndicador.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'
import EtiquetaStatus from '@/components/ui/EtiquetaStatus.vue'
import { formatarData, nomeRegiao } from '@/data/status'
import { submissoesApi } from '@/services/api'
import { useSessaoStore } from '@/stores/sessao'
import type { StatusSubmissao, Submissao } from '@/types/api'

const toast = useToast()
const sessao = useSessaoStore()

const filtros: { rotulo: string; valor: StatusSubmissao | 'TODAS' }[] = [
  { rotulo: 'Em análise', valor: 'EM_ANALISE' },
  { rotulo: 'Ajuste solicitado', valor: 'AJUSTE_SOLICITADO' },
  { rotulo: 'Todas', valor: 'TODAS' },
]
const filtro = ref<StatusSubmissao | 'TODAS'>('EM_ANALISE')
const todas = ref<Submissao[]>([])
const carregando = ref(true)
const selecionada = ref<Submissao | null>(null)
const motivo = ref('')
const decidindo = ref<string | null>(null)
const erroMotivo = ref(false)

const fila = computed(() => (filtro.value === 'TODAS' ? todas.value : todas.value.filter((s) => s.status === filtro.value)))
const contar = (status: StatusSubmissao) => todas.value.filter((s) => s.status === status).length
const propria = computed(() => selecionada.value?.autor.id === sessao.usuarioId)
const visivel = computed({
  get: () => selecionada.value !== null,
  set: (v) => {
    if (!v) selecionada.value = null
  },
})

const regras = [
  { icone: 'pi pi-eye', texto: 'Assista ao vídeo e compare com os sinais já publicados.' },
  { icone: 'pi pi-comment', texto: 'Pedir ajuste ou rejeitar exige uma justificativa para o colaborador.' },
  { icone: 'pi pi-ban', texto: 'Você não pode avaliar uma submissão enviada por você.' },
]

async function carregar() {
  if (!sessao.ehCurador) {
    carregando.value = false
    return
  }
  carregando.value = true
  try {
    todas.value = await submissoesApi.fila()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Erro ao carregar a fila', detail: (e as Error).message, life: 5000 })
  } finally {
    carregando.value = false
  }
}

function abrir(s: Submissao) {
  selecionada.value = s
  motivo.value = ''
  erroMotivo.value = false
}

async function decidir(acao: 'aprovar' | 'ajuste' | 'rejeitar') {
  const s = selecionada.value
  if (!s) return
  if (acao !== 'aprovar' && !motivo.value.trim()) {
    erroMotivo.value = true
    return
  }
  decidindo.value = acao
  try {
    if (acao === 'aprovar') await submissoesApi.aprovar(s.id)
    else if (acao === 'ajuste') await submissoesApi.solicitarAjuste(s.id, motivo.value)
    else await submissoesApi.rejeitar(s.id, motivo.value)
    const textos = {
      aprovar: 'Sinal aprovado e publicado no dicionário.',
      ajuste: 'O colaborador foi avisado para ajustar.',
      rejeitar: 'Submissão rejeitada; o vídeo será descartado.',
    }
    toast.add({ severity: 'success', summary: 'Decisão registrada', detail: textos[acao], life: 4000 })
    selecionada.value = null
    await carregar()
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Não foi possível registrar', detail: (e as Error).message, life: 6000 })
  } finally {
    decidindo.value = null
  }
}

onMounted(carregar)
</script>

<template>
  <CabecalhoPagina titulo="Curadoria" descricao="Revise as submissões pendentes e decida se o sinal pode ser publicado." />

  <div v-if="!sessao.ehCurador" class="cartao">
    <EstadoVazio icone="pi pi-lock" titulo="Área exclusiva da curadoria" descricao="Troque para um usuário curador no topo da tela para revisar as submissões." />
  </div>

  <template v-else>
    <div class="indicadores">
      <CartaoIndicador rotulo="Na fila" :valor="contar('EM_ANALISE')" icone="pi pi-inbox" cor="primaria" />
      <CartaoIndicador rotulo="Aprovadas" :valor="contar('APROVADA')" icone="pi pi-check-circle" cor="destaque" />
      <CartaoIndicador rotulo="Aguardando ajuste" :valor="contar('AJUSTE_SOLICITADO')" icone="pi pi-hourglass" cor="alerta" />
    </div>

    <div class="grade-curadoria">
      <div class="cartao tabela">
        <div class="tabela-topo">
          <h2 class="cartao-titulo">Fila de submissões</h2>
          <SelectButton v-model="filtro" :options="filtros" option-label="rotulo" option-value="valor" :allow-empty="false" size="small" aria-label="Filtrar fila" />
        </div>
        <DataTable :value="fila" data-key="id" :loading="carregando" row-hover @row-click="abrir($event.data)">
          <Column header="Palavra">
            <template #body="{ data }"><strong>{{ data.sinal.verbete.palavra }}</strong></template>
          </Column>
          <Column header="Colaborador">
            <template #body="{ data }">{{ data.autor.nome }}</template>
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
          <template #empty>
            <EstadoVazio icone="pi pi-verified" titulo="Nenhuma submissão aqui" descricao="Quando um colaborador enviar um sinal, ele aparece nesta fila para revisão." />
          </template>
        </DataTable>
      </div>

      <aside class="cartao">
        <h2 class="cartao-titulo">Como revisar</h2>
        <p class="cartao-subtitulo">Regras do fluxo de aprovação (UC01).</p>
        <ul class="regras">
          <li v-for="r in regras" :key="r.texto"><i :class="r.icone" aria-hidden="true" /> {{ r.texto }}</li>
        </ul>
      </aside>
    </div>
  </template>

  <Dialog v-model:visible="visivel" modal header="Revisar submissão" :style="{ width: 'min(1000px, 95vw)' }">
    <template v-if="selecionada">
      <DetalheSubmissao :submissao="selecionada" />

      <div v-if="selecionada.status === 'EM_ANALISE'" class="decisao">
        <p v-if="propria" class="aviso"><i class="pi pi-ban" aria-hidden="true" /> Esta submissão é sua: outro curador precisa avaliá-la.</p>
        <div v-else class="campo">
          <label for="motivo">Justificativa para o colaborador (obrigatória para pedir ajuste ou rejeitar)</label>
          <Textarea id="motivo" v-model="motivo" rows="3" auto-resize fluid :invalid="erroMotivo" placeholder="Ex.: Enquadre as duas mãos e o rosto; o movimento final ficou fora do vídeo." @input="erroMotivo = false" />
          <small v-if="erroMotivo" class="erro">Escreva a justificativa para o colaborador saber o que corrigir.</small>
        </div>
      </div>
    </template>
    <template #footer>
      <template v-if="selecionada?.status === 'EM_ANALISE' && !propria">
        <Button label="Rejeitar" icon="pi pi-times" severity="danger" outlined :loading="decidindo === 'rejeitar'" :disabled="!!decidindo" @click="decidir('rejeitar')" />
        <Button label="Pedir ajuste" icon="pi pi-pencil" severity="warn" outlined :loading="decidindo === 'ajuste'" :disabled="!!decidindo" @click="decidir('ajuste')" />
        <Button label="Aprovar e publicar" icon="pi pi-check" severity="success" :loading="decidindo === 'aprovar'" :disabled="!!decidindo" @click="decidir('aprovar')" />
      </template>
    </template>
  </Dialog>
</template>

<style scoped>
.indicadores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.grade-curadoria {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  align-items: start;
}
.tabela {
  padding: 1rem 0.5rem 0.5rem;
  overflow: hidden;
}
:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
.tabela-topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 1rem 0.75rem;
}
.regras {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  font-size: 0.9rem;
}
.regras li {
  display: flex;
  gap: 0.625rem;
}
.regras i {
  color: var(--primaria);
  margin-top: 4px;
}
.decisao {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--borda);
}
.aviso {
  margin: 0;
  color: var(--texto-suave);
}
@media (max-width: 960px) {
  .indicadores,
  .grade-curadoria {
    grid-template-columns: 1fr;
  }
}
</style>
