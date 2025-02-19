# To-Do List RESTful API

A RESTful API for managing to-do tasks built with Express.js, TypeScript, and TypeORM.

## Features

- CRUD operations for tasks
- Data validation
- Error handling
- In-memory SQLite database
- End-to-end testing

## Requirements

- Node.js (v14+ recommended)
- npm or yarn

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd todo-list-api
npm install
```

## Running the Application

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm run build
npm start
```

## API Endpoints

- **GET /api/tasks** - Get all tasks
- **GET /api/tasks/:id** - Get a specific task by ID
- **POST /api/tasks** - Create a new task
- **PUT /api/tasks/:id** - Update an existing task
- **DELETE /api/tasks/:id** - Delete a task

## Data Model

A task has the following structure:

```json
{
  "id": 1,
  "name": "Task name",
  "startDate": "2023-01-01",
  "endDate": "2023-01-10"
}
```

### Validation Rules

- Task name is required and must be 1-80 characters
- Start date is optional (format: YYYY-MM-DD)
- End date is optional but requires a start date if present
- End date must be after start date

## Testing

Run tests with:

```bash
npm test
```

## Project Structure

```
todolist-api/
├── src/
│   ├── entity/           # Database entities
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── validation/       # Input validation
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── test/                 # Test files
├── package.json
├── tsconfig.json
└── README.md
```
