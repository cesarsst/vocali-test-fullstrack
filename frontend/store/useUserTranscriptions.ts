import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";
import {
  createTranscription,
  getTranscriptions,
  type Transcription,
} from "@/utils/api";

export const useTranscriptionStore = defineStore("transcription", {
  state: () => ({
    loading: false,
    error: null as string | null,
    success: false,
    transcriptions: [] as Transcription[], // Adjust type as needed
  }),

  actions: {
    async create(transcriptionName: string, fileKey: string) {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        const auth = useAuthStore();
        const token = auth.getToken;

        if (!token) throw new Error("User not authenticated.");

        const response = await createTranscription(token, {
          transcription_name: transcriptionName,
          file_key: fileKey,
        });

        if (!response.success) {
          throw new Error(response.error || "Error creating transcription.");
        }

        this.success = true;
      } catch (err: any) {
        console.error("Error creating transcription:", err);
        this.error = err.message || "Unknown error.";
        throw err;
      } finally {
        this.loading = false;
        this.fetchTranscriptions();
      }
    },
    async fetchTranscriptions() {
      try {
        const auth = useAuthStore();
        const token = auth.getToken;

        if (!token) throw new Error("User not authenticated.");

        const response = await getTranscriptions(token);
        if (!response.success) {
          throw new Error(response.error || "Error getting transcriptions.");
        }

        if (!response.data || !response.data.transcriptions) {
          this.transcriptions = [];
          return;
        }

        this.transcriptions = response.data.transcriptions;
        return response.data;
      } catch (err: any) {
        console.error("Error getting transcriptions:", err);
        throw err;
      }
    },
  },
});
