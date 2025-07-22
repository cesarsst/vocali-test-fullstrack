<script setup lang="ts">
const { useAuthStore } = await import("@/store/useAuthStore");
const { checkSession } = useAuthStore();

onMounted(() => {
  checkSession();
});
</script>

<template>
  <div class="layout-grid">
    <!-- Navbar -->
    <Navbar />

    <!-- Scrollable content area -->
    <main class="content-scrollable">
      <div class="container" style="padding-top: 20px">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer blue darken-3">
      <div class="container center-align white-text">
        © {{ new Date().getFullYear() }} This is a project by Cesar Soares
        Stenico
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  overflow: hidden;
}

/* Navbar fixa no topo */
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Conteúdo que scrolla */
.content-scrollable {
  overflow-y: auto;
  padding: 1rem 0;
}

/* Footer sempre fixo no fim */
.footer {
  position: sticky;
  bottom: 0;
}
</style>
