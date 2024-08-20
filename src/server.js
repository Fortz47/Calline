import dotenv from 'dotenv';
import express from "express";
import path from "path";
import router from "./routes";

// Load environment variables from the .env file
dotenv.config();

const app = express()
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/', router);
app.listen(10000, () => {
  console.log('listening on port 10000');
})

export default app;