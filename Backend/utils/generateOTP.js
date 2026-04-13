const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000);

  return otp;
};

module.exports = generateOTP;
