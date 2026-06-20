const CryptoJS =
  require("crypto-js");

const encryptMessage =
  (text) => {
    return CryptoJS.AES.encrypt(
      text,
      process.env
        .ENCRYPTION_KEY
    ).toString();
  };

const decryptMessage = (
  encryptedText
) => {
  try {
    const bytes =
      CryptoJS.AES.decrypt(
        encryptedText,
        process.env.ENCRYPTION_KEY
      );

    const decrypted =
      bytes.toString(
        CryptoJS.enc.Utf8
      );

    return decrypted ||
      encryptedText;
  } catch {
    return encryptedText;
  }
};

module.exports = {
  encryptMessage,
  decryptMessage,
};