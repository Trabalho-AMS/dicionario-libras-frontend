<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import { CLASSES_GRAMATICAIS } from '@/data/apoio'
import { submissoesApi } from '@/services/api'
import { useApoioStore } from '@/stores/apoio'
import type { FormularioSubmissao, Submissao } from '@/types/api'

// Mesmos limites do backend (Video.validar, RF04)
const FORMATOS = ['video/mp4', 'video/webm']
const TAMANHO_MAXIMO_MB = 50
const DURACAO_MAXIMA_SEG = 30

const toast = useToast()
const rota = useRoute()
const router = useRouter()
const apoioStore = useApoioStore()

/** Com id na rota, o formulário corrige uma submissão existente (o vídeo passa a ser opcional). */
const idEdicao = computed(() => (rota.params.id as string | undefined) ?? null)
const editando = computed(() => idEdicao.value !== null)
const original = ref<Submissao | null>(null)
const carregando = ref(false)
const enviando = ref(false)

const regioes = computed(() => [{ id: null, nome: 'Nacional (sinal padrão)' }, ...apoioStore.apoio.regioes.map((r) => ({ id: r.id, nome: `${r.nome} (${r.codigo})` }))])

const form = reactive<FormularioSubmissao>({
  palavra: '',
  assuntoId: null,
  classeGramatical: null,
  acepcao: '',
  exemplo: '',
  regiaoId: null,
  configuracaoMaoId: null,
  aceiteTermo: false,
  sinalizanteMenor: false,
  termoResponsavel: null,
  video: null,
  duracaoSeg: null,
})

const previaVideo = ref<string | null>(null)
const erroVideo = ref<string | null>(null)
const arrastando = ref(false)
const tentouEnviar = ref(false)

const erros = computed(() => ({
  palavra: !form.palavra.trim() ? 'Informe a palavra em português.' : null,
  assunto: !form.assuntoId ? 'Escolha um assunto.' : null,
  acepcao: !form.acepcao.trim() ? 'Descreva o significado da palavra.' : null,
  configuracao: !form.configuracaoMaoId ? 'Escolha a configuração de mão.' : null,
  video: erroVideo.value ?? (!form.video && !editando.value ? 'Envie o vídeo do sinal.' : null),
  aceiteTermo: !form.aceiteTermo && !editando.value ? 'É preciso aceitar o termo de uso de imagem.' : null,
  termoResponsavel:
    !editando.value && form.sinalizanteMenor && !form.termoResponsavel
      ? 'Sinalizante menor de 18 anos: anexe o termo assinado pelo responsável (LGPD, art. 14).'
      : null,
}))

const valido = computed(() => Object.values(erros.value).every((e) => e === null))

onMounted(async () => {
  await apoioStore.carregar()
  if (!idEdicao.value) return
  carregando.value = true
  try {
    const s = await submissoesApi.detalhar(idEdicao.value)
    original.value = s
    Object.assign(form, {
      palavra: s.sinal.verbete.palavra,
      acepcao: s.sinal.verbete.acepcao,
      exemplo: s.sinal.verbete.exemplo ?? '',
      classeGramatical: s.sinal.verbete.classeGramatical,
      assuntoId: s.sinal.verbete.assunto.id,
      regiaoId: s.sinal.regiao?.id ?? null,
      configuracaoMaoId: s.sinal.configuracaoMao.id,
      duracaoSeg: s.video.duracaoSeg,
      aceiteTermo: true,
      sinalizanteMenor: s.consentimento.sinalizanteMenor,
    })
    previaVideo.value = s.video.url
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Não foi possível abrir a submissão', detail: (e as Error).message, life: 5000 })
    router.push('/minhas-submissoes')
  } finally {
    carregando.value = false
  }
})

function duracaoDoVideo(arquivo: File): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement('video')
    el.preload = 'metadata'
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(el.src)
      resolve(el.duration)
    }
    el.onerror = () => resolve(0)
    el.src = URL.createObjectURL(arquivo)
  })
}

