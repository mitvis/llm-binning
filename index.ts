import express from 'express';

const OpenAI = require('openai');
const fs = require('fs');
const secrets = require('./secrets/openai.json');

const apiKey = secrets.OPENAI_API_KEY;
const openai = new OpenAI( {apiKey} );

async function fetchGPTResponse() {
    const file = await openai.files.create({
        file: fs.createReadStream("datasets/barley.json"),
        purpose: "assistants",
    });

    const file_name = "barley.json"; // Perhaps nice way to include semantic meaning?

    const assistant = await openai.beta.assistants.create({
        instructions: 

        `You will format all your answers using the Vega-Lite predicate formatting. For a field predicate, 
        a field must be provided along with one of the predicate properties: equal, lt (less than), 
        lte (less than or equal), gt (greater than), gte(greater than or equal), or range. 

        Some examples are the following:

        A {"field": "car_color", "equal": "red"} means the car_color field's value is equal to "red".
        A {"field": "x", "range": [0, 5]}} means the x field's value is in range [0,5] (0 ≤ x ≤ 5).
        A {"field": "state", "gt": "Arizona"} means the state field's value is greater than "Arizona" by string comparison.
        A {"field": "height", "lt": 180} means the height field's value is less than 180.
        `,
        model: "gpt-4-1106-preview",
        tools: [{"type": "retrieval"}],
        file_ids: [file.id]
    });

    const thread = await openai.beta.threads.create();

    const field_name = "variety"

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: 
          
          `###Instruction### Your task is to create meaningful binnings that capture the semantic 
          meaning of the ${field_name} field in the file ${file_name}. Avoid conventional or straightforward binnings. 
          You will be penalized for proposing non-useful binning strategies.`,
        }
    );

    const message2 = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: 

          `Please format the binnings in the following JSON format: {binnings: [{bin_name: [insert name],
          pred: {field: ${field_name}, [insert predicate values]}]} `,
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

    console.log(messages.data[0].content);
    
    return messages.data[0].content

}


const app = express();

app.get('/', async (req, res) => {
    try {
        const response = await fetchGPTResponse();
        res.send(response); // Send the actual response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
    