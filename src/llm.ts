import fs from 'fs';
import OpenAI from "openai";

const secrets = require('../secrets/openai.json');
const apiKey = secrets.OPENAI_API_KEY;
const openai = new OpenAI({apiKey});

export async function fetchGPTResponse(dataset: string, field: string): Promise<any> {
    const file = await openai.files.create({
        file: fs.createReadStream(`datasets/${dataset}`),
        purpose: "assistants",
    });

    const file_name = dataset; // Perhaps nice way to include semantic meaning?

    const assistant = await openai.beta.assistants.create({
        instructions: 
        
        `Please analyze the ${file_name} dataset. For each field in the dataset, you will format all of it's binnings 
        using the Vega-Lite predicate formatting. For a bin, a field must be provided along with one of 
        the predicate properties: equal, lt (less than), lte (less than or equal), gt (greater than), 
        gte (greater than or equal), or range.
        
        For example, if we have:
        {
            "field": "Displacement",
            "field_bins": ["Compact", "Mid-Size", "Full-Size"]
        },
        
        You should output:
        
        [
            {
                "bin_name": "Compact",
                "pred": {
                  "field": "Displacement",
                  "lte": 100,
                  "reasoning": [insert detailed reasoning for bin and its boundaries]
                }
            },
            {
                "bin_name": "Mid-Size",
                "pred": {
                  "field": "Displacement",
                  "range": [101, 150],
                  "reasoning": [insert detailed reasoning for bin]
                }
            },
            {
                "bin_name": "Full-Size",
                "pred": {
                  "field": "Displacement",
                  "gt": 150,
                  "reasoning": [insert detailed reasoning for bin]
                }
            }
        ]

        Another example, if we have:
        {
            "field": "car_origin",
            "field_bins": ["Japan", "USA", "France"]
        },
        
        You should output:
        
        [
            {
                "bin_name": "Japan",
                "pred": {
                  "field": "car_origin",
                  "oneOf": ["nissan", "lexus"],
                  "reasoning": [insert detailed reasoning for bin and its boundaries]
                }
            },
            {
                "bin_name": "USA",
                "pred": {
                  "field": "car_origin",
                  "oneOf": ["ford", "ram"],
                  "reasoning": [insert detailed reasoning for bin]
                }
            },
            {
                "bin_name": "France",
                "pred": {
                  "field": "car_origin",
                  "oneOf": ["renault", "citroen"],
                  "reasoning": [insert detailed reasoning for bin]
                }
            }
        ]
        `,
        model: "gpt-4-1106-preview",
        tools: [{"type": "retrieval"}],
        file_ids: [file.id]
    });

    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: 
          
          `For the ${field} in the data, please create a way of breaking down this data in a non-obvious way that includes the semantic 
          meaning of the data with the following JSON format.

           {
            [
                {
                    "bin_name": [insert bin name],
                    "pred": {
                        [fill in predicate information]
                    }
                }
            ]
           }
          `,
        }
    );

    const run = await openai.beta.threads.runs.create(
        thread.id,
        {
          assistant_id: assistant.id
        }
    );

    let response = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
    );

    while (response.status === "queued" || response.status === "in_progress") {
        console.log(response.status);
        // Wait for 5 seconds before checking the status again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        response = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
        );
    };
    
    console.log(response.status);

    const messages = await openai.beta.threads.messages.list(
        thread.id
    );
    
    if (messages.data[0].content[0].type == "text") {
        console.log(messages.data[0].content[0].text.value);
        return (messages.data[0].content[0].text.value);
    }

    return "None"

}

// export async function makeJSON(output: string): Promise<string | null>{
//     // Setup the initial conversation context
//     let messages: Array<any> = [
//         {
//           role: "system",
//           content: "Please turn the json part of the following text into a JSON."
//         },
//         {
//           role: "user",
//           content: output,
//         },
//       ];
  
//     // Send messages to the OpenAI Chat API
//     const response = await openai.chat.completions.create({
//         model: "gpt-4-1106-preview",
//         messages: messages,
//         response_format: { type: "json_object" },
//         seed: 1,
//     });
  
//     console.log(response.choices[0].message.content);
    
//     return response.choices[0].message.content
// }