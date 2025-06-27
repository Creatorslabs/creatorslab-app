import crypto from "crypto";

export const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase(); // Generates an 8-character unique code
};
