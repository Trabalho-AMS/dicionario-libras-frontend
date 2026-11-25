// Tipos das respostas da API (espelham os records do backend).

export type StatusSubmissao = 'EM_ANALISE' | 'AJUSTE_SOLICITADO' | 'APROVADA' | 'REJEITADA'

export interface Submissao {
  id: string
  palavra: string
  acepcao: string
  exemplo: string | null
  classeGramatical: string | null
  assunto: string
  /** UF da variação regional; null é o sinal padrão nacional. */
  regiao: string | null
  configuracaoMao: string
  video: { url: string; formato: string; duracaoSeg: number; tamanhoMB: number }
  sinalizanteMenor: boolean
  versaoTermo: string
  consentimentoEm: string
  status: StatusSubmissao
  dataEnvio: string
  atualizadaEm: string | null
}

/** Campos do formulário de envio/alteração de sinal. */
export interface FormularioSubmissao {
  palavra: string
  acepcao: string
  exemplo: string
  classeGramatical: string | null
  assunto: string | null
  regiao: string | null
  configuracaoMao: string | null
  aceiteTermo: boolean
  sinalizanteMenor: boolean
  video: File | null
  duracaoSeg: number | null
  termoResponsavel: File | null
}
