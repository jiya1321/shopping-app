import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production/Vercel, the build output is in dist/public
  // In local development, it's served by Vite
  // On Vercel, dist/** files are included at the function root via vercel.json
  const distPath = path.resolve(process.cwd(), "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Serve attached_assets as static files
  const assetsPath = path.resolve(process.cwd(), "attached_assets");
  app.use("/attached_assets", express.static(assetsPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
