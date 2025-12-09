// api/dat.js

export default async function handler(req, res) {
  // ==== CORS cho mọi origin ====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Trả lời preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Chỉ cho phép GET (vì mình chỉ proxy GET)
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { API_DAT, AUTH_TOKEN } = process.env;

  if (!API_DAT) {
    return res.status(500).json({ error: "API_DAT not configured in env" });
  }

  if (!AUTH_TOKEN) {
    return res.status(500).json({ error: "AUTH_TOKEN not configured in env" });
  }

  try {
    const response = await fetch(API_DAT, {
      method: "GET",
      headers: {
        Authorization: AUTH_TOKEN, // Token đặt trong biến môi trường Vercel
      },
    });

    const rawText = await response.text();

    if (!response.ok) {
      // Server apidvc trả lỗi (401, 403, 500, ...)
      return res.status(500).json({
        error: "Remote API_DAT returned error",
        status: response.status,
        body: rawText?.slice(0, 500) || null,
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      // Trường hợp server trả về không phải JSON chuẩn
      return res.status(500).json({
        error: "Remote API_DAT returned invalid JSON",
        message: e.message,
        bodySample: rawText?.slice(0, 500) || null,
      });
    }

    // Thành công: trả nguyên JSON về cho frontend
    return res.status(200).json(data);
  } catch (err) {
    // Lỗi mạng, DNS, timeout, v.v.
    return res.status(500).json({
      error: "Internal error calling API_DAT",
      message: err.message,
    });
  }
}
