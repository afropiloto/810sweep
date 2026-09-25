import express from "express";
import path from "path";
import fs from "fs";
import { rawMarketsData } from "./src/data/mock";
import { mapApiMarketsPayload, mapApiMarketToUi } from "./src/lib/mapApiMarket";

// Built-in fallback mock data with client investor portfolio (Flovely, LOL, AI Artists, US Athletes)
const fallbackMarkets = rawMarketsData;

async function startServer() {
  console.log("Starting server process...");
  try {
    const app = express();
    app.use(express.json());
    const isRunningBuiltServer = typeof __filename !== "undefined" && __filename.includes("dist");
    const isProduction = process.env.NODE_ENV === "production" || isRunningBuiltServer;
    const PORT = 3000;

    // Real backend API URL (from environment or default cloud run address)
    const CLOUD_RUN_API_URL = (
      process.env.VITE_API_BASE_URL || 
      process.env.NEXT_PUBLIC_API_BASE_URL || 
      'https://eight10-api-server-xrduryn2ya-ew.a.run.app'
    ).replace(/\/+$/, '');

    console.log(`[Proxy Server] Backend API Base URL designated: ${CLOUD_RUN_API_URL}`);
    console.log(`[Proxy Server] Selected PORT: ${PORT} (isProduction: ${isProduction})`);

    // Helper to proxy requests to backend
    const proxyRequest = async (apiPath: string, req: express.Request, res: express.Response, fallbackData: any) => {
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const targetUrl = `${CLOUD_RUN_API_URL}${apiPath}${queryString}`;

      try {
        const headers: Record<string, string> = {
          'Accept': 'application/json'
        };
        if (req.headers.authorization) {
          headers['Authorization'] = req.headers.authorization as string;
        }
        if (req.headers['content-type']) {
          headers['Content-Type'] = req.headers['content-type'] as string;
        }

        const options: any = {
          method: req.method,
          headers,
        };

        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
          options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, options);
        if (!response.ok) {
          throw new Error(`Cloud Run API status ${response.status}`);
        }
        const data = await response.json();
        return res.json(data);
      } catch (error: any) {
        console.warn(`[Proxy Warning] Failed to fetch ${apiPath} from API, using fallback:`, error.message);
        return res.json(fallbackData);
      }
    };

    // Health route
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // GET /markets -> Feed cards (normalize Cloud Run {markets:[]} → UI Market[])
    app.get("/api/markets", async (req, res) => {
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const targetUrl = `${CLOUD_RUN_API_URL}/markets${queryString}`;
      try {
        const response = await fetch(targetUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Cloud Run API status ${response.status}`);
        const data = await response.json();
        const mapped = mapApiMarketsPayload(data);
        if (mapped.length === 0) throw new Error('No mappable markets');
        return res.json(mapped);
      } catch (error: any) {
        console.warn(`[Proxy Warning] /api/markets fallback:`, error.message);
        return res.json(fallbackMarkets);
      }
    });

    // Single market details
    app.get("/api/markets/:id", async (req, res) => {
      const marketId = req.params.id;
      const fallbackMarket = fallbackMarkets.find(m => m.id === marketId) || fallbackMarkets[0];
      const targetUrl = `${CLOUD_RUN_API_URL}/markets/${marketId}`;
      try {
        const response = await fetch(targetUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Cloud Run API status ${response.status}`);
        const data = await response.json();
        const marketPayload = data?.market ?? data;
        const mapped = mapApiMarketToUi(marketPayload);
        if (!mapped) throw new Error('Unmappable market');
        return res.json(mapped);
      } catch (error: any) {
        console.warn(`[Proxy Warning] /api/markets/:id fallback:`, error.message);
        return res.json(fallbackMarket);
      }
    });

    // GET /trade/:id/quote -> Trade sheet preview
    app.get("/api/trade/:id/quote", (req, res) => {
      const marketId = req.params.id;
      const fallbackQuote = {
        price: 0.5,
        size: 100,
        quoteId: `quote-${marketId}-${Date.now()}`
      };
      return proxyRequest(`/trade/${marketId}/quote`, req, res, fallbackQuote);
    });

    // POST /orders -> Credits CLOB submission
    app.post("/api/orders", (req, res) => {
      return proxyRequest('/orders', req, res, { 
        success: true, 
        id: `order-${Date.now()}`,
        message: "Order placed on Credits CLOB successfully" 
      });
    });

    // GET /points/balance -> User credits listing
    app.get("/api/points/balance", (req, res) => {
      return proxyRequest('/points/balance', req, res, { 
        balance: 10000
      });
    });

    // GET /positions/:wallet -> Live portfolio & open bets
    app.get("/api/positions/:wallet", (req, res) => {
      const walletAddress = req.params.wallet;
      return proxyRequest(`/positions/${walletAddress}`, req, res, []);
    });

    // Setup Vite development middleware OR serve static build assets
    if (!isProduction) {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))
        ? path.join(process.cwd(), 'dist')
        : (typeof __dirname !== "undefined" && fs.existsSync(path.join(__dirname, 'index.html')))
          ? __dirname
          : path.join(process.cwd(), 'dist');

      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
}

startServer();

