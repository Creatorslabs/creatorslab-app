export async function updateAvatar(
  userId: string,
  newUrl: string,
  oldUrl?: string
) {
  try {
    const res = await fetch("/api/user/update-avatar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newUrl, oldUrl }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update avatar");

    return data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
}
