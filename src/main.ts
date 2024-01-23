const dropdown = document.getElementById('datasetDropdown') as HTMLSelectElement;

fetch('http://localhost:3000/datasets')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(datasets => {
        datasets.forEach((dataset: string) => {
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
    const selectedDataset = (event.target as HTMLSelectElement).value;
    console.log('Selected Dataset:', selectedDataset);
    // Here you can add more code to handle loading and displaying the selected dataset

    if (selectedDataset) {
        fetch(`http://localhost:3000/datasets/${selectedDataset}/fields`)
            .then(response => response.json())
            .then(fields => {
                const fieldsContainer = document.getElementById('fieldsContainer');
                if (fieldsContainer) { // Check if fieldsContainer is not null
                    fieldsContainer.innerHTML = ''; // Clear existing checkboxes

                    fields.forEach((field: string) => {
                        const label = document.createElement('label');
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = field;

                        label.appendChild(checkbox);
                        label.appendChild(document.createTextNode(field));
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
                                    // Process and display the GPT response
                                })
                                .catch(error => {
                                    console.error('Error:', error);
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



