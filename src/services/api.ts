const BASE_URL = "https://anomaly-detection-server-0-0-1.onrender.com";

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    return data["health"] === "ok";
  } catch (error) {
    console.error("Error checking health: ", error);
    return false;
  }
}

export interface Transaction {
  id: string; // UUID as string
  user_id: string; // UUID as string
  amount: number;
  currency: string; // max 3 characters
  txn_date: Date;
  status: string; // max 32 characters
  meta_data?: Record<string, any>;
}

interface TransactionFilters {
  user_id: string; // UUID as string
  from_date?: Date; // defaults to 30 days ago
  to_date?: Date; // defaults to now
  min_amount?: number; // defaults to 0.00
  max_amount?: number; // defaults to 10000000000.00
  limit?: number; // defaults to 100
  cursor?: string;
}

interface ListTransactionsResponse {
  transactions: Transaction[];
  cursor: string;
}

export async function getTransactions(
  filters: TransactionFilters
): Promise<ListTransactionsResponse | undefined> {
  try {
    const params = createFilterParams(filters);
    const url = `${BASE_URL}/transactions?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching transactions: ", err);
  }
}

function createFilterParams(filters: TransactionFilters): URLSearchParams {
  const params = new URLSearchParams();

  params.append("user_id", filters.user_id);

  if (filters.from_date) {
    params.append("from_date", filters.from_date.toISOString());
  }

  if (filters.to_date) {
    params.append("to_date", filters.to_date.toISOString());
  }

  if (filters.min_amount !== undefined) {
    params.append("min_amount", filters.min_amount.toString());
  }

  if (filters.max_amount !== undefined) {
    params.append("max_amount", filters.max_amount.toString());
  }

  if (filters.limit !== undefined) {
    params.append("limit", filters.limit.toString());
  }

  if (filters.cursor) {
    params.append("cursor", filters.cursor);
  }
  return params;
}

export async function getUsers(): Promise<string[] | undefined> {
  try {
    const url = `${BASE_URL}/users`;
    const response = await fetch(url);
    const data = await response.json();
    return data["users"];
  } catch (err) {
    console.error("Error fetching users: ", err);
  }
}
