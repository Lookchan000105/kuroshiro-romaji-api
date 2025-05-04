const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const kuroshiro = new Kuroshiro();
let isReady = false;

(async () => {
  await kuroshiro.init(new KuromojiAnalyzer());
  isReady = true;
})();

app.post("/convert", async (req, res) => {
  if (!isReady) return res.status(503).json({ error: "Kuroshiro not ready" });

  const { text, to = "romaji", mode = "normal" } = req.body;
  try {
    const result = await kuroshiro.convert(text, { to, mode });
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));