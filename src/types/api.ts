// Tipos das respostas da API (espelham os records do backend).

export type Perfil = 'COLABORADOR' | 'CURADOR' | 'ADMINISTRADOR'
export type StatusSubmissao = 'EM_ANALISE' | 'AJUSTE_SOLICITADO' | 'APROVADA' | 'REJEITADA'

export interface Usuario {
  id: string
  nome: string
  email: string
  perfil: Perfil
}

export interface ItemApoio {
  id: number
  codigo: string | null
  nome: string
}

export interface Apoio {
  regioes: ItemApoio[]
  assuntos: ItemApoio[]
  configuracoesMao: ItemApoio[]
}

export interface VerbeteResumo {
  id: string
  palavra: string
  acepcao: string
  exemplo: string | null
  classeGramatical: string | null
  assunto: ItemApoio
}

export interface SinalResumo {
  id: string
  padrao: boolean
  publicado: boolean
  regiao: ItemApoio | null
  configuracaoMao: ItemApoio
  videoId: string
  verbete: VerbeteResumo
}

export interface VideoResumo {
  id: string
  url: string
  formato: string
  duracaoSeg: number
  tamanhoMB: number
}

export interface ConsentimentoResumo {
  id: string
  versaoTermo: string
  dataHora: string
  sinalizanteMenor: boolean
  termoResponsavelEnviado: boolean
  revogado: boolean
}

export interface Submissao {
  id: string
  status: StatusSubmissao
  dataEnvio: string
  justificativa: string | null
  autor: Usuario
  curador: Usuario | null
  sinal: SinalResumo
  video: VideoResumo
  consentimento: ConsentimentoResumo
}

export interface VerbetePublicado {
  verbete: VerbeteResumo
  sinais: { sinal: SinalResumo; video: VideoResumo }[]
}

/** Campos do formulário de envio/alteração de sinal. */
export interface FormularioSubmissao {
  palavra: string
  acepcao: string
  exemplo: string
  classeGramatical: string | null
  assuntoId: number | null
  regiaoId: number | null
  configuracaoMaoId: number | null
  aceiteTermo: boolean
  sinalizanteMenor: boolean
  video: File | null
  duracaoSeg: number | null
  termoResponsavel: File | null
}
