// const OpenAI = require('openai');
// const fs = require('fs');
// const secrets = require('./secrets/openai.json');

// const apiKey = secrets.OPENAI_API_KEY;
// const openai = new OpenAI({ apiKey });

// async function main() {
//     const file = await openai.files.create({
//         file: fs.createReadStream("datasets/barley.json"),
//         purpose: "assistants",
//     });

//     const file_name = "barley.json"; // Semantic meaning inclusion
//     const field_name = "variety"; // Semantic meaning inclusion

//     // Setup the initial conversation context
//     let messages = [
//       {
//         role: "system",
//         content: 
//         `You will format all your answers using the Vega-Lite predicate formatting. For a field predicate, 
//         a field must be provided along with one of the predicate properties: equal, lt (less than), 
//         lte (less than or equal), gt (greater than), gte(greater than or equal), or range. 

//         Some examples are the following:

//         A {"field": "car_color", "equal": "red"} means the car_color field's value is equal to "red".
//         A {"field": "x", "range": [0, 5]}} means the x field's value is in range [0,5] (0 ≤ x ≤ 5).
//         A {"field": "state", "gt": "Arizona"} means the state field's value is greater than "Arizona" by string comparison.
//         A {"field": "height", "lt": 180} means the height field's value is less than 180.
//         `
//       },
//       {
//         role: "user",
//         content: 
//         `###Instruction### Your task is to create binnings that capture the semantic 
//         meaning of the ${field_name} field from ${file_name}. Avoid conventional or straightforward binnings. 
//         You will be penalized for proposing non-useful binning strategies.`,
//       },

//       {
//         role: "user",
//         content: `Please format the binnings in the following JSON format: 
//         {binnings: [{bin_name: [insert name], pred: {field: ${field_name}, [insert predicate values]}]} `,
//       }
//     ];

//     // Send messages to the OpenAI Chat API
//     const response = await openai.chat.completions.create({
//         model: "gpt-4-1106-preview",
//         messages: messages,
//         response_format: { type: "json_object" },
//         seed: 1,
//     });

//     // // Display the response
//     // if (response && response.data) {
//     //     response.data.forEach(msg => {
//     //         console.log(`${msg.role}: ${msg.content}`);
//     //     });
//     // } else {
//     //     console.log("No response from OpenAI");
//     // }

//     console.log(response.choices[0].message.content);
// }

// main();
