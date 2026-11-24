<script setup lang="ts">
import { ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import SelectButton from 'primevue/selectbutton'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import CartaoIndicador from '@/components/ui/CartaoIndicador.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'

const filtro = ref('Em análise')
const filtros = ['Em análise', 'Ajuste solicitado', 'Todas']
const fila: { palavra: string; autor: string; regiao: string; envio: string }[] = []

const regras = [
  { icone: 'pi pi-eye', texto: 'Assista ao vídeo e compare com os sinais já publicados.' },
  { icone: 'pi pi-comment', texto: 'Pedir ajuste ou rejeitar exige uma justificativa para o colaborador.' },
  { icone: 'pi pi-ban', texto: 'Você não pode avaliar uma submissão enviada por você.' },
]
</script>

<template>
  <CabecalhoPagina titulo="Curadoria" descricao="Revise as submissões pendentes e decida se o sinal pode ser publicado." />

  <div class="indicadores">
    <CartaoIndicador rotulo="Na fila" :valor="0" icone="pi pi-inbox" cor="primaria" />
    <CartaoIndicador rotulo="Aprovadas hoje" :valor="0" icone="pi pi-check-circle" cor="destaque" />
    <CartaoIndicador rotulo="Aguardando ajuste" :valor="0" icone="pi pi-hourglass" cor="alerta" />
  </div>

  <div class="grade-curadoria">
    <div class="cartao tabela">
      <div class="tabela-topo">
        <h2 class="cartao-titulo">Fila de submissões</h2>
        <SelectButton v-model="filtro" :options="filtros" :allow-empty="false" size="small" aria-label="Filtrar fila" />
      </div>
      <DataTable :value="fila" data-key="palavra">
        <Column field="palavra" header="Palavra" />
        <Column field="autor" header="Colaborador" />
        <Column field="regiao" header="Região" />
        <Column field="envio" header="Enviada em" />
        <template #empty>
          <EstadoVazio icone="pi pi-verified" titulo="Nenhuma submissão pendente" descricao="Quando um colaborador enviar um sinal, ele aparece aqui para revisão." />
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
@media (max-width: 960px) {
  .indicadores,
  .grade-curadoria {
    grid-template-columns: 1fr;
  }
}
</style>
