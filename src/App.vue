<template>
  <v-app>
    <v-main class="pa-4 position-relative">
      <div class="d-flex flex-column mb-4">
        <span class="text-h4">Anomaly Detection Dashboard</span>
        <span class="text-subtitle-1">
          Monitor transactions and detect anomalies in real-time using our
          advanced anomaly detection system.
        </span>
      </div>

      <HealthChecker
        v-model="isHealthy"
        style="position: absolute; top: 16px; right: 16px"
      />

      <v-alert
        v-if="!isHealthy"
        density="compact"
        title="Server is asleep, please wait..."
        type="info"
      >
        <template #text>
          Please wait till server wakes up.
          <v-btn
            variant="text"
            href="https://anomaly-detection-server-0-0-1.onrender.com/"
            target="_blank"
          >
            Still not loaded? Check server status here
          </v-btn>
        </template>
      </v-alert>

      <TransactionTable v-else />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isHealthy = ref(false);
</script>
