import { describe, expect, it } from "vitest";
import { getSwfFileName, getSwfSignature, validateSwfUrl } from "./swf-utils";

describe("SWF header inspection", () => {
  it.each(["FWS", "CWS", "ZWS"] as const)("recognizes the %s signature", (signature) => {
    const bytes = new Uint8Array([signature.charCodeAt(0), signature.charCodeAt(1), signature.charCodeAt(2), 9, 0, 0, 0, 0]);
    expect(getSwfSignature(bytes)).toBe(signature);
  });

  it("rejects a short or non-SWF header", () => {
    expect(getSwfSignature(new Uint8Array([70, 87, 83]))).toBeNull();
    expect(getSwfSignature(new Uint8Array([80, 75, 3, 4, 0, 0, 0, 0]))).toBeNull();
  });
});

describe("explicit URL safety checks", () => {
  it("accepts a public HTTPS URL without hidden parameters", () => {
    const url = validateSwfUrl("https://example.org/demos/sample.swf", "https:");
    expect(getSwfFileName(url)).toBe("sample.swf");
  });

  it("rejects embedded credentials, query strings, fragments, and mixed content", () => {
    expect(() => validateSwfUrl("https://user:secret@example.org/file.swf", "https:")).toThrow(/credenciais/);
    expect(() => validateSwfUrl("https://example.org/file.swf?token=secret", "https:")).toThrow(/tokens/);
    expect(() => validateSwfUrl("https://example.org/file.swf#secret", "https:")).toThrow(/tokens/);
    expect(() => validateSwfUrl("http://example.org/file.swf", "https:")).toThrow(/HTTPS/);
  });

  it("rejects non-web URL schemes", () => {
    expect(() => validateSwfUrl("javascript:alert(1)", "http:")).toThrow(/HTTP/);
  });
});
