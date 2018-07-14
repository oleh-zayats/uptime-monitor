/*
 * Create and export configuration variables
 *
 */

interface Environment {
  httpPort: number;
  httpsPort: number;
  mode: string;
  hashingSecret: string;
}

class StagingEnvironment implements Environment {
  httpPort: number = 3000;
  httpsPort: number = 3001;
  mode: string = "staging";
  hashingSecret: string = "hashing_secret_key_stage";
}

class ProductionEnvironment implements Environment {
  httpPort: number = 5000;
  httpsPort: number = 5001;
  mode: string = "production";
  hashingSecret: string = "hashing_secret_key_prod";
}

let nodeEnv: string =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

export let environment: Environment =
  nodeEnv === "production"
    ? new ProductionEnvironment()
    : new StagingEnvironment();
