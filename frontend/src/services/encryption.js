import CryptoJS from "crypto-js";

// AES encryption
export function encryptMessage(message, secret) {
  return CryptoJS.AES.encrypt(message, secret).toString();
}

// AES decryption
export function decryptMessage(cipher, secret) {
  const bytes = CryptoJS.AES.decrypt(cipher, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
