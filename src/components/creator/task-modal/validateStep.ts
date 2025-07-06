interface TaskData {
  _id?: string;
  title: string;
  type: string[];
  platform: string;
  image: string;
  description: string;
  target: string;
  rewardPoints: number;
  maxParticipants: number;
  expiration?: string;
  category?: string;
}

const isValidURL = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

const isFutureDate = (date: string): boolean => {
  const parsed = Date.parse(date);
  return !isNaN(parsed) && new Date(parsed) > new Date();
};

export const validateStep = (step: number, formData: TaskData): boolean => {
  switch (step) {
    case 1:
      return (
        typeof formData.title === "string" &&
        formData.title.trim().length >= 3 &&
        formData.image?.trim() !== ""
      );

    case 2:
      return (
        typeof formData.platform === "string" &&
        formData.platform.trim() !== "" &&
        Array.isArray(formData.type) &&
        formData.type.length > 0 &&
        formData.type.every((t) => typeof t === "string" && t.trim() !== "")
      );

    case 3:
      return (
        isValidURL(formData.target.trim()) &&
        typeof formData.rewardPoints === "number" &&
        formData.rewardPoints > 0 &&
        typeof formData.maxParticipants === "number" &&
        formData.maxParticipants > 0
      );

    case 4:
      return (
        typeof formData.description === "string" &&
        formData.description.trim().length >= 10 &&
        ["social", "content", "referral"].includes(formData.category || "")
      );

    case 5:
      return formData.expiration ? isFutureDate(formData.expiration) : true;

    default:
      return true;
  }
};
