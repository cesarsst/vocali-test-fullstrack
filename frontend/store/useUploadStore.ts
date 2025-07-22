import { defineStore } from "pinia";
import { useAuthStore } from "./useAuthStore";
import { useTranscriptionStore } from "./useUserTranscriptions";
import { getPresignedUrl, uploadToS3 } from "@/utils/api";

export const useUploadStore = defineStore("upload", {
  state: () => ({
    loading: false,
    error: null as string | null,
    success: false,
  }),

  actions: {
    async uploadFiles(projectName: string, files: FileList) {
      this.loading = true;
      this.error = null;
      this.success = false;

      try {
        const auth = useAuthStore();
        const transcriptionStore = useTranscriptionStore();
        const token = auth.getToken;

        if (!token) throw new Error("User not authenticated.");

        for (const file of Array.from(files)) {
          // 1. Get presigned URL from the API
          const data = await getPresignedUrl(token, {
            fileName: file.name,
            fileType: file.type,
          });

          if (!data.success || !data.data) {
            throw new Error(data.error || "Error obtaining upload URL.");
          }

          // 2. Upload to S3
          await uploadToS3(data.data.uploadUrl, file);

          // 3. Create transcription file in DynamoDB
          await transcriptionStore.create(projectName, data.data.fileKey);
        }

        this.success = true;
      } catch (err: any) {
        console.error("Error uploading files:", err);
        this.error = err.message || "Unknown error.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
