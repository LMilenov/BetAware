# BetAware

**BetAware** is a web application for tracking gambling activity and understanding its financial impact. It helps users record wins and losses, review their activity over time, identify categories associated with losses, and explore illustrative alternatives for saving and investing.

> BetAware is an awareness and tracking tool. It does not provide betting recommendations or financial advice. Investment projections are illustrative and are not guaranteed.

## Features

- **Account authentication** — user registration and login with token-based authentication.
- **Transaction management** — create, view, edit, and delete recorded wins and losses.
- **Transaction categories** — Sports Betting, Casino, Slots, Poker, and Other.
- **Filtering and sorting** — filter transactions by category and sort by date or amount.
- **Financial dashboard** — review total winnings, total losses, net result, and win rate for a selected period.
- **Period selection** — view monthly performance and dashboard statistics for the last 3, 6, or 12 months.
- **Monthly performance chart** — visualize positive and negative monthly results.
- **Losses by category** — see how recorded losses are distributed across categories for the selected period.
- **Alternatives** — compare recorded losses with illustrative everyday purchases and experiences.
- **Investment scenarios** — explore hypothetical investment projections based on configurable scenarios.
- **Euro currency support** — monetary values are represented in EUR.
- **Responsive dark interface** — shared navigation and layouts for the main application pages.

## Tech Stack

### Frontend

- Angular
- TypeScript
- HTML and CSS
- RxJS

### Backend

- ASP.NET Core Web API
- C# / .NET 10
- Entity Framework Core
- ASP.NET Core Identity
- JWT authentication

### Database

- PostgreSQL

## Project Structure

The repository is organized into a frontend client and a backend API:

```text
BetAware/
├── client/          # Angular application
└── backend/
    └── API/         # ASP.NET Core Web API
```

## Prerequisites

Install the following before running the application:

- .NET 10 SDK
- Node.js and npm
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <https://github.com/LMilenov/BetAware>
cd BetAware
```

### 2. Configure the backend

Create or update the API's local development configuration with your PostgreSQL connection string and the JWT settings required by the application.

Keep passwords, signing keys, and other secrets in local configuration or .NET User Secrets. Do not commit credentials to the repository.

Create the PostgreSQL database configured for the API. From the backend API project directory, restore the packages and apply the Entity Framework Core migrations:

```bash
cd backend/API
dotnet restore
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

The development API is configured to run at:

```text
http://localhost:5194
```

### 3. Run the Angular frontend

Open a second terminal from the repository root and run:

```bash
cd client
npm install
npx ng serve
```

Open the application at:

```text
http://localhost:4200
```

Make sure the backend is running and its database and authentication settings are configured before using the frontend.

## API Overview

The backend exposes authenticated endpoints for account management, transactions, and dashboard statistics.

| Area | Method | Endpoint | Purpose |
|---|---|---|---|
| Account | POST | `/api/Account/register` | Register a user |
| Account | POST | `/api/Account/login` | Log in |
| Transactions | GET | `/api/Transactions` | Retrieve the current user's transactions |
| Transactions | POST | `/api/Transactions` | Create a transaction |
| Transactions | PUT | `/api/Transactions/{id}` | Update a transaction |
| Transactions | DELETE | `/api/Transactions/{id}` | Delete a transaction |
| Dashboard | GET | `/api/Dashboard` | Retrieve financial summary data; supports date and other filters |
| Dashboard | GET | `/api/Dashboard/monthly?year={year}` | Retrieve monthly statistics for a year |
| Dashboard | GET | `/api/Dashboard/categories` | Retrieve loss and transaction statistics by category; supports date filters |

Authenticated endpoints require a valid access token.

## Notes on Financial Estimates

- Transaction amounts are user-recorded values displayed in EUR.
- Alternative purchase prices are illustrative comparisons, not spending recommendations.
- Investment scenarios use configurable assumptions such as duration and annual return rate.
- Actual investment returns can be lower than projected, including negative. No return is guaranteed.

## Project Status

BetAware is a portfolio project under active development. Features and implementation details may change as the application evolves.
