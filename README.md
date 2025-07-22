# vocali-test

Technical test by Cesar Soares Stenico.

## Full Stack Project with Docker Compose

This project contains two main services:

- **Frontend**: Web application (Nuxt 3)
- **Backend**: API (Node.js) with Serverless and WebSocket server
- **Docker Compose**: Orchestration of the services in containers

---

## Folder Structure

```
.
├── backend/           # Backend code
│   └── Dockerfile
├── frontend/          # Frontend code
│   └── Dockerfile
├── docker-compose.yml # Container orchestration
└── README.md
```

---

## Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://nginx.org/en/download.html)
- A Speechmatics account with API key
- Configured AWS credentials

---

## How to Run the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/your-user/your-project.git
   cd your-project
   ```

2. Start the containers:

   ```bash
   docker-compose up --build
   ```

3. Start the Lambda functions locally (outside Docker):

   ```bash
   cd backend
   npm install
   npm run serverless-dev
   ```

4. Access the services:

   - **Frontend:** [http://localhost:3001](http://localhost:3001)
   - **Backend (lambda):** [http://localhost:3000](http://localhost:3000)
   - **Backend (websocket):** [http://localhost:8080](http://localhost:8080)

---

## Useful Commands

- Run in background:

  ```bash
  docker-compose up -d
  ```

- Stop containers:

  ```bash
  docker-compose down
  ```

- View logs:

  ```bash
  docker-compose logs -f
  ```

---

## Environment Variables

You can define variables in `.env` files inside the `backend/` and `frontend/` folders.

**Example of required variables in (`backend/.env.example`) and (`frontend/.env.example`):**

---

## Notes

- Make sure that ports **3001** (frontend), **3000** and **8080** (backend) are free.

---

## License

MIT
