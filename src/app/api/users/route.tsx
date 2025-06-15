import { connectDB } from "@/app/_lib/db";
import { z } from "zod";
import { User } from "../../../../models/User";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function GET() {
  await connectDB();
  const users = await User.find();
  return Response.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid input", { status: 400 });

  const user = await User.create(parsed.data);
  return Response.json(user);
}
