import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { hash } from "../../lib/password";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> {
  if (req.method === "POST") {
    const { username, password } = req.body;
    const hashedPassword = await hash(password);

    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      return res.status(201).json(user);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(409).json({ error: "Username already in use" });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  return res.status(405).end();
}
