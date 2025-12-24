# Startease Web

Startease Web is the frontend application for the Startease platform, a comprehensive solution designed to simplify business formation and management. Built with Next.js 14, it provides a modern, responsive, and user-friendly interface for entrepreneurs and administrators.

## 🚀 Key Features

-   **Business Formation Wizard**: Step-by-step guide to register new businesses.
-   **User Dashboard**: Manage multiple businesses, view status, and access documents.
-   **Admin Panel**: Comprehensive tools for administrators to manage businesses, products, and documents.
-   **Authentication**: Secure login via Google OAuth and Email/OTP.
-   **Responsive Design**: Optimized for both desktop and mobile devices.
-   **Theme Support**: Light and Dark mode support.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: React Context API
-   **Icons**: Heroicons
-   **Deployment**: Vercel / AWS App Runner (Backend)

## 📂 Project Structure

```
startease-web/
├── app/                    # Next.js App Router directory
│   ├── (auth)/             # Authentication routes (login, etc.)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── admin/          # Admin-specific pages
│   │   ├── businesses/     # User business management
│   │   └── superadmin/     # Superadmin configuration
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React Context providers (Auth, Theme, Toast)
│   ├── globals.css         # Global styles and Tailwind directives
│   └── layout.tsx          # Root layout
├── public/                 # Static assets (images, icons)
├── types/                  # TypeScript type definitions
└── ...config files         # Configuration (Tailwind, Next.js, etc.)
```

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-org/startease-web.git
    cd startease-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:9000/api  # Or your backend URL
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
