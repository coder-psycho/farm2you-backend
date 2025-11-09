const { AzureOpenAI } = require("openai");
const Product = require("../../models/Product");
const asyncWrapper = require("../../middleware/async");

const embeddingClient = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_EMBED_KEY,
  deployment: "text-embedding-3-large",
  apiVersion: "2024-04-01-preview"
});

const chatClient = new AzureOpenAI({
  endpoint: process.env.AZURE_BOT_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  deployment: "gpt-5-chat",
  apiVersion: "2024-04-01-preview"
});

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

async function searchProducts(queryEmbedding, topK = 3) {
  const products = await Product.find({ embedding: { $exists: true } });
  const scored = products.map(p => ({
    product: p,
    score: cosineSimilarity(queryEmbedding, p.embedding)
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.product);
}

const sendMessage = asyncWrapper(async (req, res) => {
  const { query, context = [] } = req.body;
  if (!query) return res.status(400).json({ message: "Query is required" });

  // 1️⃣ Embed query
  const embeddingResp = await embeddingClient.embeddings.create({
    model: "text-embedding-3-large",
    input: query
  });
  const queryEmbedding = embeddingResp.data[0].embedding;

  // 2️⃣ Find relevant products
  const topProducts = await searchProducts(queryEmbedding);

  const productContext = topProducts.length
  ? topProducts.map(p =>
      `Product: ${p.productName} (${p.variety})
Description: ${p.description}
Price: ${p.price}
Quantity: ${p.qty}
Link: http://localhost:3000/product/${p._id}`
    ).join("\n\n")
  : "No relevant products.";


 const prompt = `
You are a helpful farm products assistant.
Use the product info if relevant, otherwise answer freely.
Return product links as clickable URLs in Markdown format if referenced.

Products:
${productContext}

Conversation Context:
${context.map(c => `${c.role}: ${c.content}`).join("\n")}

User Question: ${query}
`;


  // 4️⃣ Send to chat deployment
  const chatResp = await chatClient.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-5-chat"
  });

  const answer = chatResp.choices[0].message.content;
  res.status(200).json({ answer });
});

module.exports = sendMessage;
