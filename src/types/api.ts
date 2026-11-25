// Tipos das respostas da API (espelham os records do backend).

export type StatusSubmissao = 'EM_ANALISE' | 'AJUSTE_SOLICITADO' | 'APROVADA' | 'REJEITADA'

/** Submissão com os dados do verbete, do sinal, do vídeo e do consentimento (classes do diagrama UML). */
export interface Submissao {
  id: string
  dataEnvio: string
  status: StatusSubmissao
  palavra: string
  acepcao: string
  exemplo: string | null
  exemploLibras: string | null
  classeGramatical: string | null
  origem: string | null
  assunto: string
  /** UF da variação regional; null é o sinal padrão nacional. */
  regiao: string | null
  configuracaoMao: string
  video: { url: string; formato: string; duracaoSeg: number; tamanhoMB: number }
  consentimento: { versaoTermo: string; dataHora: string; sinalizanteMenor: boolean }
}

/** Campos do formulário de envio/alteração de sinal. */
export interface FormularioSubmissao {
  palavra: string
  acepcao: string
  exemplo: string
  exemploLibras: string
  classeGramatical: string | null
  origem: string
  assunto: string | null
  regiao: string | null
  configuracaoMao: string | null
  aceiteTermo: boolean
  sinalizanteMenor: boolean
  video: File | null
  duracaoSeg: number | null
  termoResponsavel: File | null
}
