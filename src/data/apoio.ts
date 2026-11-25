/** Opções fixas do formulário de envio de sinal. */

export const ASSUNTOS = ['Família', 'Alimentos', 'Animais', 'Cores', 'Educação', 'Lugares', 'Números', 'Profissões', 'Saúde', 'Tempo', 'Verbos', 'Outros']

export const CONFIGURACOES_MAO = Array.from({ length: 10 }, (_, i) => `CM${String(i + 1).padStart(2, '0')}`)

export const CLASSES_GRAMATICAIS = ['Substantivo', 'Verbo', 'Adjetivo', 'Advérbio', 'Pronome', 'Numeral', 'Preposição', 'Conjunção', 'Interjeição']

/** Sem UF, o sinal é o padrão nacional; com UF, é uma variação regional. */
export const REGIOES: { uf: string | null; nome: string }[] = [
  { uf: null, nome: 'Nacional (sinal padrão)' },
  ...Object.entries({
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal',
    ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
    RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
    SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
  }).map(([uf, nome]) => ({ uf, nome: `${nome} (${uf})` })),
]

export function nomeRegiao(uf: string | null) {
  return REGIOES.find((r) => r.uf === uf)?.nome ?? uf ?? 'Nacional'
}
