require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user.route");
const vocabRoutes = require("./routes/vocab.route");
const categoryRoutes = require("./routes/category.route");
const savedRoutes = require('./routes/savedword.route');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/vocab", vocabRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', require('./routes/adminStats.route'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
