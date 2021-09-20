import express, { Request, Response } from "express";
import cors from "cors";
//import { readdirSync } from "fs";
import mongoose from "mongoose";
import morgan from "morgan";

import { FluentClient } from "@fluent-org/logger";

//routes
import router from "./routes";
require("dotenv").config(); //This is scoped as well, use package.json

//cookie is not parsed by default
import cookieParser from "cookie-parser";

//csrf -- cross-site request forgery
import csurf from "csurf";
import helmet from "helmet";

// create express app
const app = express();

// The 2nd argument can be omitted. Here is a default value for options.
const logger = new FluentClient("fluentd.test", {
	socket: {
		host: "localhost",
		port: 24224,
		timeout: 3000, // 3 seconds
	},
});

//configure csrf
const csurfProtection = csurf({ cookie: true });

// db
mongoose
	.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/edemy`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("**DB CONNECTED**"))
	.catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(helmet()) //see how it goes
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
//The default time for a Cookie to expire is 30 minutes.

app.use(morgan("dev"));
//single route not a miidleware for all routes

app.use(router);

// route
//readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

//csrf is behind routes to update next request's token
app.use(csurfProtection);
app.get("/api/csrfToken", (req: Request, res: Response) => {
	logger.emit("Requester's Browser", req.headers); //Working -- Need to know what to log
	res.json({ csrfToken: req.csrfToken() });
});
// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

//You'll need to use express-session package.
// Add following code before the csurf.
//If you have .use(csrf({cookie: true})) in your routes/index.js, remove it.

// const session = require('express-session')
// // mark1: change it to false
// const csrfProtection = csrf({
//   cookie: false,
// });

// // blablabla ... other code

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
// app.use(cookieParser());

// // mark2: put here
// app.use(session({
//     name: "test",
//     secret: "test",
//     cookie: { maxAge: 3 * 60 * 60 * 1000 },
//     resave: false,
//     saveUninitialized: false
// }))
// // put here

// app.use((err, req, res, next) => {
//     res.status(500).send("Something went wrong!");
// });

// app.use(csrfProtection);
// app.use('/api', routes);
