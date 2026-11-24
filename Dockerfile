# Etapa 1: gera o build de produção da SPA
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# A chave da licença PrimeUI entra no build (ver .env.example)
ARG VITE_PRIMEUI_LICENSE=
ENV VITE_PRIMEUI_LICENSE=$VITE_PRIMEUI_LICENSE
RUN npm run build

# Etapa 2: Nginx serve os arquivos e repassa /api para o backend
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
