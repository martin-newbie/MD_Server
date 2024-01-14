import dotenv from "dotenv"

interface Envs {
  [x: string]: string | undefined; 
  TZ?: string | undefined;
}

interface CostEnvs {
  database: {
    username: string
  };
}


export const envs: Envs | CostEnvs = {
  ...process.env,
  ...dotenv.config().parsed
};
export const isProduction = process.env.NODE_ENV === "production";
