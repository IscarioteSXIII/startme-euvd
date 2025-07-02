const API_BASE = "https://euvd.enisa.europa.eu/api";

const defaultParams = {
  size: 15,
  page: 0
};

const typeParams = {
  latest: {},
  critical: { fromScore: 7.0 },
  exploited: { exploited: true },
  all: { size: 100 }
};

export default async function handler(req, res) {
  const { type = "latest" } = req.query;
  const params = { ...defaultParams, ...(typeParams[type] || {}) };

  const query = new URLSearchParams(params);
  const url = `${API_BASE}/search?${query.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const items = data.items.slice(0, defaultParams.size).map(v => ({
      title: v.title || `CVE ${v.id}`,
      description: v.description || '',
      date: v.datePublished,
      url: `https://euvd.enisa.europa.eu/vulnerability/${v.id}`
    }));
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
