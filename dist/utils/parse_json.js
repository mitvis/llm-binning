export function extractAndParseJSON(text) {
    var jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    var match = jsonPattern.exec(text);
    if (match && match[1]) {
        try {
            var jsonString = match[1].trim();
            var jsonData = JSON.parse(jsonString);
            return jsonData;
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
