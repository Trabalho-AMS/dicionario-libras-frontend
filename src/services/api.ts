import axios from 'axios'
import type {
  Apoio,
  FormularioSubmissao,
  StatusSubmissao,
  Submissao,
  Usuario,
  VerbetePublicado,
} from '@/types/api'

export const CHAVE_USUARIO = 'dicionario-libras:usuario'

// Único ponto de comunicação com o backend.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

// O protótipo não tem login: o usuário escolhido no topo da tela vai no cabeçalho X-Usuario-Id.
http.interceptors.request.use((config) => {
  let usuarioId: string | null = null
  try {
    usuarioId = localStorage.getItem(CHAVE_USUARIO)
  } catch {
    usuarioId = null
  }
  if (usuarioId) config.headers.set('X-Usuario-Id', usuarioId)
  return config
})

// A API devolve { status, mensagem } com uma mensagem pronta para mostrar ao usuário.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem = error.response?.data?.mensagem
    const status = error.response?.status
    const url = error.config?.url
    return Promise.reject(
      new Error(mensagem ?? (status ? `Erro ${status} ao acessar ${url}` : 'Não foi possível conectar à API')),
    )
  },
)

export interface StatusResposta {
  status: string
  servico: string
}

export const statusApi = {
  verificar: async () => (await http.get<StatusResposta>('/status')).data,
}

export const usuariosApi = {
  listar: async () => (await http.get<Usuario[]>('/usuarios')).data,
}

export const dicionarioApi = {
  apoio: async () => (await http.get<Apoio>('/apoio')).data,
  buscar: async (busca: string) => (await http.get<VerbetePublicado[]>('/verbetes', { params: { busca } })).data,
  verbete: async (id: string) => (await http.get<VerbetePublicado>(`/verbetes/${id}`)).data,
}

function paraFormData(f: FormularioSubmissao): FormData {
  const dados = new FormData()
  const campos: Record<string, string | number | boolean | null> = {
    palavra: f.palavra,
    acepcao: f.acepcao,
    exemplo: f.exemplo,
    classeGramatical: f.classeGramatical,
    assuntoId: f.assuntoId,
    regiaoId: f.regiaoId,
    configuracaoMaoId: f.configuracaoMaoId,
    duracaoSeg: f.duracaoSeg,
    aceiteTermo: f.aceiteTermo,
    sinalizanteMenor: f.sinalizanteMenor,
  }
  Object.entries(campos).forEach(([chave, valor]) => {
    if (valor !== null && valor !== '') dados.append(chave, String(valor))
  })
  if (f.video) dados.append('video', f.video)
  if (f.sinalizanteMenor && f.termoResponsavel) dados.append('termoResponsavel', f.termoResponsavel)
  return dados
}

export const submissoesApi = {
  criar: async (f: FormularioSubmissao) => (await http.post<Submissao>('/submissoes', paraFormData(f))).data,
  alterar: async (id: string, f: FormularioSubmissao) =>
    (await http.put<Submissao>(`/submissoes/${id}`, paraFormData(f))).data,
  excluir: async (id: string) => {
    await http.delete(`/submissoes/${id}`)
  },
  minhas: async () => (await http.get<Submissao[]>('/submissoes/minhas')).data,
  fila: async (status?: StatusSubmissao) =>
    (await http.get<Submissao[]>('/submissoes', { params: status ? { status } : {} })).data,
  detalhar: async (id: string) => (await http.get<Submissao>(`/submissoes/${id}`)).data,
  aprovar: async (id: string) => (await http.post<Submissao>(`/submissoes/${id}/aprovar`)).data,
  solicitarAjuste: async (id: string, motivo: string) =>
    (await http.post<Submissao>(`/submissoes/${id}/solicitar-ajuste`, { motivo })).data,
  rejeitar: async (id: string, motivo: string) =>
    (await http.post<Submissao>(`/submissoes/${id}/rejeitar`, { motivo })).data,
}
