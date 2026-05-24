Server stub for development (Express + lowdb)

Install dependencies from the `server` folder and start:

```bash
cd server
npm install
npm start
```

API endpoints:
- GET /health
- GET /conversations?userId=...
- GET /conversations/:id/messages
- POST /conversations
- POST /messages/send
- GET /users

The server stores data in `server/db.json`.
