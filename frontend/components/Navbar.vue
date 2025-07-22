<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/useAuthStore";

const authStore = useAuthStore();
const { logout } = authStore;
const { isAuthenticated } = storeToRefs(authStore);
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar blue darken-3">
    <div class="nav-wrapper container">
      <NuxtLink to="/" class="brand-logo">
        <Icon name="mdi-mic" class="left" />
        Transcripto
      </NuxtLink>

      <a href="#" data-target="mobile-nav" class="sidenav-trigger right">
        <Icon name="mdi-menu" />
      </a>

      <ul class="right hide-on-med-and-down">
        <li><NuxtLink to="/">About</NuxtLink></li>
        <li v-if="isAuthenticated">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </li>
        <li v-if="!isAuthenticated"><NuxtLink to="/login">Login</NuxtLink></li>
        <li v-if="isAuthenticated">
          <a href="#" @click.prevent="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Mobile Nav -->
  <ul class="sidenav" id="mobile-nav">
    <li><NuxtLink to="/about">About</NuxtLink></li>
    <li v-if="isAuthenticated">
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    </li>
    <li v-if="!isAuthenticated"><NuxtLink to="/login">Login</NuxtLink></li>
    <li v-if="isAuthenticated">
      <a href="#" @click.prevent="logout">Logout</a>
    </li>
  </ul>
</template>
