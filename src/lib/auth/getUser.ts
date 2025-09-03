import { cookies } from "next/headers";
import { privy } from "../privyClient";
import { IUser, User } from "../models/User";
import connectDB from "../connectDB";
import { logger } from "../logger";

export async function getLoggedInUser(): Promise<IUser | null> {
  await connectDB();

  const cookieStore = await cookies();
  const idToken = cookieStore.get("privy-id-token")?.value;
  if (!idToken) return null;

  try {
    const privyUser = await privy.getUser({ idToken });
    if (!privyUser?.id) return null;

    const localUser = await User.findOne({
      privyId: privyUser.id,
    }).lean<IUser>();
    return localUser;
  } catch (err) {
    logger.error("Error fetching logged-in user:", err);
    return null;
  }
}
