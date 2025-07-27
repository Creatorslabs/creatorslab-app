import { cookies } from "next/headers";
import { privy } from "../privyClient";
import { User } from "../models/User";
import connectDB from "../connectDB";

export async function getLoggedInUser() {
  await connectDB();
  const cookieStore = await cookies();
  const idToken = cookieStore.get("privy-id-token")?.value;

  if (!idToken) return null;

  const privyUser = await privy.getUser({ idToken });
  if (!privyUser?.id) return null;

  const localUser = await User.findOne({ privyId: privyUser.id });
  return localUser;
}
