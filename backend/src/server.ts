import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/Database";
import { startReminderJob } from "./service/ReminderJob";

const PORT = process.env.PORT || 5000;

connectDB();
startReminderJob();

app.listen(PORT, () => console.log(`server is live at http://localhost:${PORT}`));