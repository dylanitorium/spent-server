const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const auth0Config = require("spent/config/auth0");

const client = jwksClient({
  jwksUri: `https://${auth0Config.domain}/.well-known/jwks.json`
});

const getKey = (header, cb) => {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
};

const options = {
  audience: auth0Config.clientId,
  issuer: `https://${auth0Config.domain}/`,
  algorithms: auth0Config.algorithms
};

const getUserFromToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded.email);
    });
  });

module.exports = {
  getUserFromToken
};
