/*
 * Request handlers
 * 
 */

import _data = require("./data");
import helpers = require("./helpers");
import * as Types from "../types/types";
import HttpCodes from "./httpCodes";

// 0. Ping resource
export function ping(data, callback) {
  callback(HttpCodes.OK);
}

// 1. Not Found Handler
export function notFound(data, callback) {
  callback(HttpCodes.NOT_FOUND);
}

// 2. Users
enum UsersAcceptableMethods {
  "GET" = 0,
  "POST" = 1,
  "PUT" = 2,
  "DELETE" = 3
}

export function users(data, callback) {
  let method: string = data.method.toUpperCase();
  if (Object.keys(UsersAcceptableMethods).indexOf(method) >= 0) {
    _users[method](data, callback);
  } else {
    callback(HttpCodes.METHOD_NOT_ALLOWED);
  }
}

let _users: Types.RequestHandlerMap = {
  GET: usersGET,
  POST: usersPOST,
  PUT: usersPUT,
  DELETE: usersDELETE
};

// Users - GET
function usersGET(data: any, callback) {
  let phoneNumber: string =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;

  if (phoneNumber) {
    _data.read("users", phoneNumber, (error, data) => {
      if (!error && data) {
        delete data.hashedPassword;
        callback(HttpCodes.OK, data);
      } else {
        callback(HttpCodes.NOT_FOUND);
      }
    });
  } else {
    callback(HttpCodes.BAD_REQUEST, { Error: "Missing required field" });
  }
}

// Users - POST
function usersPOST(data, callback) {
  let firstName: string =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName: string =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone: string =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  let password: string =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 3
      ? data.payload.password.trim()
      : false;
  let termsOfServiceAgreement: boolean =
    typeof data.payload.termsOfServiceAgreement == "boolean" &&
    data.payload.termsOfServiceAgreement == true
      ? true
      : false;

  if (firstName && lastName && phone && password && termsOfServiceAgreement) {
    _data.read("users", phone, (error, data) => {
      if (error) {
        let hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          let userObject: any = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            termsOfServiceAgreement: true
          };
          _data.create("users", phone, userObject, error => {
            if (!error) {
              callback(HttpCodes.OK, {});
            } else {
              console.log(`${error}`);
              callback(HttpCodes.INTERNAL_SERVER_ERROR, {
                Error: "could not create user."
              });
            }
          });
        } else {
          callback(HttpCodes.INTERNAL_SERVER_ERROR, {
            Error: "Could not hash user password"
          });
        }
      } else {
        callback(HttpCodes.BAD_REQUEST, { Error: "User already exists" });
      }
    });
  } else {
    callback(HttpCodes.BAD_REQUEST, { Error: "Missing required fields" });
  }
}

// Users - PUT
function usersPUT(data, callback) {
  let firstName: string =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName: string =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone: string =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  let password: string =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 3
      ? data.payload.password.trim()
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      _data.read("users", phone, (userData, error) => {
        if (userData && !error) {
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.firstName = lastName;
          }
          if (password) {
            userData.hashedPassword = helpers.hash(password);
          }
          // store updates
          _data.update("users", phone, userData, error => {
            if (!error) {
              callback(HttpCodes.OK, {});
            } else {
              console.log(error);
              callback(HttpCodes.INTERNAL_SERVER_ERROR, {
                Error: "Could not update user"
              });
            }
          });
        } else {
          callback(HttpCodes.BAD_REQUEST, { Error: "User does not exist" });
        }
      });
    } else {
      callback(HttpCodes.BAD_REQUEST, { Error: "Missing fields to update" });
    }
  } else {
    callback(HttpCodes.BAD_REQUEST, { Error: "Missing required field" });
  }
}

// Users - DELETE
function usersDELETE(data, callback) {
  let phone =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length == 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    _data.read("users", phone, (error, data) => {

      if (!error && data) {
        
        _data.remove("users", phone, error => {
          if (!error) {
            callback(HttpCodes.OK, {});

          } else {
            callback(HttpCodes.INTERNAL_SERVER_ERROR, { Error: "Could not delete the specified user" });
          }
        });
      } else {
        callback(HttpCodes.BAD_REQUEST, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(HttpCodes.BAD_REQUEST, { Error: "Missing required field" });
  }
}