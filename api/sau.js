// api/sau.js

export default async function handler(req, res) {
  // ==== CORS cho mọi origin ====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Trả lời preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Chỉ cho phép GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { API_SAU, AUTH_TOKEN } = process.env;

  if (!API_SAU) {
    return res.status(500).json({ error: "API_SAU not configured in env" });
  }

  if (!AUTH_TOKEN) {
    return res.status(500).json({ error: "AUTH_TOKEN not configured in env" });
  }

  try {
    const response = await fetch(API_SAU, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN,
      },
    });

    const rawText = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Remote API_SAU returned error",
        status: response.status,
        body: rawText?.slice(0, 500) || null,
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return res.status(500).json({
        error: "Remote API_SAU returned invalid JSON",
        message: e.message,
        bodySample: rawText?.slice(0, 500) || null,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Internal error calling API_SAU",
      message: err.message,
    });
  }
}
