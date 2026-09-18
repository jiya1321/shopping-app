import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production/Vercel, we need to serve static files from the bundled location
  // In local development, we serve the files with Vite
  
  console.log(`Static file serving configuration`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`VERCEL: ${process.env.VERCEL}`);
  console.log(`Current working directory: ${process.cwd()}`);
  
  // Try multiple possible paths for Vercel deployment
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "dist", "public"),
    path.resolve("/var/task", "dist", "public"),
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
  
  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    console.log(`Serving static files locally`);
    const distPath = path.resolve(process.cwd(), "dist", "public");
    
    if (!fs.existsSync(distPath)) {
      throw new Error(
        `Could not find the build directory: ${distPath}, make sure to build the client first`,
      );
    }

    app.use(express.static(distPath));

    // Serve attached_assets as static files
    const assetsPath = path.resolve(process.cwd(), "attached_assets");
    if (fs.existsSync(assetsPath)) {
      app.use("/attached_assets", express.static(assetsPath));
    }

    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else if (validPath) {
    console.log(`Serving static files from: ${validPath}`);
    app.use(express.static(validPath));

    // Serve attached_assets as static files
    const distAssetsPath = path.resolve(validPath, "attached_assets");
    if (fs.existsSync(distAssetsPath)) {
      app.use("/attached_assets", express.static(distAssetsPath));
    }

    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(validPath, "index.html"));
    });
  } else {
    console.log(`Could not find static files, serving SPA fallback`);
    app.use("*", (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Loading...</title>
        </head>
        <body>
          <p>Loading application...</p>
        </body>
        </html>
      `);
    });
  }
}
