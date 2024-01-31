// import * as jsoncParser from 'jsonc-parser';

document.addEventListener('DOMContentLoaded', async () => {
    const fileDropdown = document.getElementById('fileDropdown') as HTMLSelectElement; // Dropdown element
    const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
    const fieldsContainer = document.getElementById('fieldsContainer') as HTMLDivElement;
    const instructionsContainer = document.getElementById('instructionsContainer') as HTMLDivElement;
    const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;

    uploadButton.addEventListener('click', async () => {

        instructionsContainer.innerHTML = '<p>To get the bins for a field, please click on the checkbox for that field.<p/>';

        const apiKey = apiKeyInput.value;
        if (!apiKey) {
            alert("Please enter the API key.");
            return;
        }

        const selectedFile = fileDropdown.value;
        if (selectedFile) {
            fetch(selectedFile)
                .then(response => response.json())
                .then(async fileContent => {
                    console.log(fileContent);
                    fieldsContainer.innerHTML = '';
                    const uniqueFields = Object.keys(fileContent[0]);

                    uniqueFields.forEach(field => {
                        // Create checkbox for each field
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = field;
                        checkbox.name = field;

                        // Create label for checkbox
                        const label = document.createElement('label');
                        label.htmlFor = field;
                        label.textContent = field;

                        // Create container for the response
                        const responseContainer = document.createElement('div');
                        responseContainer.id = `response-${field}`;

                        // Append checkbox, label, and response container to fieldsContainer
                        fieldsContainer.appendChild(checkbox);
                        fieldsContainer.appendChild(label);
                        fieldsContainer.appendChild(responseContainer);
                        fieldsContainer.appendChild(document.createElement('br'));

                        // Event listener for checkbox
                        checkbox.addEventListener('change', async (event) => {
                            if (checkbox.checked) {
                                try {
                                    responseContainer.innerHTML = "Loading GPT Response"
                                    const fieldValues = getUniqueValues(fileContent, field);
                                    console.log(fieldValues);
                                    // Example API call - replace with actual implementation
                                    const response = await fetchOpenAI(apiKey, fieldValues, field);
                                    const parsedResponse = extractAndParseJSON(response);
                                    const bins = parsedResponse.bins;
                                    console.log(bins);

                                    const binsContainer = document.createElement('div');
                                    binsContainer.id = 'binsContainer';

                                    // Iterate over the bins and create a button for each
                                    bins.forEach(bin => {
                                        // Create a container for each bin's buttons
                                        const binButtonContainer = document.createElement('div');

                                        // Create a label for the bin
                                        const binLabel = document.createElement('label');
                                        binLabel.textContent = `Bin: ${bin.bin_name}`;
                                        binButtonContainer.appendChild(binLabel);
                                        binButtonContainer.appendChild(document.createElement('br')); // Line break for better formatting
                                        
                                        // Create button for showing reasoning
                                        const reasoningButton = document.createElement('button');
                                        reasoningButton.textContent = `Show Reasoning for ${bin.bin_name}`;

                                        // Create a paragraph element to display the reasoning
                                        const reasoningText = document.createElement('p');
                                        reasoningText.id = `reasoning-${bin.bin_name}`;
                                        reasoningText.style.display = 'none'; // Initially hide the reasoning text

                                        reasoningButton.addEventListener('click', () => {
                                            // Toggle visibility of the reasoning text
                                            if (reasoningText.style.display === 'none') {
                                                reasoningText.style.display = 'block';
                                                reasoningText.textContent = bin.pred.reasoning;
                                            } else {
                                                reasoningText.style.display = 'none';
                                                reasoningText.textContent = '';
                                            }
                                        });

                                        binButtonContainer.appendChild(reasoningButton);
                                        binButtonContainer.appendChild(reasoningText);

                                        // Create button for showing values
                                        const valuesButton = document.createElement('button');
                                        valuesButton.textContent = `Show Values for ${bin.bin_name}`;

                                        // Create a paragraph element to display the values
                                        const valuesText = document.createElement('p');
                                        valuesText.id = `values-${bin.bin_name}`;
                                        valuesText.style.display = 'none'; // Initially hide the values text

                                        valuesButton.addEventListener('click', () => {
                                            // Toggle visibility of the values text
                                            if (valuesText.style.display === 'none') {
                                                valuesText.style.display = 'block';
                                                valuesText.textContent = `Values: TODO`;
                                            } else {
                                                valuesText.style.display = 'none';
                                                valuesText.textContent = '';
                                            }
                                        });

                                        binButtonContainer.appendChild(valuesButton);
                                        binButtonContainer.appendChild(valuesText);

                                        binsContainer.appendChild(binButtonContainer);
                                    });

                                    // Display response - Modify according to your actual response format
                                    responseContainer.innerHTML = ""
                                    responseContainer.appendChild(binsContainer);

                                } catch (error) {
                                    console.error('Error:', error);
                                    responseContainer.innerHTML = '<p>Error processing field.</p>';
                                }
                            } else {
                                // Clear the response container if the checkbox is unchecked
                                responseContainer.innerHTML = '';
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('Error fetching the file:', error);
                    fieldsContainer.innerHTML = '<p>Error loading file.</p>';
                });
        } else {
            alert("Please select a file.");
        }
    });
});

function getUniqueValues(jsonArray: any, fieldName: string): any[] {
    const uniqueValues = new Set<any>();
    jsonArray.forEach(item => {
        if (item.hasOwnProperty(fieldName)) {
            uniqueValues.add(item[fieldName]);
        }
    });
    return Array.from(uniqueValues);
}

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

async function fetchOpenAI(apiKey, fieldValues, field) {

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
                
                { bins: [
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
                }

                Another example, if we have:

                {
                    "field": "car_origin",
                    "field_bins": ["Japan", "USA", "France"]
                },
                
                You should output:
                
                { bins: [
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
                }`,
            model: "gpt-4-1106-preview",
            tools: [{"type": "retrieval"}],
            // file_ids: [fileId]
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

                    {
                        "role": "user", 
                        "content": 
                        `
                        Here are all the possible values for the ${field} field in the data:

                        ${fieldValues}.
                        `

                    },

                    {
                        "role": "user", 
                        "content": 
                        `Create a way of breaking down this data in a non-obvious way that includes the semantic meaning of the data with the following JSON format.
                        {
                            bins : [
                                {
                                    bin_name: [insert bin name]
                                    "pred" : {insert predicate information}
                                }
                            ]
                        }
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

function extractAndParseJSON(text) {
    const jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    const match = jsonPattern.exec(text);

    if (match && match[1]) {
        try {
            const jsonString = match[1].trim();
            const jsonData = JSON.parse(jsonString);
            return jsonData;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    } else {
        console.log('No JSON found in the text.');
        return null;
    }
}
