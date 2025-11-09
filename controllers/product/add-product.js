const Product = require("../../models/Product");
const asyncWrapper = require("../../middleware/async");
const jwt = require("jsonwebtoken");
const { AzureOpenAI } = require("openai"); 

const addProduct = asyncWrapper(async (req, res) => {
    const { productName, qty, price, description, images, variety } = req.body;

    if (!productName || !qty || !price || !description) {
        return res.status(400).json({
            type: "error",
            message: "All fields need to be filled"
        });
    }

    // Verify user
    const token = req.headers.authorization?.split(' ')[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Prepare text for embedding
    const textForEmbedding = `${productName} ${variety || ""} ${description}`;

    // Initialize Azure OpenAI client
    const client = new AzureOpenAI({
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_EMBED_KEY,
        deployment: "text-embedding-3-large", // your embedding deployment
        apiVersion: "2024-04-01-preview"
    });

    // Generate embedding
    const embeddingResponse = await client.embeddings.create({
        model: "text-embedding-3-large",
        input: textForEmbedding
    });

    const embeddingVector = embeddingResponse.data[0].embedding;

    // Save product with embedding
    const newProduct = new Product({
        user: verification.userId,
        productName,
        variety,
        qty,
        price,
        description,
        images,
        embedding: embeddingVector
    });

    await newProduct.save();

    return res.status(200).json({
        type: "success",
        message: "Product added successfully",
        product: newProduct._id
    });
});

module.exports = addProduct;
