require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const authRoutes = require("./routes/auth");
const app = express();
const connection = require("./db");
const userRoutes = require("./routes/users");

connection();

app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["resume-builder"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,PUT,DELETE",
    credentials: true,
  })
);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
