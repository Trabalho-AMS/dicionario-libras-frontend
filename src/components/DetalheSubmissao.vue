<script setup lang="ts">
import EtiquetaStatus from './ui/EtiquetaStatus.vue'
import { formatarData, nomeRegiao } from '@/data/status'
import type { Submissao } from '@/types/api'

defineProps<{ submissao: Submissao }>()
</script>

<template>
  <div class="detalhe">
    <video :src="submissao.video.url" controls muted loop playsinline :aria-label="`Vídeo do sinal de ${submissao.sinal.verbete.palavra}`" />

    <div class="info">
      <div class="topo">
        <h3>{{ submissao.sinal.verbete.palavra }}</h3>
        <EtiquetaStatus :status="submissao.status" />
      </div>

      <dl>
        <dt>Acepção</dt>
        <dd>{{ submissao.sinal.verbete.acepcao }}</dd>
        <template v-if="submissao.sinal.verbete.exemplo">
          <dt>Exemplo</dt>
          <dd>{{ submissao.sinal.verbete.exemplo }}</dd>
        </template>
        <dt>Assunto</dt>
        <dd>{{ submissao.sinal.verbete.assunto.nome }}</dd>
        <template v-if="submissao.sinal.verbete.classeGramatical">
          <dt>Classe gramatical</dt>
          <dd>{{ submissao.sinal.verbete.classeGramatical }}</dd>
        </template>
        <dt>Região</dt>
        <dd>{{ nomeRegiao(submissao.sinal.regiao) }}</dd>
        <dt>Configuração de mão</dt>
        <dd>{{ submissao.sinal.configuracaoMao.codigo }}</dd>
        <dt>Vídeo</dt>
        <dd>{{ submissao.video.formato.toUpperCase() }} · {{ submissao.video.duracaoSeg }} s · {{ submissao.video.tamanhoMB.toFixed(1) }} MB</dd>
        <dt>Enviada por</dt>
        <dd>{{ submissao.autor.nome }} em {{ formatarData(submissao.dataEnvio) }}</dd>
        <dt>Consentimento</dt>
        <dd>
          Termo v{{ submissao.consentimento.versaoTermo }} aceito em {{ formatarData(submissao.consentimento.dataHora) }}
          <span v-if="submissao.consentimento.sinalizanteMenor"> · menor de 18 com termo do responsável</span>
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
