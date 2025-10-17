# Anomaly detection client

A simple transaction passbook interface, having filtering by user, amount range and date range.
Also has an event source to get the latest transactions for a user.

## Deployment link

https://anomaly-detection-client.vercel.app/

### Server

https://github.com/kurayami07734/anomaly-detection-server

### Video demo

https://github.com/user-attachments/assets/29ef45f3-56a6-4c97-b62c-05c7e7396633

## Component architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                          App.vue (Root)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Main layout container (v-app, v-main)                  │  │
│  │  • Page title & description                               │  │
│  │  • Health status state management (isHealthy)             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────┐          ┌──────────────────────────┐ │
│  │   HealthChecker      │          │   TransactionTable       │ │
│  │   (Top-right)        │          │   (Main content)         │ │
│  └──────────────────────┘          └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────────────────┐
                              ▼                         ▼
                    ┌──────────────────┐    ┌─────────────────────┐
                    │  HealthChecker   │    │  TransactionTable   │
                    └──────────────────┘    └─────────────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                    ┌──────────────────┐    ┌─────────────────────┐
                    │  • v-chip UI     │    │  Filter Controls    │
                    │  • Timer (10s)   │    │  ┌───────────────┐  │
                    │  • Loading state │    │  │ v-select      │  │
                    └──────────────────┘    │  │ (User ID)     │  │
                              │              │  ├───────────────┤  │
                              │              │  │ v-text-field  │  │
                              │              │  │ (Min/Max Amt) │  │
                              │              │  ├───────────────┤  │
                              │              │  │ v-date-input  │  │
                              │              │  │ (From/To)     │  │
                              │              │  ├───────────────┤  │
                              │              │  │ v-text-field  │  │
                              │              │  │ (Limit)       │  │
                              │              │  ├───────────────┤  │
                              │              │  │ v-btn (Load)  │  │
                              │              │  └───────────────┘  │
                              │              │                     │
                              │              │  Data Display       │
                              │              │  ┌───────────────┐  │
                              │              │  │ v-data-table- │  │
                              │              │  │ virtual       │  │
                              │              │  │ (600px height)│  │
                              │              │  └───────────────┘  │
                              │              │                     │
                              │              │  Features:          │
                              │              │  • Infinite scroll  │
                              │              │  • Cursor pagination│
                              │              │  • Anomaly alerts   │
                              │              │  • Real-time SSE    │
                              │              └─────────────────────┘
```

### Design patterns used

1. Observer Pattern:

   - IntersectionObserver for infinite scroll
   - EventSource (SSE) for real-time updates

2. Polling Pattern:

   - Health check every 10 seconds

3. Cursor-based Pagination:

   - Server returns cursor for next batch
   - Client stores and sends cursor for subsequent requests

4. Conditional Rendering:

   - Show warning if service is down
   - Show table only when healthy

5. Form Validation:
   - Computed property validates all filters
   - Disables load button until valid
