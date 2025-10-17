<template>
  <v-app>
    <v-main class="pa-4 fill-height d-flex position-relative">
      <HealthChecker
        v-model="isHealthy"
        style="position: absolute; top: 16px; right: 16px"
      />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isHealthy = ref(false);
</script>
