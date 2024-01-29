document.addEventListener('DOMContentLoaded', async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement; // Correct type assertion
    const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
    const fieldsContainer = document.getElementById('fieldsContainer') as HTMLDivElement;
    const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement; // API Key Input

    uploadButton.addEventListener('click', async () => {

        const apiKey = apiKeyInput.value; // Use API Key from input
        
        if (!apiKey) {
            alert("Please enter the API key.");
            return;
        }

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Upload the new file to GPT 
            const fileId = await uploadFileGPT(apiKey, file);
            console.log(fileId);

            const reader = new FileReader();

            reader.onload = async (e) => {
                if (e.target && e.target.result && typeof e.target.result === 'string') {
                    try {
                        const fileContent = JSON.parse(e.target.result);
                        fieldsContainer.innerHTML = '';
                        
                        console.log(Object.keys(fileContent[0]));
                        const uniqueFields = Object.keys(fileContent[0]);

                        uniqueFields.forEach(field => {
                            const fieldDiv = document.createElement('div');
                            const label = document.createElement('label');
                            const checkbox = document.createElement('input');
                            const responseDisplay = document.createElement('pre');

                            checkbox.type = 'checkbox';
                            checkbox.value = field;
                            label.appendChild(checkbox);
                            label.appendChild(document.createTextNode(field));
                            fieldsContainer.appendChild(fieldDiv);
                            fieldDiv.appendChild(label);
                            fieldDiv.appendChild(responseDisplay);

                            checkbox.addEventListener('change', async () => {
                                if (checkbox.checked) {
                                    try {
                                        const response = await fetchOpenAI(apiKey, fileId, field);
                                        responseDisplay.textContent = extractAndParseJSON(response);
                                    } catch (error) {
                                        console.error('Error:', error);
                                        responseDisplay.textContent = 'Error occurred';
                                    }
                                }
                            });
                        });
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }
            };

            reader.readAsText(file);
        }
    });
});

async function uploadFileGPT(apiKey, file) {

    const formData = new FormData();
    formData.append('purpose', 'assistants');
    formData.append('file', file); // Assuming 'file' is a File object

    // Make the fetch request
    const uploadDataset = await fetch('https://api.openai.com/v1/files', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        body: formData
    });

    if (!uploadDataset.ok) {
        throw new Error(`HTTP error! Status: ${uploadDataset.status}`);
    }

    const responseData = await uploadDataset.json();
    const fileId = responseData.id; // Extract the file ID

    return fileId

}


async function fetchOpenAI(apiKey, fileId, field) {

    const createAssistant = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            instructions:
                `Please analyze the uploaded dataset. For a field in the dataset, you will format all of it's binnings 
                using the Vega-Lite predicate formatting. For a bin, a field must be provided along with one of 
                the predicate properties: equal, lt (less than), lte (less than or equal), gt (greater than), 
                gte (greater than or equal), range, or oneOf.
                
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
                ]`,
            model: "gpt-4-1106-preview",
            tools: [{"type": "retrieval"}],
            file_ids: [fileId]
        })
    });

    if (!createAssistant.ok) {
        throw new Error(`HTTP error! Status: ${createAssistant.status}`);
    }

    const responseData = await createAssistant.json();
    const assistantId = responseData.id; // Extract the assistant ID

    console.log(assistantId);

    const sendMessage = await fetch(`https://api.openai.com/v1/threads/runs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            "assistant_id": `${assistantId}`,
            "thread": {
                "messages": [
                    {"role": "user", 
                    "content": 
                        `For the ${field} in the data, please create a way of breaking down this data in a non-obvious way that includes the semantic 
                        meaning of the data with the following JSON format.
            
                        [
                            {
                                "bin_name": [insert bin name],
                                "pred": {
                                    [fill in predicate information]
                                }
                            }
                        ]
                        
                        `
                    }
                ]
            }
        })
    });
    
    if (!sendMessage.ok) {
        throw new Error(`HTTP error! Status: ${sendMessage.status}`);
    }

    const runData = await sendMessage.json();
    const runId = runData.id; // Extract the run ID
    const threadId = runData.thread_id; // Extract the thread ID

    console.log(runId);
    console.log(threadId);

    let checkRunStatus = await (await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    })).json();

    while (checkRunStatus.status === "queued" || checkRunStatus.status === "in_progress") {

        console.log(checkRunStatus.status);
        // Wait for 5 seconds before checking the status again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        checkRunStatus = await (await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        })).json();

    };

    const getMessages = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    });

    const messages = await getMessages.json();

    if (messages.data[0].content[0].type == "text") {
        console.log(messages.data[0].content[0].text.value);
        return (messages.data[0].content[0].text.value);
    }
    
}

function extractAndParseJSON(text: string) {
    const jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    const match = jsonPattern.exec(text);

    if (match && match[1]) {
        try {
            const jsonString = match[1].trim();
            // const jsonData = JSON.parse(jsonString);
            return jsonString;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    } else {
        console.log('No JSON found in the text.');
        return null;
    }
}