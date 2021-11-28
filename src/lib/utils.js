import CryptoJS from 'crypto-js';
import forge from 'node-forge';
import fernet from 'fernet';
import { encode } from 'url-safe-base64';

const { pki, asn1 } = forge;

/**
 * 
 * @param {*} input 
 * @returns 
 */
export const toHex = (input) => {
  // log.debug('toHex');
  let output = '';
  for (let i = 0; i < input.length; i += 1) {
    const h = input.charCodeAt(i).toString(16);
    output += (h.length === 2 ? h : `0${h}`);
  }

  return output;
};

/**
 * 
 * @param {*} input 
 * @returns 
 */
export const fromHex = (input) => {
  // log.debug('fromHex');
  let output = '';
  for (let i = 0; i < input.length; i += 2) {
    output += String.fromCharCode(parseInt(input.substr(i, 2), 16));
  }
  return output;
};

/**
 * 
 * @param {*} str 
 * @returns 
 */
export const base64ToHex = (str) => {
  const raw = atob(str);
  let result = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : `0${hex}`);
  }
  return result.toUpperCase();
};

/**
 * Generates a random string for use as Salt
 */
export const generateSalt = () => CryptoJS.lib.WordArray.random(128 / 8).toString();

/**
 * Performs a PBKDF2 Hash on the provided data with the provided salt. 10000 iterations is the default.
 * @param {string} dataToHash
 * @param {string} salt
 * @param {int} numIterations
 */
export const pbkdf2Hash = (dataToHash, salt = '', numIterations = 10000) => CryptoJS.PBKDF2(dataToHash, salt, {
  keySize: 512 / 32,
  iterations: numIterations,
}).toString();

/**
 * 
 * @param {*} secret 
 * @param {*} plainText 
 * @returns 
 */
export const fernetEncrypt = (secret, plainText) => new Promise((resolve, reject) => {
  try {
    const fernetToken = new fernet.Token({
      secret: secret,
      time: new Date(),
      iv: [],
    });
    const cipherText = fernetToken.encode(plainText);

    resolve(cipherText);
  } catch (error) {
    reject(error);
  }
});

/**
 * 
 * @param {*} secret 
 * @param {*} token 
 * @returns 
 */
export const fernetDecrypt = (secret, token) => new Promise((resolve, reject) => {
  try {
    const fernetToken = new fernet.Token({
      secret: secret,
      token: token,
      ttl: 0,
    });
    const plainText = fernetToken.decode();

    resolve(plainText);
  } catch (error) {
    reject(error);
  }
});

/**
 * 
 * @param {*} passphrase 
 * @param {*} plaintext 
 * @returns 
 */
export const aesEncrypt = (passphrase, plaintext) => new Promise((resolve, reject) => {
  try {
    console.log(passphrase);
    console.log(plaintext);
    resolve();
  } catch (error) {
    console.error(error);
    reject(error);
  }
});

/**
 * 
 * @param {*} passphrase 
 * @param {*} salt 
 * @param {*} cipherText 
 * @returns 
 */
export const aesDecrypt = (passphrase, salt, cipherText) => new Promise((resolve, reject) => {
  try {
    console.log(passphrase);
    console.log(salt);
    console.log(cipherText);
    resolve();
  } catch (error) {
    console.error(error);
    reject(error);
  }
});

export const generateKeypairAndCertificate = (email) => new Promise((resolve, reject) => {
  try {
    const keys = pki.rsa.generateKeyPair(2048);
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 2);
    cert.setSubject([{
      name: 'commonName',
      value: email,
    }]);
    cert.setIssuer([{
      name: 'commonName',
      value: 'Signata',
    }]);
    cert.sign(keys.privateKey, forge.md.sha256.create());
    const certAsn1 = pki.certificateToAsn1(cert);
    const certDer = asn1.toDer(certAsn1);
    const certPem = Buffer.from(certDer.toHex(), 'hex').toString('base64');
    const privateKeyPem = pki.privateKeyToPem(keys.privateKey);
    const toReturn = {
      certificate: certPem,
      privateKey: encode(privateKeyPem),
    };
    console.log(toReturn);
    resolve(toReturn);
  } catch (error) {
    reject(error);
  }
});

export async function reencryptEncryptionKeypair(encryptionKey, oldSeed, newSeed) {
  // log.info('crypto.reencryptEncryptionKeypair');
  const oldKeypair = await aesDecrypt(
    encryptionKey.privateKey.cipherText,
    oldSeed,
    encryptionKey.privateKey.salt
  );
  const encryptedData = await aesEncrypt(oldKeypair.clearText, newSeed);
  return {
    cipherText: encryptedData.cipherText,
    salt: encryptedData.salt,
  };
}
