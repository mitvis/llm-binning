const OpenAI = require('openai');
const openai = new OpenAI( {apiKey: "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"} );
const fs = require('fs');

async function main() {
    const file = await openai.files.create({
        file: fs.createReadStream("datasets/barley.json"),
        purpose: "assistants",
    });

    const file_name = "barley"; // Perhaps nice way to include semantic meaning?

    const assistant = await openai.beta.assistants.create({
        instructions: `You are an expert data analyst who is knowledgeable about about ${file_name} and the Vega-Lite predicate format. Your goal is to use your semantic understanding of data to create interesting and non-obvious binnings.`,
        model: "gpt-4-1106-preview",
        tools: [{"type": "retrieval"}],
        file_ids: [file.id]
    });

    const thread = await openai.beta.threads.create();

    const field_name = "yield" // Todo : do we think this is a nice, generalizable way of using the code? Input can then come in from Olli

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: `Create binnings for the field ${field_name} from the file.`,
        }
    );

    const message2 = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: `Please format the binnings in the following way: {name: [insert name], pred: {field: ${field_name}, gt/gte/lt/lte/range/equal}} `,
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

}

main();

