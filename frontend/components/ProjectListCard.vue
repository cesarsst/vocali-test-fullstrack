<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useTranscriptionStore } from "@/store/useUserTranscriptions";

const store = useTranscriptionStore();
const { transcriptions, loading } = storeToRefs(store);

const allTranscriptions = computed(() => {
  return transcriptions.value.map((transcription) => ({
    name: transcription.transcription_name,
    date: new Date(transcription.createdAt).toLocaleDateString(),
    text: transcription.text,
  }));
});

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() =>
  Math.ceil(allTranscriptions.value.length / itemsPerPage)
);

const paginatedTranscriptions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return allTranscriptions.value.slice(start, start + itemsPerPage);
});

const isDataReady = computed(() => {
  return !loading.value && transcriptions.value.length >= 0;
});

function downloadTxt(projectName: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="card z-depth-3">
    <div class="card-content">
      <span class="card-title"> Your Transcriptions </span>

      <!-- Loading State -->
      <div v-if="loading" class="center-align" style="padding: 40px">
        <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div>
            <div class="gap-patch">
              <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transcriptions List -->
      <ul v-else-if="isDataReady" class="collection">
        <li
          v-for="(transcription, index) in paginatedTranscriptions"
          :key="index"
          class="collection-item"
        >
          <div style="display: flex; flex-direction: column">
            <strong>{{ transcription.name }}</strong>
            <small>{{ transcription.date }}</small>

            <button
              class="btn blue"
              @click="downloadTxt(transcription.name, transcription.text || '')"
              style="margin-top: 5px"
            >
              Download .txt
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Pagination (only show when data is ready and there are transcriptions) -->
    <div
      v-if="isDataReady && allTranscriptions.length > 0"
      class="card-action center-align"
    >
      <button
        class="btn-flat"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <Icon name="mdi:chevron-left" />
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        class="btn-flat"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <Icon name="mdi:chevron-right" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.preloader-wrapper.active {
  width: 50px;
  height: 50px;
}

.spinner-layer {
  border-color: #2196f3;
}

.collection-item {
  transition: all 0.3s ease;
}

.collection-item:hover {
  background-color: #f5f5f5;
}

.btn-flat:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
