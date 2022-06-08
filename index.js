require("dotenv").config();
const express = require("express");
const app = express();
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const path = require("path");

// built-in middleware for json
app.use(express.json());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// custom middleware logger
app.use(logger);

//middleware for cookies
app.use(cookieParser());

const db = require("./models");

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//serve static files

//Routes

app.use("/api/register", require("./routes/register"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/logout", require("./routes/logout"));
app.use("/api/refresh", require("./routes/refresh"));
app.use("/api/changepassword", require("./routes/changePassword"));

app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/comments", require("./routes/api/comments"));
app.use("/api/likes", require("./routes/api/likes"));
app.use("/api/users", require("./routes/api/users"));

app.use(errorHandler);

//Server start

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

db.sequelize.sync().then(() => {
    //sync({ alter: true })
    //TODO:remove {alter:true} in production version
    //use Migrations instead https://sequelize.org/docs/v6/other-topics/migrations/
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
