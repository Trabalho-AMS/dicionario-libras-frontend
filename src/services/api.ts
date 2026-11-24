import axios from 'axios'

// Único ponto de comunicação com o backend.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url
    return Promise.reject(new Error(status ? `Erro ${status} ao acessar ${url}` : 'Não foi possível conectar à API'))
  },
)

export interface StatusResposta {
  status: string
  servico: string
}

export const statusApi = {
  verificar: async () => (await http.get<StatusResposta>('/status')).data,
}
