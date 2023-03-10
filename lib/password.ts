import bcrypt from "bcrypt";

const HASH_ROUNDS = 10;

export async function hash(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, HASH_ROUNDS);
  return hash;
}

export async function compare(
  password: string,
  hash: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, hash);
  return result;
}
