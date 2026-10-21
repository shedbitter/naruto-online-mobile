export const CAPABILITY_TESTS = [
  {
    id: "as3-avm2",
    title: "ActionScript 3 / AVM2",
    description: "Executa o ponto de entrada do SWF de demonstração.",
    executable: true,
  },
  {
    id: "external-interface",
    title: "ExternalInterface",
    description: "Testa chamadas Flash → JavaScript e JavaScript → Flash no SWF próprio.",
    executable: true,
  },
  {
    id: "url-loader",
    title: "URLLoader · recurso local",
    description: "Lê um texto estático servido pela própria aplicação.",
    executable: true,
  },
  {
    id: "external-swf",
    title: "Loader · SWF filho",
    description: "Carrega um segundo SWF de demonstração da mesma origem.",
    executable: true,
  },
  {
    id: "socket-xmlsocket",
    title: "Socket / XMLSocket",
    description: "Sem teste: o Safari não expõe TCP bruto; Ruffle Web precisa de um servidor WebSocket configurado.",
    executable: false,
  },
  {
    id: "netconnection",
    title: "NetConnection · Flash Remoting",
    description: "Sem teste: não existe endpoint AMF de demonstração neste projeto.",
    executable: false,
  },
] as const;

export type CapabilityTestId = (typeof CAPABILITY_TESTS)[number]["id"];
export type CapabilityTestStatus = "passed" | "failed" | "inconclusive";

export interface CapabilityTestResult {
  id: CapabilityTestId;
  status: CapabilityTestStatus;
  detail: string;
}

export interface RawCapabilityTestResult {
  id: unknown;
  passed: unknown;
  detail: unknown;
}

export function isCapabilityTestId(value: unknown): value is CapabilityTestId {
  return typeof value === "string" && CAPABILITY_TESTS.some((test) => test.id === value);
}

export function normalizeCapabilityTestResult(value: RawCapabilityTestResult): CapabilityTestResult | null {
  if (!isCapabilityTestId(value.id) || typeof value.passed !== "boolean") return null;
  if (!CAPABILITY_TESTS.some((test) => test.id === value.id && test.executable)) return null;

  const detail = typeof value.detail === "string" ? value.detail.trim().slice(0, 220) : "Sem detalhe fornecido pelo SWF.";
  return {
    id: value.id,
    status: value.passed ? "passed" : "failed",
    detail: detail || "Sem detalhe fornecido pelo SWF.",
  };
}
