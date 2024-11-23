# XSplitter - Expense Sharing and Management Application

Welcome to **XSplitter**, the ultimate solution for effortlessly managing shared expenses with friends, family, and roommates! Built with the powerful **Next.js** framework, XSplitter provides a seamless experience for tracking costs, settling debts, and collaborating on group expenses.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Expense Tracking**: Instantly see updates as expenses are added, ensuring everyone is on the same page.
- **Multi-Currency Support**: Effortlessly manage expenses in various currencies with automatic conversion rates.
- **Smart Settlement Suggestions**: Get intelligent recommendations for settling debts with minimal transactions.
- **Group Management**: Create and manage multiple groups for different occasions, making it easy to keep track of expenses.
- **Expense Analytics**: Visualize your spending patterns with interactive charts and graphs.
- **Category Tracking**: Organize expenses by categories, providing clarity and insight into your spending habits.
- **Easy Sharing**: Share group links instantly with friends, allowing them to join the expense group with ease.
- **Split Options**: Choose to split bills equally or with custom ratios tailored to your group's needs.
- **Auto Sync**: All expenses and settlements automatically sync across devices, ensuring everyone has the latest information.
- **Secure Transactions**: Your financial data is encrypted and securely stored, giving you peace of mind.
- **Mobile Friendly**: Access your expenses on any device with our responsive design.
- **Quick Actions**: Add expenses and settle bills with just a few clicks, making the process smooth and efficient.

## Video Ad


https://github.com/user-attachments/assets/c9a43ea1-8282-46cc-8a68-333817c00f32


## Getting Started

To embark on your journey with XSplitter, follow these simple steps to set up the project locally.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/XSplitter-H03.git
   cd XSplitter-H03
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
XSplitter-H03
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

## Technologies Used

- **Next.js**: A powerful React framework for building server-side rendered applications.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid UI development.
- **MongoDB**: A NoSQL database for storing application data, providing flexibility and scalability.
- **React**: A JavaScript library for building user interfaces, enabling a dynamic user experience.
- **Lucide Icons**: A collection of icons used throughout the application for a polished look.

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
