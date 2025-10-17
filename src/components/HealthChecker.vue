<template>
  <v-chip flat :color="isHealthy && !isLoading ? 'green' : 'info'">
    <template v-if="isLoading || !isHealthy">
      <span class="mr-2"> Checking status </span>
      <v-progress-circular indeterminate size="16" />
    </template>
    <template v-else> Healthy </template>
  </v-chip>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { checkHealth } from "@/services/api";

const isHealthy = defineModel<boolean>({ default: false });
const isLoading = ref(false);

const interval = ref<number | null>(null);

onMounted(() => {
  startHealthCheckInterval();
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});

function startHealthCheckInterval() {
  interval.value = setInterval(async () => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;
    try {
      isHealthy.value = await checkHealth();
    } catch (error) {
      console.error("Health check failed:", error);
      isHealthy.value = false;
    } finally {
      isLoading.value = false;
    }
  }, 10 * 1000);
}
</script>
