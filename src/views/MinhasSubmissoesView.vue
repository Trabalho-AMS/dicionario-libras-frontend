<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import CartaoIndicador from '@/components/ui/CartaoIndicador.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'

const submissoes: { palavra: string; regiao: string; envio: string; status: string }[] = []
</script>

<template>
  <CabecalhoPagina titulo="Minhas submissões" descricao="Acompanhe o status dos sinais que você enviou.">
    <template #acoes>
      <RouterLink to="/enviar-sinal"><Button label="Enviar sinal" icon="pi pi-plus" /></RouterLink>
    </template>
  </CabecalhoPagina>

  <div class="indicadores">
    <CartaoIndicador rotulo="Em análise" :valor="0" icone="pi pi-clock" cor="primaria" />
    <CartaoIndicador rotulo="Ajuste solicitado" :valor="0" icone="pi pi-pencil" cor="alerta" />
    <CartaoIndicador rotulo="Aprovadas" :valor="0" icone="pi pi-check" cor="destaque" />
    <CartaoIndicador rotulo="Rejeitadas" :valor="0" icone="pi pi-times" cor="perigo" />
  </div>

  <div class="cartao tabela">
    <DataTable :value="submissoes" data-key="palavra">
      <Column field="palavra" header="Palavra" />
      <Column field="regiao" header="Região" />
      <Column field="envio" header="Enviada em" />
      <Column field="status" header="Status" />
      <template #empty>
        <EstadoVazio icone="pi pi-inbox" titulo="Você ainda não enviou nenhum sinal" descricao="Suas submissões e a justificativa do curador aparecem aqui." />
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.indicadores {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.tabela {
  padding: 0.5rem;
  overflow: hidden;
}
@media (max-width: 960px) {
  .indicadores {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
