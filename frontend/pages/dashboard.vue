<script setup lang="ts">
import { onMounted } from "vue";
import { useTranscriptionStore } from "@/store/useUserTranscriptions";
const { fetchTranscriptions } = useTranscriptionStore();

definePageMeta({
  title: "Dashboard",
  layout: "default",
  middleware: ["auth"],
});

onMounted(async () => {
  await fetchTranscriptions();
});

import ProjectUploadCard from "~/components/ProjectUploadCard.vue";
import ProjectListCard from "@/components/ProjectListCard.vue";
</script>

<template>
  <section class="section">
    <div class="row">
      <div class="col s12 m10 l6 xl4 offset-m1">
        <ProjectUploadCard />
      </div>

      <div class="col s12 m10 l6 xl4 offset-m1">
        <RealtimeTranscriptionCard />
      </div>

      <div class="col s12 m10 l6 xl4 offset-m1">
        <ProjectListCard />
      </div>
    </div>
  </section>
</template>
