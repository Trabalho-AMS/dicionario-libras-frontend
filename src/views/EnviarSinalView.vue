<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import { ASSUNTOS, CLASSES_GRAMATICAIS, CONFIGURACOES_MAO, REGIOES } from '@/data/apoio'

// Mesmos limites do backend (Video.validar, RF04)
const FORMATOS = ['video/mp4', 'video/webm']
const TAMANHO_MAXIMO_MB = 50
const DURACAO_MAXIMA_SEG = 30

const toast = useToast()

const form = reactive({
  palavra: '',
  assunto: null as string | null,
  classeGramatical: null as string | null,
  acepcao: '',
  exemplo: '',
  regiao: null as string | null,
  configuracaoMao: null as string | null,
  aceiteTermo: false,
  sinalizanteMenor: false,
  termoResponsavel: null as File | null,
})

const video = ref<File | null>(null)
const previaVideo = ref<string | null>(null)
const erroVideo = ref<string | null>(null)
const arrastando = ref(false)
const tentouEnviar = ref(false)

const erros = computed(() => ({
  palavra: !form.palavra.trim() ? 'Informe a palavra em português.' : null,
  assunto: !form.assunto ? 'Escolha um assunto.' : null,
  acepcao: !form.acepcao.trim() ? 'Descreva o significado da palavra.' : null,
  video: erroVideo.value ?? (!video.value ? 'Envie o vídeo do sinal.' : null),
  aceiteTermo: !form.aceiteTermo ? 'É preciso aceitar o termo de uso de imagem.' : null,
  termoResponsavel:
    form.sinalizanteMenor && !form.termoResponsavel
      ? 'Sinalizante menor de 18 anos: anexe o termo assinado pelo responsável (LGPD, art. 14).'
      : null,
}))

const valido = computed(() => Object.values(erros.value).every((e) => e === null))

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
  if (duracao > DURACAO_MAXIMA_SEG) {
    erroVideo.value = `O vídeo tem ${Math.round(duracao)} s; o limite é ${DURACAO_MAXIMA_SEG} s.`
    return
  }
  if (previaVideo.value) URL.revokeObjectURL(previaVideo.value)
  video.value = arquivo
  previaVideo.value = URL.createObjectURL(arquivo)
}

function removerVideo() {
  if (previaVideo.value) URL.revokeObjectURL(previaVideo.value)
  video.value = null
  previaVideo.value = null
  erroVideo.value = null
}

function aoSoltar(evento: DragEvent) {
  arrastando.value = false
  escolherVideo(evento.dataTransfer?.files[0])
}

function enviar() {
  tentouEnviar.value = true
  if (!valido.value) {
    toast.add({ severity: 'warn', summary: 'Revise o formulário', detail: 'Alguns campos precisam de atenção.', life: 4000 })
    return
  }
  toast.add({
    severity: 'info',
    summary: 'Formulário válido',
    detail: 'O envio será feito pela API de submissões, que ainda está em desenvolvimento.',
    life: 6000,
  })
}

type Campo = keyof typeof erros.value
const mostrarErro = (campo: Campo) => tentouEnviar.value && !!erros.value[campo]
</script>

<template>
  <CabecalhoPagina
    titulo="Enviar novo sinal"
    descricao="Preencha o verbete, escolha a região e envie o vídeo. Um curador vai revisar antes da publicação."
  />

  <ol class="passos" aria-label="Etapas do envio">
    <li><span>1</span> Verbete</li>
    <li><span>2</span> Sinal e região</li>
    <li><span>3</span> Vídeo</li>
    <li><span>4</span> Consentimento</li>
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
          <Select v-model="form.assunto" input-id="assunto" :options="ASSUNTOS" :invalid="mostrarErro('assunto')" placeholder="Selecione" fluid />
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
          <Select v-model="form.regiao" input-id="regiao" :options="REGIOES" option-label="nome" option-value="uf" placeholder="Nacional (sinal padrão)" filter fluid />
        </div>
        <div class="campo">
          <label for="cm">Configuração de mão</label>
          <Select v-model="form.configuracaoMao" input-id="cm" :options="CONFIGURACOES_MAO" placeholder="Selecione" show-clear fluid />
        </div>
      </div>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">3. Vídeo do sinal</h2>
      <p class="cartao-subtitulo">MP4 ou WebM, até {{ TAMANHO_MAXIMO_MB }} MB e {{ DURACAO_MAXIMA_SEG }} segundos. Enquadre as mãos e o rosto.</p>

      <div v-if="previaVideo" class="previa">
        <video :src="previaVideo" controls muted aria-label="Prévia do vídeo enviado" />
        <div class="previa-info">
          <p><i class="pi pi-check-circle" aria-hidden="true" /> {{ video?.name }}</p>
          <Button label="Trocar vídeo" icon="pi pi-refresh" severity="secondary" outlined size="small" @click="removerVideo" />
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

    <section class="cartao">
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
      <p><i class="pi pi-info-circle" aria-hidden="true" /> A submissão fica <strong>Em análise</strong> até a decisão do curador.</p>
      <Button type="submit" label="Enviar para curadoria" icon="pi pi-send" size="large" />
    </div>
  </form>
</template>

<style scoped>
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