async function escolherVideo(arquivo: File | undefined) {
  if (!arquivo) return
  erroVideo.value = null
  if (!FORMATOS.includes(arquivo.type)) {
    erroVideo.value = `O arquivo é ${arquivo.type || 'de formato desconhecido'}; envie um vídeo MP4 ou WebM.`
    return
  }
  const tamanhoMb = arquivo.size / (1024 * 1024)
  if (tamanhoMb > TAMANHO_MAXIMO_MB) {
    erroVideo.value = `O vídeo tem ${tamanhoMb.toFixed(1)} MB; o limite é ${TAMANHO_MAXIMO_MB} MB.`
    return
  }
  const duracao = await duracaoDoVideo(arquivo)
  if (!duracao || !Number.isFinite(duracao)) {
    erroVideo.value = 'Não foi possível ler a duração do vídeo; tente outro arquivo MP4 ou WebM.'
    return
  }
  if (duracao > DURACAO_MAXIMA_SEG) {
    erroVideo.value = `O vídeo tem ${Math.round(duracao)} s; o limite é ${DURACAO_MAXIMA_SEG} s.`
    return
  }
  liberarPrevia()
  form.video = arquivo
  form.duracaoSeg = Math.max(1, Math.round(duracao))
  previaVideo.value = URL.createObjectURL(arquivo)
}

function liberarPrevia() {
  if (previaVideo.value?.startsWith('blob:')) URL.revokeObjectURL(previaVideo.value)
}

function removerVideo() {
  liberarPrevia()
  form.video = null
  previaVideo.value = null
  erroVideo.value = null
  if (original.value) form.duracaoSeg = original.value.video.duracaoSeg
}

function aoSoltar(evento: DragEvent) {
  arrastando.value = false
  escolherVideo(evento.dataTransfer?.files[0])
}

async function enviar() {
  tentouEnviar.value = true
  if (!valido.value) {
    toast.add({ severity: 'warn', summary: 'Revise o formulário', detail: 'Alguns campos precisam de atenção.', life: 4000 })
    return
  }
  enviando.value = true
  try {
    if (idEdicao.value) {
      const s = await submissoesApi.alterar(idEdicao.value, form)
      toast.add({
        severity: 'success',
        summary: 'Submissão atualizada',
        detail: s.status === 'EM_ANALISE' ? 'Ela está na fila da curadoria.' : undefined,
        life: 4000,
      })
    } else {
      await submissoesApi.criar(form)
      toast.add({ severity: 'success', summary: 'Sinal enviado!', detail: 'A submissão está Em análise pela curadoria.', life: 5000 })
    }
    router.push('/minhas-submissoes')
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Não foi possível enviar', detail: (e as Error).message, life: 6000 })
  } finally {
    enviando.value = false
  }
}

type Campo = keyof typeof erros.value
const mostrarErro = (campo: Campo) => tentouEnviar.value && !!erros.value[campo]
</script>

