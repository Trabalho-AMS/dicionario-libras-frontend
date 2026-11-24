<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'

/** Player feito para aprender Libras (RF14): câmera lenta, repetição e espelhamento para canhotos. */
const props = defineProps<{ url: string; descricao: string }>()

const video = ref<HTMLVideoElement | null>(null)
const velocidade = ref(1)
const repetir = ref(true)
const espelhar = ref(false)

const velocidades = [0.5, 0.75, 1]

watch(velocidade, (v) => {
  if (video.value) video.value.playbackRate = v
})

watch(
  () => props.url,
  () => {
    velocidade.value = 1
  },
)

function aoCarregar() {
  if (video.value) video.value.playbackRate = velocidade.value
}
</script>

<template>
  <figure class="player">
    <video
      ref="video"
      :key="url"
      :src="url"
      :loop="repetir"
      :class="{ espelhado: espelhar }"
      controls
      muted
      playsinline
      autoplay
      :aria-label="descricao"
      @loadedmetadata="aoCarregar"
    />
    <figcaption class="sr-only">{{ descricao }}</figcaption>
    <div class="controles" role="group" aria-label="Controles para aprender o sinal">
      <div class="grupo" role="radiogroup" aria-label="Velocidade">
        <Button
          v-for="v in velocidades"
          :key="v"
          :label="`${String(v).replace('.', ',')}x`"
          size="small"
          :severity="velocidade === v ? undefined : 'secondary'"
          :outlined="velocidade !== v"
          role="radio"
          :aria-checked="velocidade === v"
          @click="velocidade = v"
        />
      </div>
      <Button
        icon="pi pi-replay"
        label="Repetir"
        size="small"
        :severity="repetir ? undefined : 'secondary'"
        :outlined="!repetir"
        :aria-pressed="repetir"
        @click="repetir = !repetir"
      />
      <Button
        icon="pi pi-arrows-h"
        label="Espelhar"
        size="small"
        :severity="espelhar ? undefined : 'secondary'"
        :outlined="!espelhar"
        :aria-pressed="espelhar"
        @click="espelhar = !espelhar"
      />
    </div>
  </figure>
</template>

<style scoped>
.player {
  margin: 0;
}
video {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  background: #0b1120;
  object-fit: contain;
}
video.espelhado {
  transform: scaleX(-1);
}
.controles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.grupo {
  display: flex;
  gap: 0.25rem;
  margin-right: auto;
}
</style>
