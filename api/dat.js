
/**
 * Serverless function cho API Dat
 * Vercel runtime: Node 18+ (có sẵn fetch)
 *
 * Sử dụng biến môi trường:
 * - API_DAT  : URL nguồn
 * - AUTH_TOKEN : 'Bearer ...token...'
 */
export default async function handler(req, res) {
  const apiUrl = process.env.API_DAT;
  const token = process.env.AUTH_TOKEN;

  if (!apiUrl || !token) {
    return res.status(500).json({
      error: "Missing API_DAT or AUTH_TOKEN env vars"
    });
  }

  try {
    const upstreamRes = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    const data = await upstreamRes.json();

    return res.status(upstreamRes.status).json(data);
  } catch (err) {
    console.error("Error calling API_DAT:", err);
    return res.status(500).json({ error: "Internal error calling API_DAT" });
  }
}
