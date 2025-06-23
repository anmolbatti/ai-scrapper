const OpenAI = require("openai");
const openai = new OpenAI();
const fs = require("fs");

const CHUNK_SIZE = 2000; // Define the maximum size for each chunk, adjust as necessary

const extractJsonData = async (content, fieldsToScrape) => {
    try {
        // Function to split content into chunks
        const splitContentIntoChunks = (text) => {
            const chunks = [];
            for (let i = 0; i < text.length; i += CHUNK_SIZE) {
                chunks.push(text.slice(i, i + CHUNK_SIZE));
            }
            return chunks;
        };

        // Split the content into chunks
        const contentChunks = splitContentIntoChunks(content);
        let fields = fieldsToScrape || ["title", "brand", "price", "category", "listing url"];
        const combinedResults = [];

        // Define the system prompt only once
        const systemPrompt = {
            role: "system",
            content: `You are an Intelligent text extraction and conversion assistant. Your task is to extract structured information from the given text and convert it into a pure JSON format. The JSON should contain only the structured data extracted from the text, with no additional commentary, explanations, or extraneous information. If you can't find data for specific fields, set that field to empty quotes. Please provide the response in pure Array JSON format with no words before or after the JSON. There should not be any extra comments in the response I have to use your response in the code in nodjes. If you will provide any extra comments then my code will break. Example format:
            [
                {
                    "title": "listing title",
                    "brand": "listing brand",
                    "price": "$324,000",
                    "discount price": "listing discount price",
                    "category": "listing category",
                    "listing url": "listing url"
                }
            ]`,
        };

        // Loop through each chunk synchronously
        for (const chunk of contentChunks) {
            try {
                const userMessage = {
                    role: "user",
                    content: "The response should be in pure JSON. Now Extract the following information from the provided text: \nPage Content:\n\n" + chunk + "\n\nInformation to extract: " + fields,
                };

                // API call with the system prompt and user message
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo-1106",
                    messages: [systemPrompt, userMessage],
                    max_tokens: 4000,
                });

                const jsonResponse = typeof completion?.choices[0].message?.content === "string"
                    ? completion?.choices[0].message?.content.trim()
                    : completion?.choices[0].message?.content;

                const jsonData = JSON.parse(jsonResponse);

                fs.writeFile('chatgptJson.txt', jsonResponse, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } else {
                        console.log('File created and text inserted successfully!');
                    }
                });

                const finalJson = jsonData.filter(item => {
                    const firstKey = Object.keys(item)[0];
                    return item[firstKey] && item[firstKey].trim() !== "";
                });

                combinedResults.push(...finalJson);
            } catch (chatgptError) {
                console.error('Error encountered during chunk processing:', chatgptError);
                break; // Stop processing further chunks on error
            }
        }

        // Return the combined JSON results
        return combinedResults;
    } catch (error) {
        console.error("Error fetching JSON response:", error);
        return false; // Handle the error as needed
    }
};

module.exports = extractJsonData;
