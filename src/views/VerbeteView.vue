<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import Button from 'primevue/button'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'

const rota = useRoute()
</script>

<template>
  <CabecalhoPagina titulo="Verbete" :descricao="`Verbete ${rota.params.id}`">
    <template #acoes>
      <RouterLink to="/"><Button label="Voltar à busca" icon="pi pi-arrow-left" severity="secondary" outlined /></RouterLink>
    </template>
  </CabecalhoPagina>

  <div class="grade-verbete">
    <div class="cartao video">
      <div class="tela" role="img" aria-label="Área do vídeo do sinal">
        <i class="pi pi-play-circle" aria-hidden="true" />
      </div>
      <div class="controles" role="group" aria-label="Controles do player">
        <Button label="0,5x" size="small" severity="secondary" outlined />
        <Button label="0,75x" size="small" severity="secondary" outlined />
        <Button icon="pi pi-replay" size="small" severity="secondary" outlined aria-label="Repetir" />
        <Button icon="pi pi-arrows-h" size="small" severity="secondary" outlined aria-label="Espelhar" />
      </div>
    </div>

    <div class="cartao">
      <h2 class="cartao-titulo">Variações regionais</h2>
      <p class="cartao-subtitulo">O sinal padrão nacional e as variações de cada estado.</p>
      <EstadoVazio icone="pi pi-map" titulo="Verbete não encontrado" descricao="Este verbete ainda não foi publicado." />
    </div>
  </div>
</template>

<style scoped>
.grade-verbete {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
.tela {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e1b4b, #134e4a);
  color: rgb(255 255 255 / 0.7);
  font-size: 3rem;
}
.controles {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
@media (max-width: 900px) {
  .grade-verbete {
    grid-template-columns: 1fr;
  }
}
</style>
