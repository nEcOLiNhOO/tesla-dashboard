# Painel Tesla

## Novidades v2
- Separador **Reuniões** (abre por omissão): Teams, Zoom (cliente web `app.zoom.us/wc`), Google Meet, Webex.
- Caixa **Entrar em reunião**: cole um link ou escreva um código. ID Zoom (9–11 dígitos) → `app.zoom.us/wc/join/ID`; código Meet (`abc-defg-hij`) → `meet.google.com/abc-defg-hij`; links `zoom.us/j/…` são convertidos para o cliente web. As últimas 6 reuniões ficam em "Recentes".
- Categorias em separadores (cabe tudo em 1280×800 sem deslocar): Reuniões, Mensagens, Trabalho, Entretenimento, Navegação.
- Novas apps: Slack, Telegram, Messenger, LinkedIn, Calendário Outlook, Google Drive, OneDrive, Notion, ChatGPT, Prime Video, Twitch.
- ⚠️ O browser do Tesla só funciona em **Park**: videochamadas só estacionado. Em condução, use voz pelo telemóvel via Bluetooth.
- Dica: no Tesla, a câmara/microfone podem não estar disponíveis no browser; se falhar, entre só com áudio no telemóvel.

Painel estático (estilo ABetterTheater) para o browser do Tesla: mosaicos grandes por categoria, relógio, modo ecrã inteiro e ligações editáveis (guardadas no `localStorage`). Sem dependências nem passo de compilação — basta `index.html`, `style.css` e `script.js`.

## Testar localmente
```
python3 -m http.server 8000
```
Abra http://localhost:8000.

## Alojamento
### Vercel
1. `npm i -g vercel` e, na pasta do projeto, `vercel --prod` (Framework: "Other", sem comando de build, pasta de saída `.`).
2. Ou: carregue a pasta para um repositório GitHub e importe-o em vercel.com/new.

### Cloudflare Pages
1. dash.cloudflare.com → Workers & Pages → Criar → Pages → "Carregar ativos diretos" e arraste a pasta.
2. Ou ligue um repositório GitHub (sem comando de build, diretório de saída `/`).
3. Via CLI: `npx wrangler pages deploy . --project-name painel-tesla`.

### GitHub Pages
1. Crie um repositório e envie os ficheiros (`git push`).
2. Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)`.
3. Fica disponível em `https://<utilizador>.github.io/<repositório>/`.

## Abrir no Tesla
1. Com o carro estacionado, abra o **Browser** no ecrã.
2. Introduza o URL do seu painel e adicione-o aos favoritos.
3. **Ecrã inteiro:** o botão "⛶ Ecrã inteiro" usa a Fullscreen API (pode não funcionar no Tesla). O truque fiável é abrir o painel através de:
   `https://www.youtube.com/redirect?q=https://SEU-PAINEL.exemplo`
   (o Tesla trata páginas vindas do YouTube como "teatro", permitindo ecrã inteiro). Pode ter de tocar em "Ir para o site".
4. Ative **"Modo ecrã inteiro Tesla"** no painel para que cada mosaico abra também via `youtube.com/redirect`.

## Editar ligações
Toque em **✎ Editar**: ◀ ▶ reordenam, ✎ edita, 🗑 remove, **＋ Adicionar** cria, **↺ Repor predefinições** restaura a lista original. As predefinições estão em `DEFAULT_LINKS` no `script.js`.

## Notas
- As ligações abrem no mesmo separador (o browser do Tesla lida mal com separadores).
- Alguns serviços (Netflix, Teams, WhatsApp Web) podem bloquear ou limitar o browser do Tesla.
