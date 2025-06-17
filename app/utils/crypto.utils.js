const crypto = require("crypto");
const jsrsasign = require("jsrsasign");

// Generate RSA Key Pair
const generateRSAKeys = () => {
    const rsaKeyPair = jsrsasign.KEYUTIL.generateKeypair("RSA", 2048);
    return {
        publicKey: jsrsasign.KEYUTIL.getPEM(rsaKeyPair.pubKeyObj),
        privateKey: jsrsasign.KEYUTIL.getPEM(rsaKeyPair.prvKeyObj),
    };
};

// Encrypt message with AES
const encryptMessage = (text, aesKey) => {
    const cipher = crypto.createCipher("aes-256-cbc", aesKey);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Decrypt message with AES
const decryptMessage = (encryptedText, aesKey) => {
    const decipher = crypto.createDecipher("aes-256-cbc", aesKey);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = { generateRSAKeys, encryptMessage, decryptMessage };