<template>
  <CabecalhoPagina
    :titulo="editando ? 'Corrigir submissão' : 'Enviar novo sinal'"
    :descricao="
      editando
        ? 'Ajuste o que a curadoria pediu. Se quiser, envie um novo vídeo; senão, o atual é mantido.'
        : 'Preencha o verbete, escolha a região e envie o vídeo. Um curador vai revisar antes da publicação.'
    "
  />

  <div v-if="carregando" class="carregando"><ProgressSpinner style="width: 40px; height: 40px" /></div>

  <template v-else>
    <Message v-if="original?.justificativa" severity="warn" class="aviso-ajuste">
      <strong>Pedido da curadoria:</strong> {{ original.justificativa }}
    </Message>

    <ol class="passos" aria-label="Etapas do envio">
      <li><span>1</span> Verbete</li>
      <li><span>2</span> Sinal e região</li>
      <li><span>3</span> Vídeo</li>
      <li v-if="!editando"><span>4</span> Consentimento</li>
    </ol>

    <form class="formulario" novalidate @submit.prevent="enviar">
      <section class="cartao">
        <h2 class="cartao-titulo">1. Verbete</h2>
        <p class="cartao-subtitulo">Se a palavra já existir, o sinal será enviado como variação regional dela.</p>
        <div class="grade duas">
          <div class="campo">
            <label for="palavra">Palavra *</label>
            <InputText id="palavra" v-model="form.palavra" :invalid="mostrarErro('palavra')" placeholder="Ex.: Pai" fluid />
            <small v-if="mostrarErro('palavra')" class="erro">{{ erros.palavra }}</small>
          </div>
          <div class="campo">
            <label for="assunto">Assunto *</label>
            <Select v-model="form.assuntoId" input-id="assunto" :options="apoioStore.apoio.assuntos" option-label="nome" option-value="id" :invalid="mostrarErro('assunto')" placeholder="Selecione" fluid />
            <small v-if="mostrarErro('assunto')" class="erro">{{ erros.assunto }}</small>
          </div>
          <div class="campo">
            <label for="classe">Classe gramatical</label>
            <Select v-model="form.classeGramatical" input-id="classe" :options="CLASSES_GRAMATICAIS" placeholder="Selecione" show-clear fluid />
          </div>
          <div class="campo largura-total">
            <label for="acepcao">Acepção *</label>
            <Textarea id="acepcao" v-model="form.acepcao" :invalid="mostrarErro('acepcao')" rows="2" auto-resize placeholder="O que a palavra significa" fluid />
            <small v-if="mostrarErro('acepcao')" class="erro">{{ erros.acepcao }}</small>
          </div>
          <div class="campo largura-total">
            <label for="exemplo">Exemplo de uso</label>
            <InputText id="exemplo" v-model="form.exemplo" placeholder="Ex.: Meu pai trabalha no hospital." fluid />
          </div>
        </div>
      </section>

      <section class="cartao">
        <h2 class="cartao-titulo">2. Sinal e região</h2>
        <p class="cartao-subtitulo">Sem região, o sinal é o padrão nacional; com região, é uma variação.</p>
        <div class="grade duas">
          <div class="campo">
            <label for="regiao">Região</label>
            <Select v-model="form.regiaoId" input-id="regiao" :options="regioes" option-label="nome" option-value="id" filter fluid />
          </div>
          <div class="campo">
            <label for="cm">Configuração de mão *</label>
            <Select v-model="form.configuracaoMaoId" input-id="cm" :options="apoioStore.apoio.configuracoesMao" option-label="nome" option-value="id" :invalid="mostrarErro('configuracao')" placeholder="Selecione" fluid />
            <small v-if="mostrarErro('configuracao')" class="erro">{{ erros.configuracao }}</small>
          </div>
        </div>
      </section>

      <section class="cartao">
        <h2 class="cartao-titulo">3. Vídeo do sinal</h2>
        <p class="cartao-subtitulo">MP4 ou WebM, até {{ TAMANHO_MAXIMO_MB }} MB e {{ DURACAO_MAXIMA_SEG }} segundos. Enquadre as mãos e o rosto.</p>

        <div v-if="previaVideo" class="previa">
          <video :src="previaVideo" controls muted aria-label="Prévia do vídeo do sinal" />
          <div class="previa-info">
            <p><i class="pi pi-check-circle" aria-hidden="true" /> {{ form.video?.name ?? 'Vídeo atual' }} · {{ form.duracaoSeg }} s</p>
            <Button :label="editando && !form.video ? 'Enviar outro vídeo' : 'Trocar vídeo'" icon="pi pi-refresh" severity="secondary" outlined size="small" @click="removerVideo" />
          </div>
        </div>
        <label
          v-else
          class="zona-upload"
          :class="{ arrastando, invalida: mostrarErro('video') }"
          @dragover.prevent="arrastando = true"
          @dragleave="arrastando = false"
          @drop.prevent="aoSoltar"
        >
          <input type="file" accept="video/mp4,video/webm" class="sr-only" @change="escolherVideo(($event.target as HTMLInputElement).files?.[0])" />
          <span class="icone-upload"><i class="pi pi-cloud-upload" aria-hidden="true" /></span>
          <strong>Arraste o vídeo aqui ou clique para escolher</strong>
          <span>MP4 ou WebM · até {{ TAMANHO_MAXIMO_MB }} MB · até {{ DURACAO_MAXIMA_SEG }} s</span>
        </label>
        <Message v-if="erroVideo || mostrarErro('video')" severity="error" size="small" variant="simple" class="msg">
          {{ erros.video }}
        </Message>
      </section>

      <section v-if="!editando" class="cartao">
        <h2 class="cartao-titulo">4. Consentimento (LGPD)</h2>
        <p class="cartao-subtitulo">O vídeo mostra o rosto do sinalizante e é tratado como dado sensível. Você pode revogar o consentimento a qualquer momento.</p>

        <div class="opcao">
          <Checkbox v-model="form.aceiteTermo" input-id="termo" binary :invalid="mostrarErro('aceiteTermo')" />
          <label for="termo">Li e aceito o termo de uso de imagem (versão 1.0).</label>
        </div>
        <small v-if="mostrarErro('aceiteTermo')" class="erro-solto">{{ erros.aceiteTermo }}</small>

        <div class="opcao">
          <Checkbox v-model="form.sinalizanteMenor" input-id="menor" binary />
          <label for="menor">O sinalizante do vídeo é menor de 18 anos.</label>
        </div>

        <div v-if="form.sinalizanteMenor" class="campo responsavel">
          <label for="termo-resp">Termo assinado pelo responsável legal *</label>
          <input id="termo-resp" type="file" accept="application/pdf,image/*" @change="form.termoResponsavel = ($event.target as HTMLInputElement).files?.[0] ?? null" />
          <small v-if="mostrarErro('termoResponsavel')" class="erro">{{ erros.termoResponsavel }}</small>
        </div>
      </section>

      <div class="rodape-form">
        <p v-if="editando"><i class="pi pi-info-circle" aria-hidden="true" /> Depois de salvar, a submissão volta para a fila da curadoria.</p>
        <p v-else><i class="pi pi-info-circle" aria-hidden="true" /> A submissão fica <strong>Em análise</strong> até a decisão do curador.</p>
        <div class="botoes">
          <Button v-if="editando" label="Cancelar" severity="secondary" text @click="router.push('/minhas-submissoes')" />
          <Button type="submit" :label="editando ? 'Salvar e reenviar' : 'Enviar para curadoria'" icon="pi pi-send" size="large" :loading="enviando" />
        </div>
      </div>
    </form>
  </template>
