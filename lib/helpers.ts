/*
 * Utility library (hashing, parsing etc.)
 * 
 */

import crypto = require("crypto");
import * as config from "./config";

export function hash(string: string) {
  if (string.length > 0) {
    let secret = config.environment.hashingSecret;
    let hashResult = crypto.createHmac("sha256", secret).update(string).digest("hex");
    return hashResult;
  } else {
    return false;
  }
}

export function parseJSONToObject(string: string) {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.log(error);
    return {};
  }
}
