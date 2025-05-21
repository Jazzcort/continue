import { LLMOptions } from "../../index.js";
import { BaseLLM } from "../index.js";

class LocalNomic extends BaseLLM {
  static providerName = "local-nomic";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "http://127.0.0.1:8001",
  };

  protected async _embed(chunks: string[]): Promise<number[][]> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const resp = await this.fetch(new URL("embeddings", this.apiBase), {
      method: "POST",
      body: JSON.stringify({
        input: chunks,
        input_type: "embed",
      }),
      headers: headers,
    });

    if (!resp.ok) {
      throw new Error(`Failed to embed chunk: ${await resp.text()}`);
    }

    const data = await resp.json();
    const embedding: number[][] = data.embeddings;

    if (!embedding || embedding.length === 0) {
      throw new Error("Ollama generated empty embedding");
    }
    return embedding;
  }
}

export default LocalNomic;
