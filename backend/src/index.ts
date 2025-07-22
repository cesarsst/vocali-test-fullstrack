import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import fetch from "node-fetch";
import { RealtimeClient } from "@speechmatics/real-time-client";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY; // your Speechmatics API key

async function fetchJWT() {
  const resp = await fetch("https://mp.speechmatics.com/v1/api_keys?type=rt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ ttl: 3600 }),
  });
  if (!resp.ok) throw new Error("Failed to get JWT");
  const json = (await resp.json()) as { key_value: string };
  return json.key_value;
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", async function connection(ws) {
  try {
    console.log("Client connected");
    let finalText = "";
    const client = new RealtimeClient();
    const jwt = await fetchJWT();

    client.addEventListener("receiveMessage", ({ data }) => {
      if (data.message === "AddPartialTranscript") {
        const partialText = data.results
          .map((r) => r.alternatives?.[0].content)
          .join(" ");
        ws.send(JSON.stringify({ type: "partial", text: partialText }));
      } else if (data.message === "AddTranscript") {
        const text = data.results
          .map((r) => r.alternatives?.[0].content)
          .join(" ");
        finalText += text + " ";
        ws.send(JSON.stringify({ type: "final", text: finalText.trim() }));
      } else if (data.message === "EndOfTranscript") {
        ws.send(JSON.stringify({ type: "end" }));
        ws.close();
      }
    });

    await client.start(jwt, {
      transcription_config: {
        operating_point: "enhanced",
        language: "pt",
        enable_partials: true,
        max_delay: 1,
      },
    });

    ws.on("message", (data) => {
      // Receives audio chunk from client and sends to Speechmatics
      client.sendAudio(data);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      client.stopRecognition();
    });
    ws.on("disconnect", () => {
      console.log("Client disconnected");
      client.stopRecognition();
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      client.stopRecognition();
    });
  } catch (err) {
    console.error("Error starting client:", err);
    ws.send(
      JSON.stringify({ type: "error", message: "Error starting transcription" })
    );
    ws.close();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
