<script setup lang="ts">
import { ref } from "vue";
import { useUploadStore } from "@/store/useUploadStore";
const transcriptionName = defineModel<string>("projectName");
const selectedFiles = defineModel<FileList | null>("selectedFiles");

const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const handleUpload = async () => {
  const uploadStore = useUploadStore();

  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  if (!transcriptionName.value || !selectedFiles.value?.length) {
    errorMessage.value =
      "Please fill in the project name and select audio files.";
    loading.value = false;
    return;
  }

  try {
    await uploadStore.uploadFiles(transcriptionName.value, selectedFiles.value);
    successMessage.value = "Project uploaded successfully!";
    setTimeout(() => {
      resetForm();
    }, 3000);
  } catch (error: any) {
    console.error("Error uploading project:", error);
    errorMessage.value = "Error uploading the project.";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  transcriptionName.value = "";
  selectedFiles.value = null;
  errorMessage.value = "";
  successMessage.value = "";
};
</script>

<template>
  <div class="card z-depth-3 h-100">
    <div class="card-content">
      <span class="card-title black-text"> New Transcription</span>
      <div class="input-field">
        <input
          id="project-name"
          type="text"
          v-model="transcriptionName"
          required
        />
        <label for="project-name" :class="{ active: transcriptionName }">
          Transcription Name
        </label>
      </div>

      <div class="file-field input-field">
        <div class="btn blue">
          <span>Select Audio</span>
          <input
            type="file"
            accept="audio/*"
            multiple
            @change="(e) => (selectedFiles = (e.target as HTMLInputElement).files)"
          />
        </div>
        <div class="file-path-wrapper">
          <input
            class="file-path validate"
            type="text"
            placeholder="Select audio files"
          />
        </div>
      </div>

      <div class="section center-align">
        <p v-if="errorMessage" class="red-text text-darken-2">
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="green-text text-darken-2">
          {{ successMessage }}
        </p>
      </div>
    </div>

    <div class="card-action center-align">
      <button
        class="btn-large green waves-effect waves-light"
        :disabled="loading"
        @click="handleUpload"
      >
        {{ loading ? "Uploading transcription..." : "Transcribe" }}
      </button>
    </div>
  </div>
</template>
