
/**
 * Retrieves Basic Device Information, including serial numbers and enabled capabilities
 */
export const getDeviceInfo = () => new Promise((resolve, reject) => {
  try {
    // const dm = DeviceManager.getInstance('DEBUG', 'C:\\Temp\\');
    // dm.devicesGetConnected((err, resp) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve(resp);
    //   }
    // });
  } catch (error) {
    reject(error);
  }
});

/**
 * Change the User PIN, as long as the original PIN is known
 * @param {string} oldPin
 * @param {string} newPin
 */
export const changeUserPin = (
  serialNumber,
  oldPin,
  newPin,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(oldPin);
    console.log(newPin);
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivChangePin(
    //   serialNumber,
    //   oldPin,
    //   newPin,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * Reset the User PIN, using the PUK.
 * @param {string} puk
 * @param {string} newPin
 */
export const resetUserPin = (
  serialNumber,
  puk,
  newPin,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(puk);
    console.log(newPin);
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivResetPin(
    //   serialNumber,
    //   puk,
    //   newPin,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * Resets a Yubikey's PIV Applet to Factory Settings
 * @param {*} serialNumber 
 * @returns 
 */
export const resetPivApplet = (serialNumber) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivResetApplet(serialNumber, (err, resp) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve(resp);
    //   }
    // });
  } catch (error) {
    reject(error);
  }
});

/**
 * Set the PUK
 * @param {string} oldPuk
 * @param {string} newPuk
 */
export const setPuk = (
  serialNumber,
  oldPuk,
  newPuk,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(oldPuk);
    console.log(newPuk);
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivSetPuk(
    //   serialNumber,
    //   oldPuk,
    //   newPuk,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * Decrypt Data with the 9D Key
 * @param {string} serialNumber
 * @param {string} pin
 * @param {string} encryptedData
 */
export const decryptData = (
  serialNumber,
  pin,
  encryptedData,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(pin);
    console.log(encryptedData);
    // const encryptedDataBuf = Uint8Array.from(Buffer.from(encryptedData, 'base64'));
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivDecryptData(
    //   serialNumber,
    //   DeviceSlot.SLOT_9D,
    //   pin,
    //   encryptedDataBuf,
    //   KeyType.KEY_TYPE_RSA2048,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * Encrypt Data with the 9D Key
 * @param {string} serialNumber
 * @param {Uint8Array} clearText
 */
export const encryptData = (
  serialNumber,
  clearText,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(clearText);
    // const dm = DeviceManager.getInstance();
    // dm.yubikeyPivEncryptData(
    //   serialNumber,
    //   DeviceSlot.SLOT_9D,
    //   clearText,
    //   KeyType.KEY_TYPE_RSA2048,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * Set the Management Key
 * @param {string} serialNumber
 * @param {string} oldManagementKey
 * @param {string} newManagementKey
 */
export const setManagementKey = (
  serialNumber,
  oldManagementKey,
  newManagementKey,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(oldManagementKey);
    console.log(newManagementKey);
    // const dm = DeviceManager.getInstance();
    // const oldManagementBuf = Uint8Array.from(Buffer.from(oldManagementKey, 'hex'));
    // const newManagementBuf = Uint8Array.from(Buffer.from(newManagementKey, 'hex'));
    // dm.yubikeyPivSetManagementKey(
    //   serialNumber,
    //   oldManagementBuf,
    //   newManagementBuf,
    //   false,
    //   false,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * 
 * @param {*} serialNumber 
 * @param {*} managementKey 
 * @param {*} privateKey 
 * @param {*} slotId 
 * @returns 
 */
export const importPrivateKey = (
  serialNumber,
  managementKey,
  privateKey,
  slotId,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(managementKey);
    console.log(privateKey);
    console.log(slotId);
    // const dm = DeviceManager.getInstance();
    // const managementKeyBuf = Uint8Array.from(Buffer.from(managementKey, 'hex'));
    // const privateKeyBuf = Uint8Array.from(Buffer.from(privateKey, 'base64'));

    // dm.yubikeyPivImportKey(
    //   serialNumber,
    //   slotId,
    //   managementKeyBuf,
    //   privateKeyBuf,
    //   PinPolicy.PIN_DEFAULT,
    //   TouchPolicy.TCH_DEFAULT,
    //   undefined,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * 
 * @param {*} serialNumber 
 * @param {*} managementKey 
 * @param {*} certificate 
 * @param {*} slotId 
 * @returns 
 */
export const importCertificate = (
  serialNumber,
  managementKey,
  certificate,
  slotId,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(managementKey);
    console.log(certificate);
    console.log(slotId);
    // const dm = DeviceManager.getInstance();
    // const managementKeyBuf = Uint8Array.from(Buffer.from(managementKey, 'hex'));
    // const certificateBuf = Uint8Array.from(Buffer.from(certificate, 'base64'));
    // dm.yubikeyPivImportCertificate(
    //   serialNumber,
    //   slotId,
    //   managementKeyBuf,
    //   certificateBuf,
    //   undefined,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});

/**
 * 
 * @param {*} serialNumber 
 * @param {*} ccidEnabled 
 * @param {*} otpEnabled 
 * @param {*} fidoEnabled 
 * @param {*} ccidTouchEject 
 * @param {*} ccidAutoEjectTimeout 
 * @param {*} challengeResponseTimeout 
 * @returns 
 */
export const setMode = (
  serialNumber,
  ccidEnabled,
  otpEnabled,
  fidoEnabled,
  ccidTouchEject,
  ccidAutoEjectTimeout,
  challengeResponseTimeout,
) => new Promise((resolve, reject) => {
  try {
    console.log(serialNumber);
    console.log(ccidEnabled);
    console.log(otpEnabled);
    console.log(fidoEnabled);
    console.log(ccidTouchEject);
    console.log(ccidAutoEjectTimeout);
    console.log(challengeResponseTimeout);
    // const dm = DeviceManager.getInstance();

    // dm.yubikeyGenSetDeviceMode(
    //   serialNumber,
    //   ccidEnabled,
    //   otpEnabled,
    //   fidoEnabled,
    //   ccidTouchEject,
    //   ccidAutoEjectTimeout,
    //   challengeResponseTimeout,
    //   (err, resp) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(resp);
    //     }
    //   }
    // );
  } catch (error) {
    reject(error);
  }
});