</template>

<style scoped>
.carregando {
  display: grid;
  place-items: center;
  padding: 4rem;
}
.aviso-ajuste {
  max-width: 880px;
  margin-bottom: 1.25rem;
}
.botoes {
  display: flex;
  gap: 0.5rem;
}
.passos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
}
.passos li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem 0.4rem 0.4rem;
  border-radius: 999px;
  background: var(--superficie);
  border: 1px solid var(--borda);
  font-size: 0.85rem;
  font-weight: 500;
}
.passos span {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primaria-suave);
  color: var(--primaria);
  font-size: 0.75rem;
  font-weight: 700;
}
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 880px;
}
.duas {
  grid-template-columns: 1fr 1fr;
}
.largura-total {
  grid-column: 1 / -1;
}
.zona-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 2.25rem 1rem;
  border: 2px dashed var(--borda);
  border-radius: 14px;
  background: var(--superficie-suave);
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.zona-upload span:last-child {
  color: var(--texto-suave);
  font-size: 0.85rem;
}
.zona-upload:hover,
.zona-upload.arrastando,
.zona-upload:focus-within {
  border-color: var(--primaria);
  background: var(--primaria-suave);
}
.zona-upload.invalida {
  border-color: #ef4444;
}
.icone-upload {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--gradiente-marca);
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}
.previa {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.25rem;
  align-items: center;
}
.previa video {
  width: 100%;
  border-radius: 12px;
  background: #000;
}
.previa-info p {
  margin: 0 0 0.75rem;
  font-weight: 500;
  word-break: break-all;
}
.previa-info i {
  color: #10b981;
}
.msg {
  margin-top: 0.75rem;
}
.opcao {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.opcao label {
  font-size: 0.925rem;
}
.erro-solto {
  display: block;
  margin: -0.25rem 0 0.75rem 2rem;
  color: #dc2626;
  font-size: 0.8125rem;
}
.responsavel {
  margin: 0.5rem 0 0 2rem;
  padding: 1rem;
  border-radius: 12px;
  background: var(--superficie-suave);
}
.rodape-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--raio);
  background: var(--superficie);
  border: 1px solid var(--borda);
  position: sticky;
  bottom: 1rem;
  box-shadow: var(--sombra-alta);
}
.rodape-form p {
  margin: 0;
  color: var(--texto-suave);
  font-size: 0.9rem;
}
@media (max-width: 720px) {
  .duas,
  .previa {
    grid-template-columns: 1fr;
  }
  .rodape-form {
    position: static;
  }
}
</style>
