"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAndParseJSON = void 0;
function extractAndParseJSON(text) {
    const jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    const match = jsonPattern.exec(text);
    if (match && match[1]) {
        try {
            const jsonString = match[1].trim();
            // const jsonData = JSON.parse(jsonString);
            return jsonString;
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }
    else {
        console.log('No JSON found in the text.');
        return null;
    }
}
exports.extractAndParseJSON = extractAndParseJSON;
