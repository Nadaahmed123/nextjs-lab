import { connectDB } from "@/app/_lib/db";
import { User } from "../../../../../models/User";


export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const data = await req.json();
  const user = await User.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(user);
}

export async function DELETE(_: Request, { params }: any) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return Response.json({ message: "User deleted" });
}
