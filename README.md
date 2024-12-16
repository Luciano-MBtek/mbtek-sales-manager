# Sales Pipeline App

## Overview

**Sales Pipeline App** is a streamlined tool designed to manage and optimize the sales process for **[MBTEK](https://mbtek.com)**. The application integrates seamlessly with HubSpot and leverages AI to generate quotes, helping sales agents and managers improve efficiency and close deals faster.

---

## Features

- **HubSpot Integration**: Automatically syncs customer data, deals, and pipeline stages.
- **AI-Generated Quotes**: Generate professional and accurate quotes using OpenAI technology.
- **Sales Flow Management**: Track, update, and manage sales pipelines with ease.
- **Interactive UI**: Built with modern design principles using Radix UI and TailwindCSS.
- **Performance Insights**: Visualize and analyze data with Recharts.
- **Team Collaboration**: Utilize tools like Radix UI components and Zustand for state management.

---

## Technologies Used

### Core Stack

- **Next.js 15**: Server-rendered React framework.
- **React 18**: Library for building user interfaces.
- **Prisma 5**: ORM for seamless database interactions.
- **TypeScript 5**: Static type checking for better code reliability.

### Styling and UI

- **TailwindCSS 3**: Utility-first CSS framework.
- **Radix UI**: Accessible, high-quality UI components.

### State and Data Management

- **React Query**: Server state management.
- **Zustand**: Simple and flexible state management for the client side.

### AI and Integrations

- **OpenAI API**: Powers the AI-driven quote generation.
- **HubSpot API**: Ensures seamless CRM integration.

### Utilities

- **Framer Motion**: Animation library for dynamic user interfaces.
- **React Hook Form**: Simplifies form handling.
- **Date-fns**: Utility library for date manipulation.

---

## Installation and Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/sales-pipeline-app.git
   cd sales-pipeline-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Configure the `.env` file with your database credentials and HubSpot API keys.
   - Run Prisma migrations to initialize the database:
     ```bash
     npx prisma migrate dev
     ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Access the app in your browser at `http://localhost:3000`.

---

## Scripts

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Starts the development server.         |
| `npm run build`       | Builds the application for production. |
| `npm run start`       | Starts the production server.          |
| `npm run lint`        | Runs ESLint for code quality checks.   |
| `npm run postinstall` | Generates Prisma client after install. |

---

## Environment Variables

Make sure to add the following environment variables to your `.env` file:

```env
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
HUBSPOT_API_KEY=your_hubspot_api_key
OPENAI_API_KEY=your_openai_api_key
```

---

## Key Dependencies

### Dependencies

- `@prisma/client`
- `next`
- `react`
- `tailwindcss`
- `openai`
- `next-auth`
- `react-query`
- `recharts`

### Dev Dependencies

- `prisma`
- `typescript`
- `eslint`
- `postcss`
- `prettier`

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For any questions or support, reach out at [support@mbtek.com](mailto:support@mbtek.com).
