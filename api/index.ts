import { initializeApp, app } from "../server/index.js";

let initializationPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!initializationPromise) {
    initializationPromise = initializeApp();
  }

  await initializationPromise;

  app(req, res);
}