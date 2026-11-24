<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import EstadoVazio from '@/components/ui/EstadoVazio.vue'
import { dicionarioApi } from '@/services/api'
import { useApoioStore } from '@/stores/apoio'
import type { VerbetePublicado } from '@/types/api'

const apoioStore = useApoioStore()

const termo = ref('')
const regiao = ref<number | 'NACIONAL' | null>(null)
const assunto = ref<number | null>(null)
const configuracao = ref<number | null>(null)
const letra = ref<string | null>(null)
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const resultados = ref<VerbetePublicado[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

// No filtro, "vazio" significa todas as regiões; o padrão nacional vira uma opção própria
const opcoesRegiao = computed(() => [
  { id: 'NACIONAL', nome: 'Somente sinal nacional' },
  ...apoioStore.apoio.regioes.map((r) => ({ id: r.id, nome: `${r.nome} (${r.codigo})` })),
])

const semAcento = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

/** Região, assunto, configuração de mão e letra filtram os resultados da busca. */
const filtrados = computed(() =>
  resultados.value.filter(({ verbete, sinais }) => {
    if (assunto.value && verbete.assunto.id !== assunto.value) return false
    if (letra.value && !semAcento(verbete.palavra).startsWith(letra.value)) return false
    if (regiao.value === 'NACIONAL' && !sinais.some((s) => s.sinal.padrao)) return false
    if (typeof regiao.value === 'number' && !sinais.some((s) => s.sinal.regiao?.id === regiao.value)) return false
    if (configuracao.value && !sinais.some((s) => s.sinal.configuracaoMao.id === configuracao.value)) return false
    return true
  }),
)

const recursos = [
  { icone: 'pi pi-map', titulo: 'Variações regionais', texto: 'Compare como o mesmo sinal é feito em cada estado.' },
  { icone: 'pi pi-sliders-h', titulo: 'Busca por parâmetros', texto: 'Encontre um sinal pela configuração de mão, sem saber a palavra.' },
  { icone: 'pi pi-play-circle', titulo: 'Player para aprender', texto: 'Câmera lenta, repetição e espelhamento para canhotos.' },
]

async function buscar() {
  carregando.value = true
  erro.value = null
  try {
    resultados.value = await dicionarioApi.buscar(termo.value)
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
}

function limpar() {
  termo.value = ''
  regiao.value = assunto.value = configuracao.value = letra.value = null
}

const temFiltro = computed(() => !!(termo.value || regiao.value || assunto.value || configuracao.value || letra.value))

watchDebounced(termo, buscar, { debounce: 300 })
watch(letra, () => window.scrollTo({ top: 0 }))
onMounted(() => {
  apoioStore.carregar()
  buscar()
})
</script>

<template>
  <section class="hero">
    <span class="selo"><i class="pi pi-sparkles" aria-hidden="true" /> Dicionário colaborativo de Libras</span>
    <h1>Encontre o sinal certo,<br />do jeito que ele é usado onde você mora.</h1>
    <p>Busque por palavra, assunto ou configuração de mão e veja o sinal padrão e as variações de cada região.</p>

    <form class="busca" role="search" @submit.prevent="buscar">
      <IconField class="campo-busca">
        <InputIcon class="pi pi-search" />
        <InputText v-model="termo" placeholder="Buscar uma palavra, ex.: pai, escola, obrigado" aria-label="Palavra" fluid size="large" />
      </IconField>
      <Button type="submit" label="Buscar" icon="pi pi-arrow-right" icon-pos="right" size="large" />
    </form>
  </section>

  <div class="grade-busca">
    <aside class="cartao filtros" aria-label="Filtros">
      <div class="filtros-topo">
        <h2 class="cartao-titulo">Filtros</h2>
        <Button label="Limpar" text size="small" @click="limpar" />
      </div>
      <div class="campo">
        <label for="f-regiao">Região</label>
        <Select v-model="regiao" input-id="f-regiao" :options="opcoesRegiao" option-label="nome" option-value="id" placeholder="Todas" show-clear filter fluid />
      </div>
      <div class="campo">
        <label for="f-assunto">Assunto</label>
        <Select v-model="assunto" input-id="f-assunto" :options="apoioStore.apoio.assuntos" option-label="nome" option-value="id" placeholder="Todos" show-clear fluid />
      </div>
      <div class="campo">
        <label for="f-cm">Configuração de mão</label>
        <Select v-model="configuracao" input-id="f-cm" :options="apoioStore.apoio.configuracoesMao" option-label="nome" option-value="id" placeholder="Todas" show-clear fluid />
      </div>
    </aside>

    <div class="resultados">
      <div class="cartao alfabeto" role="group" aria-label="Navegar por letra">
        <button
          v-for="l in letras"
          :key="l"
          type="button"
          :class="{ ativa: letra === l }"
          :aria-pressed="letra === l"
          @click="letra = letra === l ? null : l"
        >
          {{ l }}
        </button>
      </div>

      <p v-if="!carregando && filtrados.length" class="contagem">
        {{ filtrados.length }} {{ filtrados.length === 1 ? 'verbete encontrado' : 'verbetes encontrados' }}
      </p>

      <div v-if="carregando" class="lista">
        <div v-for="i in 3" :key="i" class="cartao"><Skeleton width="40%" height="1.4rem" /><Skeleton class="mt" height="3rem" /></div>
      </div>

      <div v-else-if="erro" class="cartao">
        <EstadoVazio icone="pi pi-exclamation-triangle" titulo="Não foi possível buscar" :descricao="erro">
          <Button label="Tentar de novo" icon="pi pi-refresh" @click="buscar" />
        </EstadoVazio>
      </div>

      <div v-else-if="filtrados.length" class="lista">
        <RouterLink v-for="{ verbete, sinais } in filtrados" :key="verbete.id" :to="`/verbetes/${verbete.id}`" class="cartao resultado">
          <div class="resultado-topo">
            <h3>{{ verbete.palavra }}</h3>
            <Tag :value="verbete.assunto.nome" severity="secondary" rounded />
          </div>
          <p class="acepcao">{{ verbete.acepcao }}</p>
          <div class="sinais">
            <span v-for="s in sinais" :key="s.sinal.id" class="chip" :class="{ nacional: s.sinal.padrao }">
              <i :class="s.sinal.padrao ? 'pi pi-globe' : 'pi pi-map-marker'" aria-hidden="true" />
              {{ s.sinal.padrao ? 'Nacional' : s.sinal.regiao?.codigo }}
            </span>
          </div>
          <i class="pi pi-arrow-right seta" aria-hidden="true" />
        </RouterLink>
      </div>

      <div v-else class="cartao">
        <EstadoVazio
          icone="pi pi-book"
          :titulo="temFiltro ? 'Nenhum verbete encontrado' : 'Nenhum verbete publicado ainda'"
          :descricao="temFiltro ? 'Tente outra palavra ou limpe os filtros. Se o sinal não existir, você pode contribuir com ele.' : 'Os verbetes aparecem aqui depois de aprovados pela curadoria. Que tal contribuir com o primeiro sinal?'"
        >
          <RouterLink to="/enviar-sinal"><Button label="Enviar um sinal" icon="pi pi-plus" /></RouterLink>
        </EstadoVazio>
      </div>
    </div>
  </div>

  <section class="recursos" aria-label="Recursos">
    <article v-for="r in recursos" :key="r.titulo" class="cartao recurso">
      <i :class="r.icone" aria-hidden="true" />
      <h3>{{ r.titulo }}</h3>
      <p>{{ r.texto }}</p>
    </article>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 2.5rem;
  border-radius: 20px;
  background:
    radial-gradient(circle at 85% 10%, rgb(45 212 191 / 0.35), transparent 45%),
    radial-gradient(circle at 10% 100%, rgb(129 140 248 / 0.4), transparent 50%),
    linear-gradient(135deg, #312e81 0%, #1e1b4b 55%, #134e4a 100%);
  color: #fff;
  margin-bottom: 1.5rem;
}
.selo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  border: 1px solid rgb(255 255 255 / 0.18);
  font-size: 0.8125rem;
  font-weight: 500;
}
.hero h1 {
  margin: 1rem 0 0.75rem;
  font-size: clamp(1.6rem, 3vw, 2.25rem);
  font-weight: 800;
}
.hero p {
  margin: 0;
  max-width: 58ch;
  color: rgb(255 255 255 / 0.8);
}
.busca {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
  max-width: 720px;
}
.campo-busca {
  flex: 1;
}
.grade-busca {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.25rem;
  align-items: start;
}
.filtros {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.filtros-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.resultados {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.alfabeto {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.75rem;
}
.alfabeto button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--texto-suave);
  font: inherit;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.alfabeto button:hover {
  background: var(--superficie-suave);
  color: var(--texto);
}
.alfabeto button.ativa {
  background: var(--primaria);
  color: #fff;
}
.contagem {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.875rem;
}
.lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.mt {
  margin-top: 0.75rem;
}
.resultado {
  position: relative;
  display: block;
  color: var(--texto);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.resultado:hover {
  border-color: var(--primaria);
  box-shadow: var(--sombra-alta);
  transform: translateY(-1px);
}
.resultado-topo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.resultado h3 {
  font-size: 1.15rem;
}
.acepcao {
  margin: 0.375rem 0 0.75rem;
  color: var(--texto-suave);
  font-size: 0.9rem;
  padding-right: 2rem;
}
.sinais {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--superficie-suave);
  font-size: 0.78rem;
  font-weight: 600;
}
.chip.nacional {
  background: var(--primaria-suave);
  color: var(--primaria);
}
.seta {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  color: var(--texto-suave);
}
.recursos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 1.25rem;
}
.recurso i {
  font-size: 1.25rem;
  color: var(--destaque);
}
.recurso h3 {
  margin: 0.75rem 0 0.25rem;
  font-size: 1rem;
}
.recurso p {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
}
@media (max-width: 900px) {
  .grade-busca,
  .contagem {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.875rem;
}
.lista {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.mt {
  margin-top: 0.75rem;
}
.resultado {
  position: relative;
  display: block;
  color: var(--texto);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.resultado:hover {
  border-color: var(--primaria);
  box-shadow: var(--sombra-alta);
  transform: translateY(-1px);
}
.resultado-topo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.resultado h3 {
  font-size: 1.15rem;
}
.acepcao {
  margin: 0.375rem 0 0.75rem;
  color: var(--texto-suave);
  font-size: 0.9rem;
  padding-right: 2rem;
}
.sinais {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--superficie-suave);
  font-size: 0.78rem;
  font-weight: 600;
}
.chip.nacional {
  background: var(--primaria-suave);
  color: var(--primaria);
}
.seta {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  color: var(--texto-suave);
}
.recursos {
    grid-template-columns: 1fr;
  }
  .hero {
    padding: 1.75rem 1.25rem;
  }
  .busca {
    flex-direction: column;
  }
}
</style>
