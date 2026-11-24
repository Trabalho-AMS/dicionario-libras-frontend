import { useDark, useToggle } from '@vueuse/core'

// Segue o tema do sistema na primeira visita e lembra a escolha do usuário depois.
const escuro = useDark({ selector: 'html', attribute: 'class', valueDark: 'app-dark', valueLight: '' })
const alternar = useToggle(escuro)

export function useTema() {
  return { escuro, alternar }
}
