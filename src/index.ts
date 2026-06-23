import express, { type Request, type Response } from "express";
import path from "node:path";
import crypto from "node:crypto";
import { PRIVATE_KEY, PUBLIC_KEY } from "./utils/cert.js";
import { findUserByEmail, createUser } from "./db/users.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(express.static(path.resolve("public")));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Heyy from Auth Server" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ healthy: true });
});

interface SignUpBody {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

app.post(
  "/o/authenticate/sign-up",
  (req: Request<{}, {}, SignUpBody>, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res
        .status(400)
        .json({ message: "firstName, email, and password are required" });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    const user = createUser({
      firstName,
      lastName: lastName ?? null,
      email,
      password: hash,
      salt,
    });
    res.status(201).json({ id: user.id, email: user.email });
  },
);

app.listen(PORT, () => {
  console.log(`AuthServer is running on PORT ${PORT}`);
});
