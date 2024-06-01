import express from "express";
import path from "path";
import router from "./routes";

const app = express()
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/', router);
app.listen(5002, () => {
  console.log('listening on port 5002');
})

export default app;