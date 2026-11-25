<script setup lang="ts">
import EtiquetaStatus from './ui/EtiquetaStatus.vue'
import { nomeRegiao } from '@/data/apoio'
import { formatarData } from '@/data/status'
import type { Submissao } from '@/types/api'

defineProps<{ submissao: Submissao }>()
</script>

<template>
  <div class="detalhe">
    <video :src="submissao.video.url" controls muted loop playsinline :aria-label="`Vídeo do sinal de ${submissao.palavra}`" />

    <div class="info">
      <div class="topo">
        <h3>{{ submissao.palavra }}</h3>
        <EtiquetaStatus :status="submissao.status" />
      </div>

      <dl>
        <dt>Acepção</dt>
        <dd>{{ submissao.acepcao }}</dd>
        <template v-if="submissao.exemplo">
          <dt>Exemplo</dt>
          <dd>{{ submissao.exemplo }}</dd>
        </template>
        <dt>Assunto</dt>
        <dd>{{ submissao.assunto }}</dd>
        <template v-if="submissao.classeGramatical">
          <dt>Classe gramatical</dt>
          <dd>{{ submissao.classeGramatical }}</dd>
        </template>
        <dt>Região</dt>
        <dd>{{ nomeRegiao(submissao.regiao) }}</dd>
        <dt>Configuração de mão</dt>
        <dd>{{ submissao.configuracaoMao }}</dd>
        <dt>Vídeo</dt>
        <dd>{{ submissao.video.formato.toUpperCase() }} · {{ submissao.video.duracaoSeg }} s · {{ submissao.video.tamanhoMB.toFixed(1) }} MB</dd>
        <dt>Enviada em</dt>
        <dd>{{ formatarData(submissao.dataEnvio) }}<span v-if="submissao.atualizadaEm"> · editada em {{ formatarData(submissao.atualizadaEm) }}</span></dd>
        <dt>Consentimento</dt>
        <dd>
          Termo v{{ submissao.versaoTermo }} aceito em {{ formatarData(submissao.consentimentoEm) }}
          <span v-if="submissao.sinalizanteMenor"> · menor de 18 com termo do responsável</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<style scoped>
.detalhe {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.5rem;
}
.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
h3 {
  font-size: 1.35rem;
}
video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: #0b1120;
  object-fit: contain;
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
  font-size: 0.9rem;
}
dt {
  color: var(--texto-suave);
}
dd {
  margin: 0;
}
@media (max-width: 860px) {
  .detalhe {
    grid-template-columns: 1fr;
  }
}
</style>
