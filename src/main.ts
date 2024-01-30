document.addEventListener('DOMContentLoaded', async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement; // Correct type assertion
    const uploadButton = document.getElementById('uploadButton') as HTMLButtonElement;
    const fieldsContainer = document.getElementById('fieldsContainer') as HTMLDivElement;
    const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement; // API Key Input
    let currentSelectedIndex = 0;
    let data = [];

    uploadButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value;
        if (!apiKey) {
            alert("Please enter the API key.");
            return;
        }

        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileId = await uploadFileGPT(apiKey, file);
            console.log(fileId);

            const reader = new FileReader();
            reader.onload = async (e) => {
                if (e.target && e.target.result && typeof e.target.result === 'string') {
                    try {
                        const fileContent = JSON.parse(e.target.result);
                        fieldsContainer.innerHTML = '';

                        const uniqueFields = Object.keys(fileContent[0]);

                        // Display a loading message
                        fieldsContainer.innerHTML = '<p>Loading GPT response...</p>';

                        for (const field of uniqueFields) {
                            try {
                                const response = await fetchOpenAI(apiKey, fileId, field);
                                const parsedResponse = extractAndParseJSON(response);
                                const bins = parsedResponse.bins
                                console.log({ "fieldName": field, "bins": bins });
                                data.push({ "fieldName": field, "bins": bins });
                            } catch (error) {
                                console.error('Error:', error);
                                fieldsContainer.innerHTML = '<p>Error loading data.</p>';
                                break; // Break out of the loop on error
                            }
                        }

                        function createTree(data) {
                            const ul = document.createElement('ul');
                            data.forEach((item, index) => {
                                const fieldLi = document.createElement('li');
                                fieldLi.classList.add('tree-item', 'field-item');
                                fieldLi.textContent = item.fieldName;
                                fieldLi.id = 'field-item-' + index;
                        
                                // Create sublist for bins
                                const binsUl = document.createElement('ul');
                                binsUl.classList.add('hidden', 'bins-list');
                                item.bins.forEach((bin, binIndex) => {
                                    const binLi = document.createElement('li');
                                    if (binIndex !== 0) {
                                        binLi.classList.add('hidden');
                                    }
                                    binLi.classList.add('bin-item');
                                    binLi.textContent = bin.bin_name;
                        
                                    // Create a sublist for bin reasoning and pred information
                                    const detailsUl = document.createElement('ul');
                                    detailsUl.classList.add('hidden', 'details-list');
                        
                                    const reasoningLi = document.createElement('li');
                                    reasoningLi.textContent = 'Reasoning: ' + bin.pred.reasoning;
                                    detailsUl.appendChild(reasoningLi);
                        
                                    const predLi = document.createElement('li');
                                    predLi.textContent = 'Pred: ' + JSON.stringify(bin.pred);
                                    detailsUl.appendChild(predLi);
                        
                                    binLi.appendChild(detailsUl);
                                    binsUl.appendChild(binLi);
                                });
                        
                                fieldLi.appendChild(binsUl);
                                ul.appendChild(fieldLi);
                            });
                            return ul;
                        }

                        function updateSelection(index) {
                            const allFields = fieldsContainer.querySelectorAll('.field-item');
                        
                            // Check if the index is within the valid range
                            if (index >= 0 && index < allFields.length) {
                                // Remove 'selected' class from all fields
                                allFields.forEach(item => {
                                    item.classList.remove('selected');
                                });
                        
                                // Add 'selected' class to the new active field
                                const selectedField = document.getElementById('field-item-' + index);
                                if (selectedField) {
                                    selectedField.classList.add('selected');
                                    currentSelectedIndex = index; // Update the current index
                                }
                            }
                        }
                        
                        function toggleVisibility(element) {
                            if (element) {
                                element.classList.toggle('hidden');
                            }
                        }

                        fieldsContainer.appendChild(createTree(data));
                        updateSelection(currentSelectedIndex);
                        
                        let currentLevel = 'field'; // Possible values: 'field', 'bin', 'details'

                        document.addEventListener('keydown', (e) => {
                            const selectedField = document.getElementById('field-item-' + currentSelectedIndex);
                            const binsList = selectedField.querySelector('.bins-list');
                            let selectedBin = binsList.querySelector('.bin-item:not(.hidden)');
                            let detailsList = selectedBin ? selectedBin.querySelector('.details-list') : null;
                            const totalFields = data.length;
                        
                            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                if (currentLevel === 'field') {
                                    // Navigate between fields
                                    currentSelectedIndex = (e.key === 'ArrowRight') 
                                        ? (currentSelectedIndex + 1) % totalFields
                                        : (currentSelectedIndex - 1 + totalFields) % totalFields;
                                    updateSelection(currentSelectedIndex);
                                    currentLevel = 'field';
                                } else if (currentLevel === 'bin') {
                                    // Navigate between bins
                                    const nextBin = (e.key === 'ArrowRight') 
                                        ? selectedBin.nextElementSibling 
                                        : selectedBin.previousElementSibling;
                                    if (nextBin) {
                                        selectedBin.classList.add('hidden');
                                        nextBin.classList.remove('hidden');
                                        selectedBin = nextBin; // Update selectedBin to the new bin
                                    }
                                }
                            } else if (e.key === 'ArrowDown') {
                                if (currentLevel === 'field' && binsList.classList.contains('hidden')) {
                                    binsList.classList.remove('hidden');
                                    currentLevel = 'bin';
                                } else if (currentLevel === 'bin' && detailsList && detailsList.classList.contains('hidden')) {
                                    detailsList.classList.remove('hidden');
                                    currentLevel = 'details';
                                }
                            } else if (e.key === 'ArrowUp') {
                                if (currentLevel === 'details' && detailsList && !detailsList.classList.contains('hidden')) {
                                    detailsList.classList.add('hidden');
                                    currentLevel = 'bin';
                                } else if (currentLevel === 'bin' && !binsList.classList.contains('hidden')) {
                                    binsList.classList.add('hidden');
                                    currentLevel = 'field';
                                }
                            }
                        });
                        
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        fieldsContainer.innerHTML = '<p>Error processing file.</p>';
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
                        `For the ${field} in the data, please create a way of breaking down this data in a non-obvious way that 
                        includes the semantic meaning of the data with the following JSON format.
            
                        {bins: [
                                {
                                    "bin_name": [insert bin name],
                                    "pred": {
                                        [fill in predicate information]
                                    }
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

function extractAndParseJSON(text: string) {
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