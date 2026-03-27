export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Handle Vercel body parsing edge cases
    const { name, email, message } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Send to Discord webhook (SECURE via env)
    const response = await fetch(process.env.DISCORD_WEBHOOK_EXPLOSIVE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        embeds: [{
          title: "💣 Hire AvoidMyExplosive",
          color: 0xff0000,
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Message", value: message }
          ],
          footer: {
            text: "New hire request"
          },
          timestamp: new Date().toISOString()
        }]
      })
    });

    // Forward webhook errors if any
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Webhook failed", details: text });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("EXPLOSIVE API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
