export interface OpcaoRegiao {
  uf: string | null
  nome: string
}

/** Sinal sem região é o padrão nacional (RF03). As UFs são as mesmas da migração V2 do backend. */
export const REGIOES: OpcaoRegiao[] = [
  { uf: null, nome: 'Nacional (sinal padrão)' },
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
]

export const CLASSES_GRAMATICAIS = ['Substantivo', 'Verbo', 'Adjetivo', 'Advérbio', 'Pronome', 'Numeral', 'Preposição', 'Conjunção', 'Interjeição']

/** Mesmos assuntos e configurações de mão da migração V2 do backend. */
export const ASSUNTOS = ['Família', 'Alimentos', 'Animais', 'Cores', 'Educação', 'Lugares', 'Números', 'Profissões', 'Saúde', 'Tempo', 'Verbos', 'Outros']

export const CONFIGURACOES_MAO = Array.from({ length: 10 }, (_, i) => `CM${String(i + 1).padStart(2, '0')}`)
