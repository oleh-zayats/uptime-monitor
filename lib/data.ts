/* 
 * Lib for storing and updating data on disk (json files)
 * 
 */

import fs = require("fs");
import path = require("path");
import utility = require("./helpers");

let baseDirectory: string = path.join(__dirname, "/../../.data/");

export function read(dir: string, file: string, callback: any) {

  fs.readFile(`${baseDirectory}${dir}/${file}.json`, "utf-8", (error, data) => {
    if (!error && data) {
      let parsedData = utility.parseJSONToObject(data);
      callback(false, parsedData);

    } else {
      callback(error, data);
    }
  });
}

export function create(dir: string, file: string, data: any, callback: any) {
  fs.open(`${baseDirectory}${dir}/${file}.json`, "wx", (error, fileDescriptor) => {

      if (!error && fileDescriptor) {
        let stringData: string = JSON.stringify(data);

        fs.writeFile(fileDescriptor, stringData, error => {
          if (!error) {
            fs.close(fileDescriptor, error => {
              if (!error) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to a new file");
          }
        });

      } else {
        callback(`Could not create a new file. Error: ${error}`);
      }
    }
  );
}
