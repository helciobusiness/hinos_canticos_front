# Hinário Digital — Frontend Web PWA (`hinos_canticos_front`)

Aplicação Web Progressiva (**PWA**) desenvolvida com **React**, **TypeScript**, **Vite** e **React Router**, desenhada com abordagem **mobile-first**, estética moderna nas cores **Branco e Vermelho**, suporte a **Modo Escuro (Dark Mode)**, tipografia adaptável para leitura e canto congregacional, e funcionamento offline.

---

## 1. Requisitos

* **Node.js**: v20.x ou superior
* **npm**: v10.x ou superior
* **Hinário Digital API**: em execução em `http://localhost:3000` (ou URL configurada)

---

## 2. Instalação

Aceda ao diretório do frontend e instale as dependências:

```bash
cd hinos_canticos_front
npm install
```

---

## 3. Variáveis de Ambiente

Copie o ficheiro `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configuração da URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

O frontend comunica exclusivamente com a API através desta variável de ambiente e centraliza todas as requisições na camada `src/services/api/`.

---

## 4. Execução em Desenvolvimento

Inicie o servidor de desenvolvimento Vite:

```bash
npm run dev
```

Abra no navegador em:
👉 **`http://localhost:5173`**

---

## 5. Funcionalidades Principais

* **Paleta Branco e Vermelho**: identidade visual com contraste e legibilidade.
* **Modo Escuro**: alternância suave entre temas Claro e Escuro com persistência local e ajuste da cor da barra de status no telemóvel.
* **Pesquisa Inteligente com Debounce**: busca instantânea por número, título, autor ou trecho da letra com realce de correspondências e tolerância a acentos em português.
* **Salto Rápido por Número**: campo dedicado para navegar diretamente para o hino desejado sem rolagem.
* **Leitor de Hinos Otimizado**:
  * Estrofes numeradas com badges sutis.
  * Refrões/Coros destacados com borda vermelha e fundo suave.
  * Controlo de tamanho de fonte (A- e A+).
  * Alternância entre fonte moderna (Sans) e clássica (Serif).
  * Navegação sequencial (Hino Anterior / Hino Seguinte) via botões e atalhos de teclado (Setas Esquerda e Direita).
* **Favoritos e Histórico**: guardados localmente (`localStorage`), com suporte a pesquisa dentro dos favoritos e limpeza de histórico.
* **Partilha**: integração com a Web Share API nativa e fallback para cópia de link para a área de transferência com notificação toast, além de atalhos para WhatsApp e Telegram.

---

## 6. Progressive Web App (PWA)

O frontend implementa os padrões PWA para permitir instalação e funcionamento offline:
* **Web App Manifest**: configurado em `public/manifest.webmanifest`.
* **Service Worker**: gerido via Workbox com estratégia NetworkFirst e cache de hinos consultados.
* **Ícones**: resoluções 192x192, 512x512, maskable e apple-touch-icon.
* **Instalação no iPhone (Safari)**: modal com passo a passo ilustrado:
  1. Tocar em Partilhar.
  2. Selecionar "Adicionar ao ecrã principal".
  3. Confirmar em "Adicionar".
* **Instalação no Android/Desktop**: botão interativo com acionamento do evento `beforeinstallprompt`.

---

## 7. Testes Automatizados

Execute os testes unitários com Vitest:

```bash
npm run test
```

Testa normalização de caracteres portugueses, gerador de expressões regulares de diacríticos para destaque de busca, formatação de números de hinos ("001") e formatação de timestamps relativos.

---

## 8. Build e Deploy

Para gerar o bundle de produção otimizado:

```bash
npm run build
```

Para pré-visualizar localmente a versão compilada:

```bash
npm run preview
```

### Deploy em Produção

O projeto compilado (`dist/`) pode ser hospedado em qualquer serviço estático ou CDN (Vercel, Cloudflare Pages, Netlify, AWS S3 + CloudFront).

Defina a variável `VITE_API_URL` nas configurações do provedor apontando para a sua API em produção:

```env
VITE_API_URL=https://api.hinariodigital.com/api
```
