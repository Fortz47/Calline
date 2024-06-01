import express from "express";
import path from "path";
// import cors from "cors";
import router from "./routes";

const app = express()
app.use(express.json());
// app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/', router);
app.listen(5002, () => {
  console.log('listening on port 5002');
})

export default app;