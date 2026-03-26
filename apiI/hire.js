export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, message } = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

    if (!WEBHOOK) {
      throw new Error("Webhook not set");
    }

    const discordRes = await fetch(WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `💼 New Hire Request

👤 ${name}
📧 ${email}

📝 ${message}`
      })
    });

    if (!discordRes.ok) {
      throw new Error("Discord request failed");
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
