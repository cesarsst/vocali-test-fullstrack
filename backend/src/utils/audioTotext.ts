import { BatchClient } from "@speechmatics/batch-client";
import fetch from "node-fetch";
import { File } from "node-fetch";

const client = new BatchClient({
  apiKey:
    process.env.API_KEY ||
    (() => {
      throw new Error("API_KEY is not defined in the environment variables");
    })(), // Defina no .env
  appId: "nodeJS-from-url-example",
});

export async function transcribeFromUrl(url: string): Promise<string> {
  console.log(`🔄 Baixando arquivo de: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao baixar o arquivo: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  const contentType = response.headers.get("content-type") || "audio/wav";
  const filename = url.split("/").pop() || "audio.wav";

  const file = new File([buffer], filename, { type: contentType });

  console.log("📤 Enviando para transcrição...");
  const transcription = await client.transcribe(
    file,
    {
      transcription_config: {
        language: "pt", // altere se necessário
      },
    },
    "json-v2"
  );

  console.log("✅ Transcrição finalizada!");

  if (typeof transcription === "string") return transcription;

  return transcription.results
    .map((r) => r.alternatives?.[0].content ?? "")
    .join(" ");
}
