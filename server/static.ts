import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production/Vercel, the build output is in dist/public
  // In local development, it's served by Vite
  // On Vercel, dist/** files are included at the function root via vercel.json
  
  // Try multiple possible paths for Vercel deployment
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "..", "public"),
    path.resolve("/var/task", "dist", "public"),
    path.resolve("/var/task", "public"),
  ];
  
  let validPath: string | null = null;
  for (const testPath of possiblePaths) {
    console.log(`Checking path: ${testPath}, exists: ${fs.existsSync(testPath)}`);
    if (fs.existsSync(testPath)) {
      validPath = testPath;
      console.log(`Found build directory at: ${testPath}`);
      break;
    }
  }
  
  if (!validPath) {
    console.error(`Could not find build directory. Tried: ${possiblePaths.join(', ')}`);
    // Log current working directory and __dirname for debugging
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`Files in current directory: ${fs.readdirSync(process.cwd()).join(', ')}`);
    
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(', ')}. Make sure to build the client first.`,
    );
  }

  app.use(express.static(validPath));

  // Serve attached_assets as static files
  const assetsPath = path.resolve(process.cwd(), "attached_assets");
  const distAssetsPath = path.resolve(validPath, "attached_assets");
  
  if (fs.existsSync(distAssetsPath)) {
    app.use("/attached_assets", express.static(distAssetsPath));
  } else if (fs.existsSync(assetsPath)) {
    app.use("/attached_assets", express.static(assetsPath));
  }

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(validPath, "index.html"));
  });
}
