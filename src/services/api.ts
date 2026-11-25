import axios from 'axios'
import type { FormularioSubmissao, Submissao } from '@/types/api'

// Único ponto de comunicação com o backend.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
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

function paraFormData(f: FormularioSubmissao): FormData {
  const dados = new FormData()
  const campos: Record<string, string | number | boolean | null> = {
    palavra: f.palavra,
    acepcao: f.acepcao,
    exemplo: f.exemplo,
    classeGramatical: f.classeGramatical,
    assunto: f.assunto,
    regiao: f.regiao,
    configuracaoMao: f.configuracaoMao,
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

/** CRUD das submissões. */
export const submissoesApi = {
  listar: async () => (await http.get<Submissao[]>('/submissoes')).data,
  detalhar: async (id: string) => (await http.get<Submissao>(`/submissoes/${id}`)).data,
  criar: async (f: FormularioSubmissao) => (await http.post<Submissao>('/submissoes', paraFormData(f))).data,
  alterar: async (id: string, f: FormularioSubmissao) =>
    (await http.put<Submissao>(`/submissoes/${id}`, paraFormData(f))).data,
  excluir: async (id: string) => {
    await http.delete(`/submissoes/${id}`)
  },
}
