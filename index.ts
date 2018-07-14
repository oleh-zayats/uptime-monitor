import http = require("http");
import https = require("https");
import url = require("url");
import fs = require("fs");
import sd = require("string_decoder");
import * as config from "./lib/config";
import * as requestHandlers from "./lib/handlers";
import * as Types from "./types/types";
import helpers = require("./lib/helpers");

// Create & start HTTP server
let httpServer: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    server(req, res);
  }
);

httpServer.listen(config.environment.httpPort, () => {
  console.log(
    `Running server in ${config.environment.mode.toUpperCase()} mode. Listening on port ${
      config.environment.httpPort
    }.`
  );
});

// Create & start HTTPS server
let options: https.ServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

let httpsServer: https.Server = https.createServer(options, (req: http.IncomingMessage, res: http.ServerResponse) => {
    server(req, res);
  }
);

httpsServer.listen(config.environment.httpsPort, () => {
  console.log(
    `Running server in ${config.environment.mode.toUpperCase()} mode. Listening on port ${
      config.environment.httpsPort
    }.`
  );
});

// Generic server
let server = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let reqURL = typeof req.url !== "undefined" ? req.url : "";
  let parsedURL = url.parse(reqURL, true);
  let path: any = parsedURL.pathname;
  let trimmedPath: string = path.replace(/^\/+|\/+$/g, "");

  let method: string = typeof req.method !== "undefined" ? req.method.toUpperCase() : "";
  let parameters = JSON.stringify(parsedURL.query);
  let headers = JSON.stringify(req.headers);

  let decoder = new sd.StringDecoder("utf-8");
  var buffer: string = ""; /* payload buffer */

  // Writing payload from stream
  req.on("data", (data: any) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    let requestHandler: Types.RequestHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : router["notFound"];

    let dataObject: Types.Dictionary = {
      method: method,
      trimmedPath: trimmedPath,
      parameters: parameters,
      headers: headers,
      payload: helpers.parseJSONToObject(buffer)
    };

    requestHandler(dataObject, (httpCode: number, payload: object) => {
      res.setHeader("Content-Type", "application-json");
      res.writeHead(httpCode);
      res.end(JSON.stringify(payload));
      console.log(`Response: ${httpCode}, ${JSON.stringify(payload)}`);
    });
  });
};

let router: Types.HandlerMap = {
  ping: requestHandlers.ping,
  users: requestHandlers.users,
  notFound: requestHandlers.notFound
};
