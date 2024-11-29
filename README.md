# XSplitter - Expense Sharing and Management Application

Welcome to **XSplitter**, the ultimate solution for effortlessly managing shared expenses with friends, family, and roommates! Built with the powerful **Next.js** framework, XSplitter provides a seamless experience for tracking costs, settling debts, and collaborating on group expenses.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
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
- **Group Management**: Create and manage groups for tracking shared expenses
- **Expense Tracking**: Add, edit, and delete expenses within groups
- **Member Management**: Add and manage group members with their preferred currencies
- **Real-Time Analytics**: View analytics on expenses and member contributions
- **Admin Dashboard**: Secure admin routes for managing analytics and logs
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Secure Authentication**: Protect admin routes with secure authentication mechanisms
- **Currency Support**: Handle multiple currencies with real-time exchange rates
- 
### Additional Features
- **Real-time Updates**: Data syncs every 3 seconds
- **Custom Splitting**: Support for equal, percentage, and custom splits
- **Expense Categories**: Organize expenses by type
- **Export Functionality**: Download expense reports
- **Search & Filter**: Find specific expenses easily
- **Activity Logging**: Track all system activities
- **Data Visualization**: Charts and graphs for expense analysis
- **Mobile Friendly**: Responsive design for all devices
- **Quick Actions**: Add expenses and settle bills efficiently

- ## Demo

### Live Demo Steps
1. **Group Creation**
   - Create new group "Demo Trip"
   - Add initial members

2. **Expense Management**
   - Add new expense
   - Show splitting calculation
   - Demonstrate real-time updates

3. **Admin Features**
   - View analytics dashboard
   - Check activity logs
   - Monitor system status

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
      ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

 4. **Database Configuration**:
   - Create MongoDB Atlas cluster
   - Whitelist IP address
   - Create database user
   - Get connection string

### Usage

1. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   
   # Build production
   npm run build

   # Start production server
   npm run start
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Start using the application**:
   Create groups, add members, and start tracking expenses effortlessly!

4. **Using admin panel**:
   Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to view the admin panel.

## Project Structure

The project is organized in a way that promotes clarity and ease of navigation. Here’s a breakdown of the structure:

```bash
xsplitter/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ... (more files)
│   ├── api/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── check-auth/
│   │   │   ├── extract-logs/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── ... (more API routes)
│   │   ├── groups/
│   │   │   ├── [groupId]/
│   │   │   │   ├── expenses/
│   │   │   │   ├── members/
│   │   │   │   └── ... (group API routes)
│   │   └── ... ( API routes)
│   ├── about/
│   ├── features/
│   ├── 404.tsx
│   └── ... (pages)
├── components/
│   ├── create-group/
│   ├── manage-members.tsx
│   ├── navbar.tsx
│   ├── ui/
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   └── ... (more UI components)
│   └── ... ( components)
├── lib/
│   ├── extractLogs.ts
│   ├── logger.ts
│   ├── mongodb.ts
│   └── utils.ts
├── models/
│   └── Group.ts
├── scripts/
│   ├── check-ip.ts
│   ├── test-connection.ts
│   └── test-direct.ts
├── types/
│   ├── currency.ts
│   ├── expense.ts
│   └── global.d.ts
├── public/
│   └── ... (static assets)
├── styles/
│   └── ... (global styles)
├── .eslintrc.json
├── .gitignore
├── components.json
├── next.config.js
├── next.config.mjs
├── next-env.d.ts
├── postcss.config.mjs
├── .env
├── middleware.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── package-lock.json
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
