import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { hash } from "../../lib/password";
import { Prisma } from "@prisma/client";
import zod from "zod";

const schema = zod.object({
  username: zod.string().min(3).max(20),
  password: zod.string().min(8).max(100),
  email: zod.string().email(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> {
  if (req.method === "POST") {
    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.message });
    }

    const { username, password, email } = req.body;
    const hashedPassword = await hash(password);

    try {
      // Create a profile for the user then add the user
      const profile = await prisma.profile.create({
        data: {
          user: {
            create: {
              username,
              password: hashedPassword,
            },
          },
          name: "",
          email: email,
          avatar: ""
        },
      });

      return res.status(201).json(profile);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(409).json({ error: "Username already in use" });
      }
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  return res.status(405).end();
}
