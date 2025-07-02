const API_BASE = "https://euvd.enisa.europa.eu/api";
const endpoints = {
  latest: "lastvulnerabilities",
  exploited: "exploitedvulnerabilities",
  critical: "criticalvulnerabilities",
  all: "vulnerabilities"
};

export default async function handler(req, res) {
  const { type = "latest" } = req.query;
  const endpoint = endpoints[type] || endpoints.latest;

  try {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    const data = await response.json();
    const items = data.slice(0, 15).map(v => ({
      title: v.title || `CVE ${v.id}`,
      description: v.description || '',
      date: v.datePublished,
      url: `https://euvd.enisa.europa.eu/vulnerability/${v.id}`
    }));
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
