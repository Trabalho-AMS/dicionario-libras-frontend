<script setup lang="ts">
import PlayerSinal from './PlayerSinal.vue'
import EtiquetaStatus from './ui/EtiquetaStatus.vue'
import { formatarData, nomeRegiao } from '@/data/status'
import type { Submissao } from '@/types/api'

defineProps<{ submissao: Submissao }>()
</script>

<template>
  <div class="detalhe">
    <PlayerSinal :url="submissao.video.url" :descricao="`Sinal de ${submissao.sinal.verbete.palavra}`" />

    <div class="info">
      <div class="topo">
        <h3>{{ submissao.sinal.verbete.palavra }}</h3>
        <EtiquetaStatus :status="submissao.status" />
      </div>

      <div v-if="submissao.justificativa" class="justificativa" role="note">
        <i class="pi pi-comment" aria-hidden="true" />
        <div>
          <strong>Justificativa da curadoria</strong>
          <p>{{ submissao.justificativa }}</p>
        </div>
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
        <template v-if="submissao.curador">
          <dt>Avaliada por</dt>
          <dd>{{ submissao.curador.nome }}</dd>
        </template>
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
.justificativa {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: rgb(245 158 11 / 0.12);
  font-size: 0.9rem;
}
.justificativa i {
  color: #d97706;
  margin-top: 3px;
}
.justificativa p {
  margin: 0.15rem 0 0;
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
