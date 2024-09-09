import crypto from "crypto";

const algorithm = "aes-256-cbc";

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash("sha512")
  .update(process.env.ENCRYPT_SECRET_KEY + "")
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha512")
  .update(process.env.ENCRYPT_SECRET_IV + "")
  .digest("hex")
  .substring(0, 16);

export const encryptData = (data: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, encryptionIV);

  const encryptedData =
    cipher.update(data, "utf8", "hex") + cipher.final("hex");

  return encryptedData;
};

export const decryptData = (encryptedData: string) => {
  const decipher = crypto.createDecipheriv(algorithm, key, encryptionIV);

  const decryptedData =
    decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");

  return decryptedData;
};

export const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};
