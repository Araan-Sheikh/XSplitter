# XSplitter - Expense Sharing and Management Application

Welcome to **XSplitter**, the ultimate solution for effortlessly managing shared expenses with friends, family, and roommates! Built with the powerful **Next.js** framework, XSplitter provides a seamless experience for tracking costs, settling debts, and collaborating on group expenses.

## Table of Contents

- [Features](#features)
- [Video Ad](#video-ad)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

### Why XSplitter?

- **Simplify Group Finances**: No more complicated spreadsheets or confusion about who owes what
- **Real-time Updates**: Keep everyone in the loop with instant expense notifications
- **Smart Calculations**: Automatic currency conversion and split calculations
- **Transparent History**: Complete expense history with detailed analytics
- **User-Friendly Interface**: Clean, modern design that's easy to navigate

## Features

### Core Features
- **Real-time Expense Tracking**: Track expenses as they happen with instant updates
- **Multi-currency Support**: Handle expenses in different currencies with automatic conversion
- **Smart Settlement**: Get intelligent suggestions for settling debts with minimum transactions
- **Group Management**: Create and manage multiple expense groups
- **Expense Analytics**: Visualize spending patterns with interactive charts
- **Category Tracking**: Organize expenses by categories with detailed pie charts

### Additional Features
- **Easy Sharing**: Share group links instantly with friends
- **Split Options**: Split bills equally or with custom ratios
- **Auto Sync**: All expenses and settlements sync across devices
- **Secure Transactions**: Encrypted financial data storage
- **Mobile Friendly**: Responsive design for all devices
- **Quick Actions**: Add expenses and settle bills efficiently


## Video Ad


https://github.com/user-attachments/assets/c9a43ea1-8282-46cc-8a68-333817c00f32


## Getting Started

To embark on your journey with XSplitter, follow these simple steps to set up the project locally.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Araan-Sheikh/XSplitter.git
   cd XSplitter
   ```

2. **Install dependencies**:
   You can use npm, yarn, or pnpm to install the required packages.
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   ```

### Usage

1. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Start using the application**:
   Create groups, add members, and start tracking expenses effortlessly!

## Project Structure

The project is organized in a way that promotes clarity and ease of navigation. Here’s a breakdown of the structure:

```
XSplitter
├── app
│   ├── about
│   ├── create-group
│   ├── features
│   ├── groups
│   └── page.tsx
├── components
│   ├── ui
│   ├── expense-form.tsx
│   ├── expense-list.tsx
│   └── user-management.tsx
├── models
│   └── Group.ts
├── lib
│   └── mongodb.ts
├── pages
│   └── api
│       └── groups
├── public
│   └── team
├── styles
│   └── globals.css
├── .env.local
├── package.json
└── README.md
```

### File Descriptions

- **app/**: The heart of the application, containing the main pages and routing.
  - **about/**: This section provides insights into the project, detailing its purpose and features.
  - **create-group/**: A dedicated page for users to create new expense groups effortlessly.
  - **features/**: Showcases the powerful features of XSplitter, highlighting its capabilities.
  - **groups/**: Dynamic routes for managing specific groups, allowing users to dive into their expense details.
  - **page.tsx**: The main entry point for the application, rendering the home page.

- **components/**: A treasure trove of reusable UI components and functionalities.
  - **ui/**: Contains essential UI components like buttons, cards, and other reusable elements.
  - **expense-form.tsx**: A user-friendly form for adding new expenses to a group, making it easy to track costs.
  - **expense-list.tsx**: Displays a comprehensive list of expenses for a specific group, complete with details and options to delete expenses.
  - **user-management.tsx**: Manages group members, allowing for easy addition and removal of users.

- **models/**: Defines the data structure for the application.
  - **Group.ts**: Contains the Mongoose schema for the Group model, detailing members and expenses.

- **lib/**: Houses utility functions and database connection logic.
  - **mongodb.ts**: Manages the connection to the MongoDB database, ensuring smooth data operations.

- **pages/**: Contains API routes for server-side functionality.
  - **api/**: Hosts API endpoints for managing groups and expenses, facilitating data interactions.

- **public/**: A repository for static assets like images and icons, enhancing the visual appeal of the application.

- **styles/**: The styling backbone of the application.
  - **globals.css**: The main stylesheet, incorporating Tailwind CSS for a modern design.

- **.env.local**: A secure file for environment variables used in local development.

- **package.json**: The project’s metadata, listing dependencies and scripts for building and running the application.

- **README.md**: Your go-to documentation for understanding the project, setup instructions, and features.


## Tech Stack

- **Frontend Framework**: Next.js 14
  - App Router for improved routing and layouts
  - Server Components for optimal performance
  - API Routes for backend functionality
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom theme configuration
  - Responsive design principles
- **UI Components**: 
  - shadcn/ui for consistent design
  - Custom components for specific features
  - Radix UI primitives for accessibility
- **Database**: 
  - MongoDB with Mongoose
  - Optimized schemas for expense tracking
  - Efficient querying for analytics
- **Authentication**: [Planned]
  - OAuth integration
  - JWT token management
  - Role-based access control
- **Charts**: 
  - Chart.js for interactive visualizations
  - Recharts for responsive charts
  - Custom chart components
- **Icons**: Lucide React

## Contributing

We welcome contributions to XSplitter! If you’re interested in making this project even better, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request and let us know what you’ve done!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring XSplitter! We hope you enjoy using it as much as we enjoyed building it. Happy splitting!
