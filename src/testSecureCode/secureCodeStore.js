let tempSecureCodeSave = null;

const setSecureCode = (code) => {
  tempSecureCodeSave = code;
};

const getSecureCode = () => {
  return tempSecureCodeSave;
};

module.exports = {
  setSecureCode,
  getSecureCode,
};
