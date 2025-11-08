const { AzureOpenAI } = require("openai");


const client = new AzureOpenAI({
  endpoint: "https://ahmad-me4inqup-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview",
  apiKey: process.env.AZURE_OPENAI_KEY,
  deployment: "gpt-5-chat", // Example: "gpt-4o-mini"
  apiVersion: "2024-04-01-preview"
});

const textToFormattedProduct = async (req, res) => {
  try {

    console.log(req.body)


const response = await client.chat.completions.create({
  model: "gpt-5-chat",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: `
You translate the input text from Urdu to English AND then extract product information.
Do NOT guess or invent missing fields.
If something is not explicitly said, leave it as an empty string.
Return ONLY a JSON object in this exact format:
{
  "productName": "",
  "price": "",
  "qty": "",
  "description": ""
}
`
    },
    {
      role: "user",
      content: `
Example:
Input (Urdu): "میرے پاس 2 کلو چاول ہیں جس کی قیمت 500 روپے ہے."
Translated: "I have 2 kilograms of rice priced at 500 rupees."
Output:
{
  "productName": "rice",
  "price": 500,
  "qty": 2,
  "description": ""
}

Now process this input:
${req.body.text}
`
    }
  ]
});



    const json = JSON.parse(response.choices[0].message.content);
    console.log(json)
    return res.status(200).json({ type: "success", fields: json });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ type: "error", message: err.message });
  }
};

module.exports = textToFormattedProduct;
