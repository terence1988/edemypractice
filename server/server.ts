import express, { Request, Response } from "express";
import cors from "cors";
//import { readdirSync } from "fs";
import mongoose from "mongoose";
import morgan from "morgan";

//routes
import router from "./routes";
require("dotenv").config(); //This is scoped as well, use package.json

//cookie is not parsed by default
import cookieParser from "cookie-parser";

//csrf -- cross-site request forgery
import csurf from "csurf";

// create express app
const app = express();

//configure csrf
const csurfMiddleware = csurf({ cookie: true });

// db
mongoose
	.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => console.log("**DB CONNECTED**"))
	.catch((err) => console.log("DB CONNECTION ERR => ", err));

// apply middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(csurfMiddleware);
//

app.use(router);

// route
//readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

router.get("/api/csrfToken", (req: Request, res: Response) => {
	res.json({ csrfToken: req.csrfToken() });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

// environment.d.ts

// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       GITHUB_AUTH_TOKEN: string;
//       NODE_ENV: 'development' | 'production';
//       PORT?: string;
//       PWD: string;
//     }
//   }
// }

// // If this file has no import/export statements (i.e. is a script)
// // convert it into a module by adding an empty export statement. It's better to change it heree
// export {}
