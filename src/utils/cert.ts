import fs from 'node:fs'
import path  from 'node:path';

const CERT_DIR = path.resolve("cert");

export const PRIVATE_KEY: string = fs.readFileSync(
  path.join(CERT_DIR, "private-key.pem"),
  "utf8",
);

export const PUBLIC_KEY: string = fs.readFileSync(
  path.join(CERT_DIR, "public-key.pub"),
  "utf8",
);