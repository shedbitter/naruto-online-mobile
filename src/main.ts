import "./styles.css";
import { getSwfFileName, getSwfSignature, validateSwfUrl } from "./lib/swf-utils";

type RuntimeLoadOptions = {
  data: ArrayBuffer;
  swfFileName: string;
  allowScriptAccess: false;
  allowNetworking: "internal";
  credentialAllowList: [];
};

type RuffleApi = {
  load(options: RuntimeLoadOptions): Promise<void>;
};

type RufflePlayerElement = HTMLElement & {
  ruffle(): RuffleApi;
};

type RuffleSource = {
  createPlayer(): RufflePlayerElement;
};

type RuffleGlobal = {
  config?: Record<string, unknown>;
  newest?: () => RuffleSource;
};

declare global {
  interface Window {
    RufflePlayer?: RuffleGlobal;
  }
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Elemento principal da aplicação em falta.");

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="Naruto Online Mobile — início">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="23"/><path d="M43 18c-5-4-13-4-18 0-8 6-8 17-1 23 5 4 13 4 18 0 3-2 5-6 5-10"/><path d="M39 31h13"/></svg>
        </span>
        <span class="brand-copy"><strong>NARUTO ONLINE</strong><small>MOBILE COMPATIBILITY LAB</small></span>
      </a>
      <div class="topbar-right">
        <span class="lab-pill"><span class="pulse-dot"></span> PROVA TÉCNICA</span>
        <span class="version-chip">RUFFLE · WEB</span>
      </div>
    </header>

    <main class="workspace">
      <section class="hero-row" aria-labelledby="page-title">
        <div>
          <p class="eyebrow"><span>01</span> FLASH PLAYER / SAFARI</p>
          <h1 id="page-title">O campo de teste<span class="title-period">.</span></h1>
          <p class="hero-copy">Uma bancada móvel para conteúdo Flash. Escolhe um ficheiro legal e explora o que o Ruffle consegue reproduzir.</p>
        </div>
        <div class="not-verified" role="note">
          <span class="note-icon" aria-hidden="true">!</span>
          <span><strong>Jogo original por verificar</strong><small>O cliente inglês de Naruto Online ainda não foi testado.</small></span>
        </div>
      </section>

      <div class="workspace-grid">
        <section class="player-column" aria-label="Área de reprodução e controlos">
          <div class="player-card">
            <div class="player-toolbar">
              <div class="live-label"><span class="live-dot"></span><span id="stage-state">A iniciar runtime</span></div>
              <div class="stage-tools"><span id="viewport-label">— × —</span><span class="tool-divider"></span><span>SAFARI / WEBASSEMBLY</span></div>
            </div>
            <div id="player-host" class="player-host" aria-label="Área de conteúdo Flash">
              <div class="empty-state" id="empty-state">
                <div class="empty-emblem" aria-hidden="true">
                  <svg viewBox="0 0 112 112"><circle cx="56" cy="56" r="47"/><path d="M76 29c-10-8-27-8-37 0-16 12-16 34-2 46 10 8 27 8 37 0 6-5 10-12 10-20"/><path d="M67 55h28"/><path d="m38 75 9 9 18-22" class="check-stroke"/></svg>
                </div>
                <p class="empty-kicker">ÁREA DE TESTE · RUFFLE</p>
                <h2>Pronto para receber<br />o teu SWF</h2>
                <p class="empty-hint">Seleciona um ficheiro neste dispositivo ou carrega um URL compatível com CORS.</p>
                <span class="empty-state-chip"><span class="mini-dot"></span> NENHUM FILME CARREGADO</span>
              </div>
            </div>
            <div class="player-footer">
              <div class="footer-status"><span class="footer-led"></span><span id="footer-message">A preparar o player local</span></div>
              <span class="stage-aspect">PAINEL 16:9</span>
            </div>
          </div>

          <div class="touch-console" aria-label="Controlos táteis opcionais">
            <div class="console-label"><span>INPUT DE TOQUE</span><span>PREMIR PARA ENVIAR TECLA</span></div>
            <div class="console-controls">
              <div class="dpad" role="group" aria-label="Direções">
                <button class="direction direction-up" type="button" data-key="ArrowUp" aria-label="Manter para cima"><span aria-hidden="true">⌃</span></button>
                <button class="direction direction-left" type="button" data-key="ArrowLeft" aria-label="Manter para a esquerda"><span aria-hidden="true">‹</span></button>
                <button class="direction direction-down" type="button" data-key="ArrowDown" aria-label="Manter para baixo"><span aria-hidden="true">⌄</span></button>
                <button class="direction direction-right" type="button" data-key="ArrowRight" aria-label="Manter para a direita"><span aria-hidden="true">›</span></button>
                <span class="dpad-core" aria-hidden="true"></span>
              </div>
              <p class="console-note">O filme pode usar<br />mapeamentos diferentes.</p>
              <div class="action-pad" role="group" aria-label="Botões A e B">
                <button class="action-button action-a" type="button" data-key="z" aria-label="Manter botão A, tecla Z"><span>A</span></button>
                <button class="action-button action-b" type="button" data-key="x" aria-label="Manter botão B, tecla X"><span>B</span></button>
              </div>
            </div>
          </div>

          <div class="checklist-card">
            <div class="section-heading">
              <div><p class="eyebrow"><span>02</span> MATRIZ DE COMPATIBILIDADE</p><h2>O que falta verificar</h2></div>
              <span class="pending-badge"><span></span> 5 POR VERIFICAR</span>
            </div>
            <ul class="compatibility-list">
              <li><span class="check-number">01</span><span class="compat-copy"><strong>ActionScript 3</strong><small>Suporte parcial no Ruffle; depende do cliente original.</small></span><span class="pending-tag">POR VERIFICAR</span></li>
              <li><span class="check-number">02</span><span class="compat-copy"><strong>Rede e serviços do jogo</strong><small>Pedidos do SWF continuam sujeitos a CORS e às APIs do browser.</small></span><span class="pending-tag">POR VERIFICAR</span></li>
              <li><span class="check-number">03</span><span class="compat-copy"><strong>Autenticação</strong><small>Fluxos de conta, sessão, CAPTCHA e janelas externas não foram avaliados.</small></span><span class="pending-tag">POR VERIFICAR</span></li>
              <li><span class="check-number">04</span><span class="compat-copy"><strong>Limites do Safari</strong><small>Plugins Flash não existem; áudio, ecrã inteiro e memória variam.</small></span><span class="pending-tag">POR VERIFICAR</span></li>
              <li><span class="check-number">05</span><span class="compat-copy"><strong>Controlos móveis</strong><small>Os botões enviam setas, Z e X; o jogo pode exigir outros comandos.</small></span><span class="pending-tag">POR VERIFICAR</span></li>
            </ul>
          </div>
        </section>

        <aside class="side-column" aria-label="Carregamento e diagnósticos">
          <section class="panel-card load-card" aria-labelledby="load-heading">
            <div class="card-heading"><div><p class="eyebrow"><span>03</span> CONTEÚDO</p><h2 id="load-heading">Carregar SWF</h2></div><span class="card-index">01 / 03</span></div>
            <p class="card-intro">Testa um filme Flash legalmente obtido. O ficheiro local é lido na memória do navegador.</p>
            <label class="file-picker" for="swf-file">
              <span class="upload-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7 9m5-5 5 5M5 15v4h14v-4"/></svg></span>
              <span><strong>Escolher ficheiro</strong><small>Selecionar um .swf no dispositivo</small></span>
              <span class="picker-arrow" aria-hidden="true">↗</span>
            </label>
            <input class="visually-hidden" id="swf-file" type="file" accept=".swf,application/x-shockwave-flash,application/octet-stream" />
            <div class="divider-label"><span>OU URL HTTPS PÚBLICO</span></div>
            <form id="url-form" class="url-form" novalidate>
              <label for="swf-url">Endereço direto do SWF</label>
              <div class="url-field"><span aria-hidden="true">↗</span><input id="swf-url" name="url" type="url" inputmode="url" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="https://exemplo.pt/filme.swf" aria-describedby="cors-note" /><button type="submit" aria-label="Carregar URL">→</button></div>
            </form>
            <p class="cors-note" id="cors-note"><span aria-hidden="true">ⓘ</span> O servidor tem de permitir CORS. Sem proxy, cookies, credenciais ou URLs com tokens.</p>
          </section>

          <section class="panel-card diagnostics-card" aria-labelledby="diagnostics-heading">
            <div class="card-heading"><div><p class="eyebrow"><span>04</span> SISTEMA</p><h2 id="diagnostics-heading">Diagnóstico</h2></div><span class="ready-indicator" id="runtime-indicator"><i></i> A INICIAR</span></div>
            <div class="runtime-readout"><span class="readout-icon" aria-hidden="true">R</span><span><strong id="runtime-title">A iniciar Ruffle</strong><small id="runtime-detail">Carregador local</small></span><span class="readout-spinner" id="runtime-spinner"></span></div>
            <div class="capability-grid">
              <div class="capability"><span>WEBASSEMBLY</span><strong id="wasm-value">—</strong></div>
              <div class="capability"><span>CONTEXTO HTTPS</span><strong id="secure-value">—</strong></div>
              <div class="capability"><span>TOQUE</span><strong id="touch-value">—</strong></div>
              <div class="capability"><span>ORIENTAÇÃO</span><strong id="orientation-value">—</strong></div>
            </div>
            <div class="log-heading"><span>EVENTOS VISÍVEIS</span><span class="log-live"><i></i> LOCAL</span></div>
            <ol class="diagnostic-log" id="diagnostic-log" aria-live="polite" aria-relevant="additions text"></ol>
            <p class="diagnostic-footnote">O Safari não expõe todos os erros de ActionScript nem distingue sempre CORS de falhas de rede.</p>
          </section>

          <div class="privacy-strip"><span class="privacy-icon" aria-hidden="true">◈</span><span><strong>Sem contas. Sem telemetria.</strong><small>Sem credenciais, cookies ou registos enviados pela aplicação.</small></span></div>
        </aside>
      </div>
    </main>

    <footer class="page-footer"><span>LABORATÓRIO DE COMPATIBILIDADE · CONTEÚDO FORNECIDO PELO UTILIZADOR</span><span>RUFFLE <b>×</b> SAFARI</span></footer>
  </div>
`;

const query = <T extends Element>(selector: string): T => {
  const element = app.querySelector<T>(selector);
  if (!element) throw new Error(`Elemento da interface em falta: ${selector}`);
  return element;
};

const playerHost = query<HTMLDivElement>("#player-host");
const emptyState = query<HTMLDivElement>("#empty-state");
const fileInput = query<HTMLInputElement>("#swf-file");
const urlForm = query<HTMLFormElement>("#url-form");
const urlInput = query<HTMLInputElement>("#swf-url");
const stageState = query<HTMLSpanElement>("#stage-state");
const footerMessage = query<HTMLSpanElement>("#footer-message");
const runtimeIndicator = query<HTMLSpanElement>("#runtime-indicator");
const runtimeTitle = query<HTMLElement>("#runtime-title");
const runtimeDetail = query<HTMLElement>("#runtime-detail");
const runtimeSpinner = query<HTMLSpanElement>("#runtime-spinner");
const diagnosticLog = query<HTMLOListElement>("#diagnostic-log");
let currentPlayer: RufflePlayerElement | null = null;
let lastDiagnostic = "";

function setRuntime(state: "loading" | "ready" | "error", title: string, detail: string): void {
  runtimeIndicator.className = `ready-indicator state-${state}`;
  runtimeIndicator.innerHTML = `<i></i> ${state === "ready" ? "PRONTO" : state === "error" ? "ERRO" : "A INICIAR"}`;
  runtimeTitle.textContent = title;
  runtimeDetail.textContent = detail;
  runtimeSpinner.hidden = state !== "loading";
  stageState.textContent = state === "ready" ? "Runtime preparado" : state === "error" ? "Runtime indisponível" : "A iniciar runtime";
}

function recordDiagnostic(message: string, kind: "info" | "success" | "warning" | "error" = "info"): void {
  if (message === lastDiagnostic) return;
  lastDiagnostic = message;

  const item = document.createElement("li");
  item.className = `diagnostic-item diagnostic-${kind}`;
  const marker = document.createElement("span");
  marker.className = "diagnostic-marker";
  marker.setAttribute("aria-hidden", "true");
  const copy = document.createElement("span");
  copy.className = "diagnostic-copy";
  copy.textContent = message;
  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  item.append(marker, copy, time);
  diagnosticLog.prepend(item);

  while (diagnosticLog.children.length > 5) diagnosticLog.lastElementChild?.remove();
}

function updateEnvironment(): void {
  query<HTMLSpanElement>("#viewport-label").textContent = `${window.innerWidth} × ${window.innerHeight}`;
  query<HTMLElement>("#wasm-value").textContent = typeof WebAssembly === "object" ? "DISPONÍVEL" : "AUSENTE";
  query<HTMLElement>("#secure-value").textContent = window.isSecureContext ? "SIM" : "NÃO";
  query<HTMLElement>("#touch-value").textContent = navigator.maxTouchPoints > 0 ? `${navigator.maxTouchPoints} PONTOS` : "NÃO DETETADO";
  query<HTMLElement>("#orientation-value").textContent = window.matchMedia("(orientation: landscape)").matches ? "HORIZONTAL" : "VERTICAL";
}

function loadRuffleScript(): Promise<void> {
  window.RufflePlayer = window.RufflePlayer ?? {};
  window.RufflePlayer.config = {
    ...window.RufflePlayer.config,
    autoplay: "off",
    allowNetworking: "internal",
    credentialAllowList: [],
    contextMenu: false,
    logLevel: "error",
    warnOnUnsupportedContent: true,
  };

  const existing = document.querySelector<HTMLScriptElement>("script[data-ruffle-runtime]");
  if (window.RufflePlayer.newest && existing?.dataset.loaded === "true") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = existing ?? document.createElement("script");
    script.dataset.ruffleRuntime = "true";
    script.src = `${import.meta.env.BASE_URL}vendor/ruffle/ruffle.js`;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      if (window.RufflePlayer?.newest) resolve();
      else reject(new Error("O runtime Ruffle não registou a API esperada."));
    };
    script.onerror = () => reject(new Error("Não foi possível carregar os ficheiros locais do Ruffle."));
    if (!existing) document.head.append(script);
  });
}

async function initializeRuffle(): Promise<void> {
  setRuntime("loading", "A iniciar Ruffle", "Carregador local");
  try {
    await loadRuffleScript();
    setRuntime("ready", "Ruffle preparado", "Ficheiros locais carregados");
    footerMessage.textContent = "Ruffle preparado · à espera de um SWF";
    recordDiagnostic("Ruffle inicializado a partir do pacote local.", "success");
  } catch {
    setRuntime("error", "Ruffle indisponível", "Verifica a instalação do pacote.");
    footerMessage.textContent = "O runtime não foi carregado";
    recordDiagnostic("Falha ao carregar o runtime local. Executa npm install e volta a compilar.", "error");
  }
}

async function loadMovie(bytes: Uint8Array, fileName: string): Promise<void> {
  const signature = getSwfSignature(bytes);
  if (!signature) {
    stageState.textContent = "Ficheiro não reconhecido";
    footerMessage.textContent = "Cabeçalho SWF inválido ou ficheiro incompleto";
    recordDiagnostic("O ficheiro não tem um cabeçalho SWF reconhecido (FWS, CWS ou ZWS).", "error");
    return;
  }

  if (!window.RufflePlayer?.newest) {
    recordDiagnostic("Ruffle não está disponível; o SWF não foi enviado nem aberto.", "error");
    return;
  }

  stageState.textContent = "A carregar conteúdo";
  footerMessage.textContent = `A preparar ${fileName}`;
  recordDiagnostic(`Cabeçalho ${signature} reconhecido. A carregar o filme na memória.`, "info");

  try {
    const source = window.RufflePlayer.newest();
    const player = source.createPlayer();
    player.className = "ruffle-player";
    player.setAttribute("aria-label", "Filme Flash em reprodução no Ruffle");
    playerHost.replaceChildren(player);
    currentPlayer = player;
    const movieData = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(movieData).set(bytes);
    await player.ruffle().load({
      data: movieData,
      swfFileName: fileName,
      allowScriptAccess: false,
      allowNetworking: "internal",
      credentialAllowList: [],
    });
    emptyState.hidden = true;
    stageState.textContent = "Conteúdo carregado";
    footerMessage.textContent = `${fileName} · carregado no Ruffle`;
    recordDiagnostic("O Ruffle aceitou o filme. Isto não confirma a compatibilidade de todas as funções.", "success");
  } catch {
    currentPlayer = null;
    playerHost.replaceChildren(emptyState);
    emptyState.hidden = false;
    stageState.textContent = "Falha ao carregar conteúdo";
    footerMessage.textContent = "O Ruffle não conseguiu carregar este filme";
    recordDiagnostic("O Ruffle falhou ao carregar o filme; o detalhe interno pode não estar disponível à página.", "error");
  }
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".swf")) {
    recordDiagnostic("Seleciona um ficheiro com extensão .swf.", "error");
    fileInput.value = "";
    return;
  }

  stageState.textContent = "A ler ficheiro local";
  footerMessage.textContent = `A ler ${file.name} deste dispositivo`;
  recordDiagnostic(`Ficheiro local selecionado (${(file.size / (1024 * 1024)).toFixed(1)} MB).`, "info");
  try {
    await loadMovie(new Uint8Array(await file.arrayBuffer()), file.name);
  } catch {
    stageState.textContent = "Falha de leitura local";
    footerMessage.textContent = "O browser não conseguiu ler este ficheiro";
    recordDiagnostic("O browser não conseguiu ler o ficheiro local selecionado.", "error");
  } finally {
    fileInput.value = "";
  }
});

urlForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let remoteUrl: URL;
  try {
    remoteUrl = validateSwfUrl(urlInput.value, window.location.protocol);
  } catch (error) {
    const message = error instanceof Error ? error.message : "O URL não é válido.";
    footerMessage.textContent = message;
    recordDiagnostic(message, "warning");
    urlInput.focus();
    return;
  }

  const submitButton = urlForm.querySelector<HTMLButtonElement>("button[type='submit']");
  if (submitButton) submitButton.disabled = true;
  stageState.textContent = "A obter URL";
  footerMessage.textContent = "Pedido HTTPS direto · CORS obrigatório";
  recordDiagnostic("A obter o SWF diretamente com CORS; sem cookies, credenciais ou redirecionamentos.", "info");

  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      cache: "no-store",
    });
    if (!response.ok) {
      stageState.textContent = "Erro HTTP";
      footerMessage.textContent = `O servidor respondeu ${response.status}`;
      recordDiagnostic(`O servidor respondeu com erro HTTP ${response.status}.`, "error");
      return;
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!getSwfSignature(bytes)) {
      stageState.textContent = "Resposta não é SWF";
      footerMessage.textContent = "A resposta não contém um cabeçalho SWF reconhecido";
      recordDiagnostic("O servidor respondeu, mas o conteúdo não começa com um cabeçalho SWF reconhecido.", "error");
      return;
    }
    await loadMovie(bytes, getSwfFileName(remoteUrl));
  } catch {
    stageState.textContent = "Falha de rede ou CORS";
    footerMessage.textContent = "Verifica HTTPS, CORS e o acesso público ao ficheiro";
    recordDiagnostic("Falha de rede ou CORS. O browser não revela sempre qual destas causas ocorreu.", "error");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

function sendTouchKey(button: HTMLButtonElement, type: "keydown" | "keyup"): void {
  if (!currentPlayer) return;
  const key = button.dataset.key;
  if (!key) return;
  const code = key.startsWith("Arrow") ? key : key.toUpperCase() === "Z" ? "KeyZ" : "KeyX";
  currentPlayer.focus({ preventScroll: true });
  currentPlayer.dispatchEvent(new KeyboardEvent(type, { key, code, bubbles: true, cancelable: true }));
}

app.querySelectorAll<HTMLButtonElement>(".console-controls button[data-key]").forEach((button) => {
  let pressed = false;
  const press = (event: PointerEvent) => {
    event.preventDefault();
    if (pressed) return;
    pressed = true;
    button.classList.add("is-pressed");
    sendTouchKey(button, "keydown");
  };
  const release = () => {
    if (!pressed) return;
    pressed = false;
    button.classList.remove("is-pressed");
    sendTouchKey(button, "keyup");
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
  button.addEventListener("blur", release);
  button.addEventListener("click", (event) => {
    // Pointer presses are held from pointerdown to pointerup. Keyboard and
    // assistive-technology activation gets a short, accessible key press.
    if (event.detail !== 0 || pressed) return;
    sendTouchKey(button, "keydown");
    window.setTimeout(() => sendTouchKey(button, "keyup"), 80);
  });
});

window.addEventListener("resize", updateEnvironment, { passive: true });
window.addEventListener("orientationchange", updateEnvironment, { passive: true });
updateEnvironment();
recordDiagnostic("Verificação do navegador concluída; nenhum filme foi aberto automaticamente.", "info");
void initializeRuffle();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {
      recordDiagnostic("O browser não permitiu registar o modo offline da aplicação.", "warning");
    });
  }, { once: true });
}
