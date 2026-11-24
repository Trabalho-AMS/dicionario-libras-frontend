<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'
import PlayerSinal from '@/components/PlayerSinal.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'
import { dicionarioApi } from '@/services/api'
import type { VerbetePublicado } from '@/types/api'

const rota = useRoute()
const dados = ref<VerbetePublicado | null>(null)
const erro = ref<string | null>(null)
const carregando = ref(true)
const sinalAtual = ref<string | null>(null)

const atual = computed(() => dados.value?.sinais.find((s) => s.sinal.id === sinalAtual.value) ?? dados.value?.sinais[0])

onMounted(async () => {
  try {
    dados.value = await dicionarioApi.verbete(rota.params.id as string)
    sinalAtual.value = dados.value.sinais[0]?.sinal.id ?? null
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <div v-if="carregando" class="carregando"><ProgressSpinner style="width: 40px; height: 40px" /></div>

  <template v-else-if="dados && atual">
    <CabecalhoPagina :titulo="dados.verbete.palavra" :descricao="dados.verbete.acepcao">
      <template #acoes>
        <RouterLink to="/"><Button label="Voltar à busca" icon="pi pi-arrow-left" severity="secondary" outlined /></RouterLink>
      </template>
    </CabecalhoPagina>

    <div class="grade-verbete">
      <div class="cartao">
        <PlayerSinal :url="atual.video.url" :descricao="`Sinal de ${dados.verbete.palavra}, ${atual.sinal.padrao ? 'padrão nacional' : 'variação de ' + atual.sinal.regiao?.nome}`" />
        <p class="legenda">
          <strong>{{ atual.sinal.padrao ? 'Sinal padrão nacional' : `Variação de ${atual.sinal.regiao?.nome}` }}</strong>
          · configuração de mão {{ atual.sinal.configuracaoMao.codigo }}
        </p>
      </div>

      <div class="lateral">
        <div class="cartao">
          <h2 class="cartao-titulo">Variações regionais</h2>
          <p class="cartao-subtitulo">Escolha como o sinal é feito em cada lugar.</p>
          <div class="variacoes" role="radiogroup" aria-label="Variações do sinal">
            <button
              v-for="s in dados.sinais"
              :key="s.sinal.id"
              type="button"
              role="radio"
              :aria-checked="s.sinal.id === atual.sinal.id"
              :class="{ ativa: s.sinal.id === atual.sinal.id }"
              @click="sinalAtual = s.sinal.id"
            >
              <i :class="s.sinal.padrao ? 'pi pi-globe' : 'pi pi-map-marker'" aria-hidden="true" />
              <span>{{ s.sinal.padrao ? 'Nacional' : s.sinal.regiao?.nome }}</span>
              <small v-if="!s.sinal.padrao">{{ s.sinal.regiao?.codigo }}</small>
            </button>
          </div>
        </div>

        <div class="cartao">
          <h2 class="cartao-titulo">Sobre a palavra</h2>
          <dl>
            <dt>Assunto</dt>
            <dd><Tag :value="dados.verbete.assunto.nome" severity="secondary" rounded /></dd>
            <template v-if="dados.verbete.classeGramatical">
              <dt>Classe gramatical</dt>
              <dd>{{ dados.verbete.classeGramatical }}</dd>
            </template>
            <template v-if="dados.verbete.exemplo">
              <dt>Exemplo</dt>
              <dd>{{ dados.verbete.exemplo }}</dd>
            </template>
          </dl>
        </div>
      </div>
    </div>
  </template>

  <div v-else class="cartao">
    <EstadoVazio icone="pi pi-book" titulo="Verbete não encontrado" :descricao="erro ?? 'Este verbete ainda não foi publicado.'">
      <RouterLink to="/"><Button label="Voltar à busca" icon="pi pi-arrow-left" /></RouterLink>
    </EstadoVazio>
  </div>
</template>

<style scoped>
.carregando {
  display: grid;
  place-items: center;
  padding: 4rem;
}
.grade-verbete {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
.lateral {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.legenda {
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
  color: var(--texto-suave);
}
.legenda strong {
  color: var(--texto);
}
.variacoes {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.variacoes button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.65rem 0.875rem;
  border: 1px solid var(--borda);
  border-radius: 10px;
  background: transparent;
  color: var(--texto);
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
}
.variacoes button:hover {
  background: var(--superficie-suave);
}
.variacoes button.ativa {
  border-color: var(--primaria);
  background: var(--primaria-suave);
  color: var(--primaria);
  font-weight: 600;
}
.variacoes small {
  margin-left: auto;
  color: var(--texto-suave);
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.625rem 1rem;
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
}
dt {
  color: var(--texto-suave);
}
dd {
  margin: 0;
}
@media (max-width: 900px) {
  .grade-verbete {
    grid-template-columns: 1fr;
  }
}
</style>
