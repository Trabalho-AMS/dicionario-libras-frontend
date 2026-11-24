# Dicionário de Libras — Frontend

Frontend (SPA) da [Expansão do Dicionário de Libras](https://github.com/Trabalho-AMS/dicionario-libras),
trabalho final de AMS0002 (UDESC). Backend: [dicionario-libras-backend](https://github.com/Trabalho-AMS/dicionario-libras-backend).

## Stack

- Vue 3 + Vite + TypeScript
- Vue Router
- Pinia

## Bibliotecas

| Biblioteca | Para quê |
|---|---|
| [PrimeVue](https://primevue.org/) + PrimeIcons | Componentes prontos e acessíveis (tabelas, formulários, diálogos, upload), tema Aura com modo escuro automático |
| [Axios](https://axios-http.com/) | Cliente HTTP, configurado em `src/services/api.ts` |
| [VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/) | Validação de formulários com esquemas tipados (`toTypedSchema` de `@vee-validate/zod`) |
| [VueUse](https://vueuse.org/) | Composables prontos, ex.: `useUserMedia` para gravar o sinal pela webcam |
| [Vitest](https://vitest.dev/) + Vue Test Utils | Testes de unidade dos componentes (`src/**/__tests__/*.spec.ts`) |

## Como rodar

Requer Node.js 22.18+ e o backend rodando em `http://localhost:8080`.

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Em desenvolvimento, as chamadas para `/api` são repassadas ao backend
pelo proxy do Vite (ver `vite.config.ts`). Para apontar para outra URL, copie `.env.example` para `.env`
e ajuste `VITE_API_URL`.

Outros comandos:

```bash
npm run test:unit  # testes (Vitest)
npm run build   # checagem de tipos + build de produção em dist/
npm run lint    # lint
```

## Estrutura

```
src/
├── assets/       # estilos globais
├── components/   # componentes compartilhados (player, gravador de webcam, mapa de variações...)
├── router/       # rotas da SPA
├── services/     # api.ts — único ponto de comunicação com o backend
├── stores/       # estado global (Pinia)
└── views/        # páginas
```

| Página | Rota |
|---|---|
| Busca | `/` |
| Verbete | `/verbetes/:id` |
| Enviar sinal | `/enviar-sinal` |
| Minhas submissões | `/minhas-submissoes` |
| Curadoria | `/curadoria` |
| Administração | `/administracao` |
