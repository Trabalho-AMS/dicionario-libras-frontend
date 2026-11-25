import type { StatusSubmissao } from '@/types/api'

export const STATUS: Record<StatusSubmissao, { rotulo: string; severidade: 'info' | 'warn' | 'success' | 'danger'; icone: string }> = {
  EM_ANALISE: { rotulo: 'Em análise', severidade: 'info', icone: 'pi pi-clock' },
  AJUSTE_SOLICITADO: { rotulo: 'Ajuste solicitado', severidade: 'warn', icone: 'pi pi-pencil' },
  APROVADA: { rotulo: 'Aprovada', severidade: 'success', icone: 'pi pi-check' },
  REJEITADA: { rotulo: 'Rejeitada', severidade: 'danger', icone: 'pi pi-times' },
}

const formato = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function formatarData(iso: string | null | undefined) {
  return iso ? formato.format(new Date(iso)) : '—'
}
