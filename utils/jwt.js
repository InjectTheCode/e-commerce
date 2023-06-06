const jwt = require("jsonwebtoken");

const signToken = (tokenInfo) => {
  const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  return token;
};

const tokenIsValid = (tokenInfo) => {
  return jwt.verify(tokenInfo, process.env.JWT_SECRET);
};

const attachCookiesToResponse = (res, tokenInfoForSign) => {
  const token = signToken(tokenInfoForSign);
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + oneDay) });
};

module.exports = {
  signToken,
  tokenIsValid,
  attachCookiesToResponse,
};
