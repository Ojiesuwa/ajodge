// server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const CLIENT_ID = "YOUR_CLIENT_ID";
const SECRET_KEY = "YOUR_SECRET_KEY";

let tokenCache = {
  accessToken: null,
  expiresAt: null,
};

const getToken = async () => {
  const now = Date.now();

  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString("base64");

  const response = await fetch(
    "https://passport-v2.k8.isw.la/passport/oauth/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "scope=profile&grant_type=client_credentials",
    }
  );

  const data = await response.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in - 300) * 1000,
  };

  return tokenCache.accessToken;
};

// Proxy route: Bank List
app.get("/api/bank-list", async (req, res) => {
  const token = await getToken();

  const response = await fetch(
    "https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/account-number/bank-list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  res.json(data);
});

// Proxy route: Verify NIN
app.post("/api/verify-nin", async (req, res) => {
  const token = await getToken();
  const { firstName, lastName, nin } = req.body;

  const response = await fetch(
    "https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/nin",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, nin }),
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));