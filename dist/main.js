"use strict";
const dropdown = document.getElementById('datasetDropdown');
fetch('http://localhost:3000/datasets')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
    .then(datasets => {
    datasets.forEach((dataset) => {
        const option = document.createElement('option');
        option.value = dataset;
        option.textContent = dataset;
        dropdown.appendChild(option);
    });
})
    .catch(error => {
    console.error('Error fetching datasets:', error);
});
dropdown.addEventListener('change', (event) => {
    const selectedDataset = event.target.value;
    console.log('Selected Dataset:', selectedDataset);
    // Here you can add more code to handle loading and displaying the selected dataset
    if (selectedDataset) {
        fetch(`http://localhost:3000/datasets/${selectedDataset}/fields`)
            .then(response => response.json())
            .then(fields => {
            const fieldsContainer = document.getElementById('fieldsContainer');
            if (fieldsContainer) { // Check if fieldsContainer is not null
                fieldsContainer.innerHTML = ''; // Clear existing checkboxes
                fields.forEach((field) => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    // const fieldDiv = document.createElement('div');
                    const responseDisplay = document.createElement('span'); // Element to display GPT response
                    checkbox.type = 'checkbox';
                    checkbox.value = field;
                    // label.appendChild()
                    // fieldsContainer.appendChild(fieldDiv);
                    // fieldDiv.appendChild(label);
                    // fieldDiv.appendChild(responseDisplay); // Append responseDisplay next to the checkbox
                    // fieldsContainer.appendChild(document.createElement('br'));
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(field));
                    // fieldDiv.appendChild(label);
                    label.appendChild(responseDisplay);
                    fieldsContainer.appendChild(label);
                    fieldsContainer.appendChild(document.createElement('br'));
                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) {
                            fetch('http://localhost:3000/bin', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    dataset: selectedDataset,
                                    field: field
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                console.log('GPT Response:', data.response);
                                responseDisplay.textContent = ` GPT Response: ${data.response.stringify}`; // Display GPT response
                            })
                                .catch(error => {
                                console.error('Error:', error);
                                responseDisplay.textContent = ` Error: ${error}`; // Display error if any
                            });
                        }
                    });
                });
            }
        })
            .catch(error => {
            console.error('Error fetching fields:', error);
        });
    }
});
