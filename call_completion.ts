const OpenAI = require('openai');
const fs = require('fs');
const secrets = require('./secrets/openai.json');

const apiKey = secrets.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

async function main() {
    const file = await openai.files.create({
        file: fs.createReadStream("datasets/barley.json"),
        purpose: "assistants",
    });

    const file_name = "barley.json"; // Semantic meaning inclusion
    const field_name = "variety"; // Semantic meaning inclusion

    // Setup the initial conversation context
    let messages = [
      {
        role: "system",
        content: 
        
        `###Instruction### Your task is to leverage your expertise as a data analyst to 
        create compelling and non-trivial binnings for ${file_name} using the Vega-Lite predicate format. 
        Think step by step, starting with analyzing the data structure and contents of ${file_name}, then 
        identifying unique and meaningful ways to categorize or segment the data. Ensure that your binning 
        strategy is innovative, avoiding common or simplistic approaches. You will be penalized for proposing 
        basic or obvious binnings. As the GPT 'data analyst,' provide precise details and justifications for 
        each binning choice. Remember to maintain a professional tone consistent with your expert role. If 
        you require more information about the data or the context, feel free to ask clarifying questions. 
        Repeat the key principles of data binning to reinforce understanding. Additionally, if your strategy 
        successfully reveals new insights or patterns, confirm by asking, "Does this binning approach provide 
        new perspectives on the data?" Remember, your goal is to uncover hidden layers and insights in ${file_name}
        through your semantic understanding of data and creative use of the Vega-Lite predicate format.`
      },
      {
        role: "user",
        content: 
        
        `###Instruction### Your task is to conceive and develop non-obvious binnings 
        for the ${field_name} field from the specified file. Begin by analyzing the characteristics and data 
        range of the ${field_name} field. Think creatively to identify unique, insightful ways to segment or 
        categorize this data. Avoid conventional or straightforward binnings. You will be penalized for 
        proposing mundane or expected binning strategies. As a GPT 'data strategist,' provide detailed 
        reasoning behind each binning choice, ensuring that they reveal less apparent patterns or 
        relationships within the data. Should you need more details about ${field_name} or its context within 
        the file, do not hesitate to ask for more information. Emphasize the importance of innovative binning 
        by repeating key instructions. If your binning methodology leads to new insights or interpretations, 
        verify its effectiveness by asking, "Does this binning strategy offer a fresh understanding of the 
        data in ${field_name}?" Your ultimate aim is to utilize your expertise in data analysis to unearth 
        novel insights from ${field_name} using inventive binning approaches.`,
      },
      {
        role: "user",
        content: `Please format the binnings in the following JSON format: {binnings: [{name: [insert name], pred: {field: variety, gt/gte/lt/lte/range/equal}}]} `,
      }
    ];

    // Send messages to the OpenAI Chat API
    const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        response_format: { type: "json_object" },
        seed: 1,
    });

    // // Display the response
    // if (response && response.data) {
    //     response.data.forEach(msg => {
    //         console.log(`${msg.role}: ${msg.content}`);
    //     });
    // } else {
    //     console.log("No response from OpenAI");
    // }

    console.log(response.choices[0].message.content);
}

main();
