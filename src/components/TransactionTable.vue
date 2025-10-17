<template>
  <div>
    <p class="text-h6">Filters</p>

    <div class="d-flex justify-space-between mt-4">
      <v-select
        v-model="selectedUser"
        label="User ID"
        :items="users"
        density="compact"
      />

      <v-text-field
        v-model="minAmount"
        type="number"
        label="Min Amount"
        density="compact"
        style="max-width: 150px"
        class="ml-5"
      />

      <v-text-field
        v-model="maxAmount"
        type="number"
        label="Max Amount"
        density="compact"
        style="max-width: 150px"
        class="ml-5"
      />
    </div>

    <div class="d-flex justify-space-between mt-2">
      <v-date-input v-model="fromDate" label="From" density="compact" />
      <v-date-input
        v-model="toDate"
        label="To"
        class="ml-5"
        density="compact"
      />
      <v-text-field
        v-model="limit"
        type="number"
        label="Limit"
        density="compact"
        style="max-width: 150px"
        class="ml-5"
      />
      <v-btn
        @click="loadTransactions"
        color="primary"
        :loading="isLoading"
        :disabled="!isFormValid"
        class="ml-5"
      >
        Load Transactions
        <v-icon right>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <v-data-table-virtual
      ref="dataTable"
      :headers="headers"
      :items="transactions"
      :loading="isLoading"
      height="600"
    >
      <template #bottom>
        <div v-if="allFetched" class="text-center text-h6">
          No more transactions!
        </div>

        <div ref="sentinel" style="height: 1px"></div>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import { getTransactions, getUsers, type Transaction } from "@/services/api";

const minAmount = ref(1000);
const maxAmount = ref(100_000);
const limit = ref(20);
const isLoading = ref(false);
const users = ref<string[]>([]);
const transactions = ref<Transaction[]>([]);
const selectedUser = ref<string | undefined>(undefined);
const fromDate = ref<Date | undefined>(undefined);
const toDate = ref<Date | undefined>(undefined);
const cursor = ref<string | undefined>(undefined);
const sentinel = ref<HTMLElement>();
const allFetched = ref(false);

let observer: IntersectionObserver | null = null;

const headers = [
  { title: "ID", key: "id" },
  { title: "User ID", key: "user_id" },
  { title: "Amount", key: "amount" },
  { title: "Currency", key: "currency" },
  { title: "Date", key: "txn_date" },
  { title: "Status", key: "status" },
];

const isFormValid = computed(() => {
  const conditions = [
    selectedUser.value !== undefined,
    minAmount.value != undefined || minAmount.value >= 0,
    maxAmount.value != undefined || maxAmount.value >= 0,
    limit.value != undefined || limit.value > 0,
    fromDate.value != undefined &&
      toDate.value != undefined &&
      fromDate.value <= toDate.value,
  ];

  return conditions.every((condition) => condition);
});

onMounted(async () => {
  users.value = (await getUsers()) ?? [];

  if (sentinel.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          isFormValid.value &&
          !allFetched.value
        ) {
          loadTransactions();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel.value);
  }
});

async function loadTransactions() {
  try {
    isLoading.value = true;

    const filters = {
      user_id: selectedUser.value!,
      min_amount: minAmount.value,
      max_amount: maxAmount.value,
      from_date: fromDate.value,
      to_date: toDate.value,
      limit: limit.value,
      cursor: cursor.value,
    };

    const response = await getTransactions(filters);

    if (response) {
      transactions.value.push(...response.transactions);
      cursor.value = response.cursor;

      if (!response.transactions.length) {
        allFetched.value = true;
      }
    }
  } catch (error) {
    console.error("Failed to load transactions:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
