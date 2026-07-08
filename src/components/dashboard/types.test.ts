import { describe, it, expect } from "vitest";
import { fmtPYG, sanitizeText } from "./types";

describe("fmtPYG", () => {
  it("formats zero", () => {
    expect(fmtPYG(0)).toContain("0");
  });

  it("formats positive numbers", () => {
    const result = fmtPYG(1500000);
    expect(result).toContain("1");
    expect(result).toContain("500");
  });

  it("formats large numbers", () => {
    const result = fmtPYG(1000000000);
    expect(result).toContain("1");
  });

  it("handles decimal values", () => {
    const result = fmtPYG(5000.5);
    expect(result).toContain("5");
  });
});

describe("sanitizeText", () => {
  it("removes HTML tags", () => {
    expect(sanitizeText("<script>alert('xss')</script>hello")).toBe("alert('xss')hello");
  });

  it("removes angle brackets", () => {
    expect(sanitizeText("<>")).toBe("");
  });

  it("removes javascript: protocol", () => {
    expect(sanitizeText("javascript:alert(1)")).toBe("alert(1)");
  });

  it("removes event handlers", () => {
    expect(sanitizeText('onclick="evil()"')).toBe('"evil()"');
  });

  it("truncates to maxLen", () => {
    expect(sanitizeText("abcdefghij", 5)).toBe("abcde");
  });

  it("preserves safe text", () => {
    expect(sanitizeText("Hello, World!")).toBe("Hello, World!");
  });

  it("handles empty string", () => {
    expect(sanitizeText("")).toBe("");
  });

  it("handles mixed safe and unsafe content", () => {
    const result = sanitizeText("Normal text <b>bold</b> and <script>evil</script>");
    expect(result).not.toContain("<b>");
    expect(result).not.toContain("</b>");
    expect(result).toContain("Normal text");
  });
});
