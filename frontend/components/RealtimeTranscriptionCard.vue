<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const transcript = ref("");
const partial = ref("");
const ws = ref<WebSocket | null>(null);
const isRecording = ref(false);
const socketStatus = ref("Disconnected");
let mediaRecorder: MediaRecorder | null = null;

function connectWebSocket() {
  ws.value = new WebSocket("ws://localhost:8080");

  ws.value.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "partial") {
      partial.value = msg.text;
    } else if (msg.type === "final") {
      transcript.value = msg.text;
      partial.value = "";
    } else if (msg.type === "end") {
      stopRecording();
    } else if (msg.type === "error") {
      alert("Error: " + msg.message);
      stopRecording();
    }
  };

  ws.value.onclose = () => {
    isRecording.value = false;
  };
}

function startRecording() {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    try {
      connectWebSocket();
      socketStatus.value = "Connected";
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      return;
    }
  }

  setTimeout(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws.value?.readyState === WebSocket.OPEN) {
          event.data.arrayBuffer().then((buffer) => {
            ws.value?.send(buffer);
          });
        }
      };

      mediaRecorder.start(250);
      isRecording.value = true;
    });
  }, 3000); // 3 seconds should be enough
}

function stopRecording() {
  mediaRecorder?.stop();
  mediaRecorder = null;
  ws.value?.close();
  ws.value = null;
  isRecording.value = false;
  socketStatus.value = "Disconnected";
}

onBeforeUnmount(() => {
  stopRecording();
});
</script>

<template>
  <div class="card z-depth-3 h-100">
    <div class="card-content">
      <span class="card-title">Real Time Transcription</span>

      <p class="grey-text text-darken-1">WebSocket state: {{ socketStatus }}</p>

      <div class="row">
        <div class="col s6">
          <button
            class="btn green waves-effect waves-light"
            @click="startRecording"
            :disabled="isRecording"
          >
            Start Recording
          </button>
        </div>
        <div class="col s6">
          <button
            class="btn red waves-effect waves-light"
            @click="stopRecording"
            :disabled="!isRecording"
          >
            Stop Recording
          </button>
        </div>
      </div>

      <div class="section">
        <h6 class="blue-text text-darken-2">Partial:</h6>
        <p class="grey-text text-darken-1">
          <i>{{ partial }}</i>
        </p>
      </div>

      <div class="section">
        <h6 class="blue-text text-darken-2">Final:</h6>
        <p class="black-text" style="white-space: pre-wrap">
          {{ transcript }}
        </p>
      </div>
    </div>
  </div>
</template>
