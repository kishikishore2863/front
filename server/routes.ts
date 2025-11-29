import type { Express } from "express";
import { createServer, type Server } from "http";
import { type Request, type Response } from "express";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // PUT APPLICATION ROUTES HERE
  // prefix all routes with /api

  // POST /api/apikey
  // Returns the API key stored in the environment variable `API_KEY`.
  // Accepts an optional JSON body { lng, lat } so client can send click coords.
  // app.post('/api/apikey', (req: Request, res: Response) => {
  //   const key = process.env.API_KEY || null;
  //   const { lng, lat } = (req.body as any) || {};
  //   if (lng !== undefined && lat !== undefined) {
  //     console.log(`[api] apikey requested for coords: ${lng},${lat}`);
  //   } else {
  //     console.log('[api] apikey requested');
  //   }

  //   // Return the key in a simple JSON envelope. Client should keep this safe.
  //   res.json({ key });
  // });

  // POST /api/coffee-shops
  // app.post("/api/coffee-shops", async (req: Request, res: Response) => {
  //   try {
  //     const { latitude, longitude } = (req.body as any) || {};

  //     if (!latitude || !longitude) {
  //       return res.status(400).json({ error: "latitude and longitude are required" });
  //     }

  //     const radius = 2000; // 2 km

  //     const query = `
  //       [out:json][timeout:25];
  //       (
  //         node["amenity"="cafe"](around:${radius},${latitude},${longitude});
  //         node["shop"="coffee"](around:${radius},${latitude},${longitude});
  //         way["amenity"="cafe"](around:${radius},${latitude},${longitude});
  //         way["shop"="coffee"](around:${radius},${latitude},${longitude});
  //         relation["amenity"="cafe"](around:${radius},${latitude},${longitude});
  //         relation["shop"="coffee"](around:${radius},${latitude},${longitude});
  //       );
  //       out center meta;
  //     `;

  //     const url = "https://overpass-api.de/api/interpreter";

  //     const response = await axios.post(url, query, {
  //       headers: { "Content-Type": "text/plain" }
  //     });

  //     const results = [];
  //     const seen = new Set();

  //     for (const el of response.data.elements) {
  //       const lat = el.lat || el.center?.lat;
  //       const lon = el.lon || el.center?.lon;
  //       if (!lat || !lon) continue;

  //       const idKey = `${el.type}-${el.id}`;
  //       if (seen.has(idKey)) continue;
  //       seen.add(idKey);

  //       results.push({
  //         id: el.id,
  //         name: el.tags?.name || "Unknown",
  //         category: el.tags?.amenity || el.tags?.shop || "coffee",
  //         latitude: lat,
  //         longitude: lon,
  //         tags: el.tags || {}
  //       });
  //     }

  //     res.json({
  //       count: results.length,
  //       results
  //     });

  //   } catch (err: any) {
  //     console.error(err);
  //     res.status(500).json({ error: "Server error", details: err.message });
  //   }
  // });

  app.post("/api/coffee-shops", async (req: Request, res: Response) => {
    try {
      console.log("BODY RECEIVED:", req.body);

      // Accept both {latitude, longitude} AND {lat, lng}
      let { latitude, longitude, lat, lng } = req.body;

      // Auto-map fallback values
      latitude = latitude ?? lat;
      longitude = longitude ?? lng;

      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ error: "latitude and longitude are required" });
      }

      const radius = 2000; // 2 km

      const query = `
      [out:json][timeout:25];
      (
        node["amenity"="cafe"](around:${radius},${latitude},${longitude});
        node["shop"="coffee"](around:${radius},${latitude},${longitude});
        way["amenity"="cafe"](around:${radius},${latitude},${longitude});
        way["shop"="coffee"](around:${radius},${latitude},${longitude});
        relation["amenity"="cafe"](around:${radius},${latitude},${longitude});
        relation["shop"="coffee"](around:${radius},${latitude},${longitude});
      );
      out center meta;
    `;

      const url = "https://overpass-api.de/api/interpreter";

      const response = await axios.post(url, query, {
        headers: { "Content-Type": "text/plain" },
      });

      const results = [];
      const seen = new Set();

      for (const el of response.data.elements) {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) continue;

        const idKey = `${el.type}-${el.id}`;
        if (seen.has(idKey)) continue;
        seen.add(idKey);

        results.push({
          id: el.id,
          name: el.tags?.name || "Unknown",
          category: el.tags?.amenity || el.tags?.shop || "coffee",
          latitude: lat,
          longitude: lon,
          tags: el.tags || {},
        });
      }

      res.json({
        count: results.length,
        results,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  });

  // Dynamic query API
  // POST /api/places-nearby
  app.post("/api/places-nearby", async (req: Request, res: Response) => {
    try {
      const { latitude, longitude, categories } = (req.body as any) || {};

      if (!latitude || !longitude) {
        return res
          .status(400)
          .json({ error: "latitude and longitude required" });
      }

      if (!Array.isArray(categories) || categories.length === 0) {
        return res
          .status(400)
          .json({ error: "categories must be a non-empty array" });
      }

      const radius = 2000;

      // Build dynamic Overpass filters from user input
      const filterQuery = categories
        .map((item) => {
          if (!item.includes("=")) return ""; // skip invalid format
          const [key, value] = item.split("=");
          return `
            node["${key}"="${value}"](around:${radius},${latitude},${longitude});
            way["${key}"="${value}"](around:${radius},${latitude},${longitude});
            relation["${key}"="${value}"](around:${radius},${latitude},${longitude});
          `;
        })
        .join("\n");

      const query = `
        [out:json][timeout:25];
        (
          ${filterQuery}
        );
        out center meta;
      `;

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
      );

      const results = [];
      const seen = new Set();

      for (const el of response.data.elements) {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        if (!lat || !lon) continue;

        const idKey = `${el.type}-${el.id}`;
        if (seen.has(idKey)) continue;
        seen.add(idKey);

        results.push({
          id: el.id,
          name: el.tags?.name || "Unknown",
          category: el.tags?.amenity || el.tags?.shop || "unknown",
          latitude: lat,
          longitude: lon,
          tags: el.tags || {},
        });
      }

      res.json({
        count: results.length,
        results,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Server error",
        details: error.message,
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
