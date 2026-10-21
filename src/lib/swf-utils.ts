export type SwfSignature = "FWS" | "CWS" | "ZWS";

const SWF_SIGNATURES = new Set<SwfSignature>(["FWS", "CWS", "ZWS"]);

export function getSwfSignature(bytes: Uint8Array): SwfSignature | null {
  if (bytes.byteLength < 8) return null;

  const signature = String.fromCharCode(bytes[0], bytes[1], bytes[2]);
  return SWF_SIGNATURES.has(signature as SwfSignature) ? (signature as SwfSignature) : null;
}

export function validateSwfUrl(rawValue: string, pageProtocol: string): URL {
  const value = rawValue.trim();
  if (!value) throw new Error("Introduza um URL HTTPS público.");

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("O URL não é válido.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Só são aceites URLs HTTP ou HTTPS.");
  }
  if (url.username || url.password) {
    throw new Error("Remova credenciais incorporadas no URL.");
  }
  if (url.search || url.hash) {
    throw new Error("URLs com parâmetros ou fragmentos não são aceites; podem conter tokens.");
  }
  if (pageProtocol === "https:" && url.protocol !== "https:") {
    throw new Error("Esta página está em HTTPS. O URL do SWF também tem de usar HTTPS.");
  }
  if (!url.hostname) throw new Error("O URL tem de indicar um servidor público.");

  return url;
}

export function getSwfFileName(url: URL): string {
  const lastSegment = url.pathname.split("/").filter(Boolean).at(-1);
  return lastSegment || "filme.swf";
}
