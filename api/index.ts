import { initializeApp, app } from "../server/index";

// Initialize the Express app once
let initializationPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!initializationPromise) {
    initializationPromise = initializeApp();
  }
  await initializationPromise;

  // Pass the request to the Express app
  app(req, res);
}

















