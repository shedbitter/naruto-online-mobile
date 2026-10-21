import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  CAPABILITY_TESTS,
  isCapabilityTestId,
  normalizeCapabilityTestResult,
} from "../src/lib/capability-tests";
import { getSwfSignature } from "../src/lib/swf-utils";

const fixtureDirectory = fileURLToPath(new URL("../public/test-fixtures/", import.meta.url));

describe("ensaios isolados de compatibilidade Ruffle", () => {
  it("aceita apenas resultados para testes executáveis conhecidos", () => {
    expect(isCapabilityTestId("as3-avm2")).toBe(true);
    expect(isCapabilityTestId("unknown-test")).toBe(false);
    expect(normalizeCapabilityTestResult({ id: "netconnection", passed: true, detail: "unexpected" })).toBeNull();
  });

  it("normaliza sucesso e falha sem guardar dados arbitrários", () => {
    expect(normalizeCapabilityTestResult({ id: "url-loader", passed: true, detail: "OK" })).toEqual({
      id: "url-loader",
      status: "passed",
      detail: "OK",
    });
    expect(normalizeCapabilityTestResult({ id: "external-swf", passed: false, detail: " erro " })).toEqual({
      id: "external-swf",
      status: "failed",
      detail: "erro",
    });
    expect(normalizeCapabilityTestResult({ id: "as3-avm2", passed: "yes", detail: "ignored" })).toBeNull();
  });

  it("inclui os SWFs de demonstração próprios e não testa sockets nem autenticação", () => {
    const probe = readFileSync(`${fixtureDirectory}ruffle-capability-probe.swf`);
    const child = readFileSync(`${fixtureDirectory}capability-child.swf`);
    expect(getSwfSignature(probe)).toBe("CWS");
    expect(getSwfSignature(child)).toBe("CWS");
    expect(CAPABILITY_TESTS.filter((test) => test.executable)).toHaveLength(4);
    expect(CAPABILITY_TESTS.filter((test) => !test.executable).map((test) => test.id)).toEqual([
      "socket-xmlsocket",
      "netconnection",
    ]);
  });
});
