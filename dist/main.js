// import * as jsoncParser from 'jsonc-parser';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener('DOMContentLoaded', function () { return __awaiter(_this, void 0, void 0, function () {
    var fileDropdown, uploadButton, fieldsContainer, instructionsContainer, apiKeyInput;
    var _this = this;
    return __generator(this, function (_a) {
        fileDropdown = document.getElementById('fileDropdown');
        uploadButton = document.getElementById('uploadButton');
        fieldsContainer = document.getElementById('fieldsContainer');
        instructionsContainer = document.getElementById('instructionsContainer');
        apiKeyInput = document.getElementById('apiKeyInput');
        uploadButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var apiKey, selectedFile;
            var _this = this;
            return __generator(this, function (_a) {
                instructionsContainer.innerHTML = '<p>To get the bins for a field, please click on the checkbox for that field.<p/>';
                apiKey = apiKeyInput.value;
                if (!apiKey) {
                    alert("Please enter the API key.");
                    return [2 /*return*/];
                }
                selectedFile = fileDropdown.value;
                if (selectedFile) {
                    fetch(selectedFile, { headers: { 'Access-Control-Allow-Origin': '*' } })
                        .then(function (response) { return response.json(); })
                        .then(function (fileContent) { return __awaiter(_this, void 0, void 0, function () {
                        var uniqueFields;
                        var _this = this;
                        return __generator(this, function (_a) {
                            console.log(fileContent);
                            fieldsContainer.innerHTML = '';
                            uniqueFields = Object.keys(fileContent[0]);
                            uniqueFields.forEach(function (field) {
                                // Create checkbox for each field
                                var checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.id = field;
                                checkbox.name = field;
                                // Create label for checkbox
                                var label = document.createElement('label');
                                label.htmlFor = field;
                                label.textContent = field;
                                // Create container for the response
                                var responseContainer = document.createElement('div');
                                responseContainer.id = "response-".concat(field);
                                // Append checkbox, label, and response container to fieldsContainer
                                fieldsContainer.appendChild(checkbox);
                                fieldsContainer.appendChild(label);
                                fieldsContainer.appendChild(responseContainer);
                                fieldsContainer.appendChild(document.createElement('br'));
                                // Event listener for checkbox
                                checkbox.addEventListener('change', function (event) { return __awaiter(_this, void 0, void 0, function () {
                                    var fieldValues, response, parsedResponse, bins_1, binsContainer_1, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!checkbox.checked) return [3 /*break*/, 5];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                responseContainer.innerHTML = "Loading GPT Response";
                                                fieldValues = getUniqueValues(fileContent, field);
                                                console.log(fieldValues);
                                                return [4 /*yield*/, fetchOpenAI(apiKey, fieldValues, field)];
                                            case 2:
                                                response = _a.sent();
                                                parsedResponse = extractAndParseJSON(response);
                                                bins_1 = parsedResponse.bins;
                                                console.log(bins_1);
                                                binsContainer_1 = document.createElement('div');
                                                binsContainer_1.id = 'binsContainer';
                                                // Iterate over the bins and create a button for each
                                                bins_1.forEach(function (bin, index) {
                                                    // Create a container for each bin's buttons
                                                    var binButtonContainer = document.createElement('div');
                                                    // Calculate the bin index label, like "1/3"
                                                    var binIndexLabel = "".concat(index + 1, " of ").concat(bins_1.length, ". ");
                                                    // Create a label for the bin
                                                    var binLabel = document.createElement('label');
                                                    binLabel.textContent = binIndexLabel + "".concat(field, " bin titled ").concat(bin.bin_name, ".");
                                                    binButtonContainer.appendChild(binLabel);
                                                    binButtonContainer.appendChild(document.createElement('br')); // Line break for better formatting
                                                    // Create button for showing reasoning
                                                    var reasoningButton = document.createElement('button');
                                                    reasoningButton.textContent = "Show description for ".concat(bin.bin_name);
                                                    // Create a paragraph element to display the reasoning
                                                    var reasoningText = document.createElement('p');
                                                    reasoningText.id = "reasoning-".concat(bin.bin_name);
                                                    reasoningText.style.display = 'none'; // Initially hide the reasoning text
                                                    reasoningButton.addEventListener('click', function () {
                                                        // Toggle visibility of the reasoning text
                                                        if (reasoningText.style.display === 'none') {
                                                            reasoningButton.textContent = "Hide description for ".concat(bin.bin_name);
                                                            reasoningText.style.display = 'block';
                                                            reasoningText.textContent = bin.pred.reasoning;
                                                        }
                                                        else {
                                                            reasoningButton.textContent = "Show description for ".concat(bin.bin_name);
                                                            reasoningText.style.display = 'none';
                                                            reasoningText.textContent = '';
                                                        }
                                                    });
                                                    binButtonContainer.appendChild(reasoningButton);
                                                    binButtonContainer.appendChild(reasoningText);
                                                    // Create button for showing values
                                                    var valuesButton = document.createElement('button');
                                                    valuesButton.textContent = "Show data values in ".concat(bin.bin_name);
                                                    // Create a paragraph element to display the values
                                                    var valuesText = document.createElement('p');
                                                    valuesText.id = "values-".concat(bin.bin_name);
                                                    valuesText.style.display = 'none'; // Initially hide the values text
                                                    var table = document.createElement('table');
                                                    table.id = "table_values-".concat(bin.bin_name);
                                                    table.style.display = 'none'; // Initially hide the values text
                                                    // Create table header
                                                    var headerRow = document.createElement('tr');
                                                    uniqueFields.forEach(function (col) {
                                                        var headerCell = document.createElement('th');
                                                        headerCell.textContent = col;
                                                        headerRow.appendChild(headerCell);
                                                    });
                                                    table.appendChild(headerRow);
                                                    valuesButton.addEventListener('click', function () {
                                                        // Toggle visibility of the values text
                                                        if (valuesText.style.display === 'none') {
                                                            valuesButton.textContent = "Hide data values in ".concat(bin.bin_name);
                                                            valuesText.style.display = 'block';
                                                            table.style.display = 'table';
                                                            console.log(getDataValues(fileContent, bin.pred));
                                                            var values = getDataValues(fileContent, bin.pred);
                                                            var op = Object.keys(bin.pred).filter(function (item) { return item !== "field" && item !== "reasoning"; })[0];
                                                            valuesText.textContent = "Number of values in ".concat(bin.bin_name, " bin: ").concat(values.length, ". \n");
                                                            valuesText.textContent += getBoundaryDescription(bin.pred);
                                                            // Clear previous rows
                                                            while (table.rows.length > 1) {
                                                                table.deleteRow(1);
                                                            }
                                                            // Create data rows
                                                            values.forEach(function (item) {
                                                                var row = document.createElement('tr');
                                                                uniqueFields.forEach(function (col) {
                                                                    var cell = document.createElement('td');
                                                                    cell.textContent = item[col] || ''; // Handle missing data
                                                                    row.appendChild(cell);
                                                                });
                                                                table.appendChild(row);
                                                            });
                                                        }
                                                        else {
                                                            valuesButton.textContent = "Show data values in ".concat(bin.bin_name);
                                                            valuesText.style.display = 'none';
                                                            table.style.display = 'none';
                                                            valuesText.textContent = '';
                                                        }
                                                    });
                                                    binButtonContainer.appendChild(valuesButton);
                                                    binButtonContainer.appendChild(valuesText);
                                                    binButtonContainer.appendChild(table);
                                                    binsContainer_1.appendChild(binButtonContainer);
                                                });
                                                // Display response - Modify according to your actual response format
                                                responseContainer.innerHTML = "";
                                                responseContainer.appendChild(binsContainer_1);
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_1 = _a.sent();
                                                console.error('Error:', error_1);
                                                responseContainer.innerHTML = '<p>Error processing field.</p>';
                                                return [3 /*break*/, 4];
                                            case 4: return [3 /*break*/, 6];
                                            case 5:
                                                // Clear the response container if the checkbox is unchecked
                                                responseContainer.innerHTML = '';
                                                _a.label = 6;
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                }); });
                            });
                            return [2 /*return*/];
                        });
                    }); })
                        .catch(function (error) {
                        console.error('Error fetching the file:', error);
                        fieldsContainer.innerHTML = '<p>Error loading file.</p>';
                    });
                }
                else {
                    alert("Please select a file.");
                }
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
function getUniqueValues(jsonArray, fieldName) {
    var uniqueValues = new Set();
    jsonArray.forEach(function (item) {
        if (item.hasOwnProperty(fieldName)) {
            uniqueValues.add(item[fieldName]);
        }
    });
    return Array.from(uniqueValues);
}
function uploadFileGPT(apiKey, file) {
    return __awaiter(this, void 0, void 0, function () {
        var formData, uploadDataset, responseData, fileId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    formData.append('purpose', 'assistants');
                    formData.append('file', file); // Assuming 'file' is a File object
                    return [4 /*yield*/, fetch('https://api.openai.com/v1/files', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(apiKey)
                            },
                            body: formData
                        })];
                case 1:
                    uploadDataset = _a.sent();
                    if (!uploadDataset.ok) {
                        throw new Error("HTTP error! Status: ".concat(uploadDataset.status));
                    }
                    return [4 /*yield*/, uploadDataset.json()];
                case 2:
                    responseData = _a.sent();
                    fileId = responseData.id;
                    return [2 /*return*/, fileId];
            }
        });
    });
}
function fetchOpenAI(apiKey, fieldValues, field) {
    return __awaiter(this, void 0, void 0, function () {
        var createAssistant, responseData, assistantId, sendMessage, runData, runId, threadId, checkRunStatus, getMessages, messages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://api.openai.com/v1/assistants', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(apiKey),
                            'OpenAI-Beta': 'assistants=v1'
                        },
                        body: JSON.stringify({
                            instructions: "Please analyze the uploaded dataset. For a field in the dataset, you will format all of it's binnings \n                using the Vega-Lite predicate formatting. For a bin, a field must be provided along with one of \n                the predicate properties: equal, lt (less than), lte (less than or equal), gt (greater than), \n                gte (greater than or equal), range, or oneOf to describe what data for that field belong in that bin.\n                \n                For example, if we have:\n\n                {\n                    \"field\": \"Displacement\",\n                    \"field_bins\": [\"Compact\", \"Mid-Size\", \"Full-Size\"]\n                },\n                \n                You should output:\n                \n                { bins: [\n                        {\n                            \"bin_name\": \"Compact\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"lte\": 100,\n                            \"reasoning\": [insert detailed reasoning for bin and its boundaries]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"Mid-Size\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"range\": [101, 150],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"Full-Size\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"gt\": 150,\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        }\n                    ]\n                }\n\n                Another example, if we have:\n\n                {\n                    \"field\": \"car_origin\",\n                    \"field_bins\": [\"Japan\", \"USA\", \"France\"]\n                },\n                \n                You should output:\n                \n                { bins: [\n                        {\n                            \"bin_name\": \"Japan\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"nissan\", \"lexus\"],\n                            \"reasoning\": [insert detailed reasoning for bin and its boundaries]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"USA\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"ford\", \"ram\"],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"France\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"renault\", \"citroen\"],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        }\n                    ]\n                }",
                            model: "gpt-4-1106-preview",
                            tools: [{ "type": "retrieval" }],
                            // file_ids: [fileId]
                        })
                    })];
                case 1:
                    createAssistant = _a.sent();
                    if (!createAssistant.ok) {
                        throw new Error("HTTP error! Status: ".concat(createAssistant.status));
                    }
                    return [4 /*yield*/, createAssistant.json()];
                case 2:
                    responseData = _a.sent();
                    assistantId = responseData.id;
                    console.log(assistantId);
                    return [4 /*yield*/, fetch("https://api.openai.com/v1/threads/runs", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(apiKey),
                                'OpenAI-Beta': 'assistants=v1'
                            },
                            body: JSON.stringify({
                                "assistant_id": "".concat(assistantId),
                                "thread": {
                                    "messages": [
                                        {
                                            "role": "user",
                                            "content": "\n                        Here are all the possible values for the ".concat(field, " field in the data:\n\n                        ").concat(fieldValues, ".\n                        ")
                                        },
                                        {
                                            "role": "user",
                                            "content": "Create a way of breaking down this data in a non-obvious way that includes the semantic meaning of the data with the following JSON format.\n                        Make sure the predicate can map directly to the earlier values.\n                        {\n                            bins : [\n                                {\n                                    bin_name: [insert bin name]\n                                    \"pred\" : {insert predicate information}\n                                }\n                            ]\n                        }\n                        "
                                        },
                                        {
                                            "role": "user",
                                            "content": "Make sure that you include your reasoning for each bin in pred part of the JSON or else I will kill you. Make sure that the JSON you \n                        output does not have comments or I will kill you.\n                        "
                                        }
                                    ]
                                }
                            })
                        })];
                case 3:
                    sendMessage = _a.sent();
                    if (!sendMessage.ok) {
                        throw new Error("HTTP error! Status: ".concat(sendMessage.status));
                    }
                    return [4 /*yield*/, sendMessage.json()];
                case 4:
                    runData = _a.sent();
                    runId = runData.id;
                    threadId = runData.thread_id;
                    console.log(runId);
                    console.log(threadId);
                    return [4 /*yield*/, fetch("https://api.openai.com/v1/threads/".concat(threadId, "/runs/").concat(runId), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(apiKey),
                                'OpenAI-Beta': 'assistants=v1'
                            }
                        })];
                case 5: return [4 /*yield*/, (_a.sent()).json()];
                case 6:
                    checkRunStatus = _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(checkRunStatus.status === "queued" || checkRunStatus.status === "in_progress")) return [3 /*break*/, 11];
                    console.log(checkRunStatus.status);
                    // Wait for 5 seconds before checking the status again
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 8:
                    // Wait for 5 seconds before checking the status again
                    _a.sent();
                    return [4 /*yield*/, fetch("https://api.openai.com/v1/threads/".concat(threadId, "/runs/").concat(runId), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(apiKey),
                                'OpenAI-Beta': 'assistants=v1'
                            }
                        })];
                case 9: return [4 /*yield*/, (_a.sent()).json()];
                case 10:
                    checkRunStatus = _a.sent();
                    return [3 /*break*/, 7];
                case 11:
                    ;
                    return [4 /*yield*/, fetch("https://api.openai.com/v1/threads/".concat(threadId, "/messages"), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(apiKey),
                                'OpenAI-Beta': 'assistants=v1'
                            }
                        })];
                case 12:
                    getMessages = _a.sent();
                    return [4 /*yield*/, getMessages.json()];
                case 13:
                    messages = _a.sent();
                    if (messages.data[0].content[0].type == "text") {
                        console.log(messages.data[0].content[0].text.value);
                        return [2 /*return*/, (messages.data[0].content[0].text.value)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function extractAndParseJSON(text) {
    // const jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    // const match = jsonPattern.exec(text);
    // if (match && match[1]) {
    //     try {
    //         const jsonString = match[1].trim();
    //         const jsonData = JSON.parse(jsonString);
    //         return jsonData;
    //     } catch (error) {
    //         console.error('Error parsing JSON:', error);
    //         return null;
    //     }
    // } else {
    //     console.log('No JSON found in the text.');
    //     return null;
    // }
    // Find the index of the first opening brace
    var startIndex = text.indexOf('{');
    if (startIndex === -1) {
        throw new Error("No JSON object found in the string");
    }
    var openBraces = 0;
    var endIndex = startIndex;
    // Iterate through the string to find the matching closing brace
    for (var i = startIndex; i < text.length; i++) {
        if (text[i] === '{') {
            openBraces++;
        }
        else if (text[i] === '}') {
            openBraces--;
            if (openBraces === 0) {
                endIndex = i;
                break;
            }
        }
    }
    if (openBraces !== 0) {
        throw new Error("Invalid JSON object");
    }
    // Extract the JSON string
    var jsonString = text.substring(startIndex, endIndex + 1);
    // Parse and return the JSON object
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        throw new Error("Invalid JSON format");
    }
}
function getDataValues(fileContent, pred) {
    var field = pred.field;
    var op = Object.keys(pred).filter(function (item) { return item !== "field" && item !== "reasoning"; })[0];
    console.log(op);
    console.log(pred[op]);
    switch (op) {
        case 'equal':
            console.log(fileContent.filter(function (item) { return [pred[op]].includes(item[field]); }));
            return fileContent.filter(function (item) { return [pred[op]].includes(item[field]); });
        case 'oneOf':
            console.log(fileContent.filter(function (item) { return pred[op].includes(item[field]); }));
            return fileContent.filter(function (item) { return pred[op].includes(item[field]); });
        case 'range':
            console.log(fileContent.filter(function (item) { return item[field] >= Number(pred[op][0]) && item[field] <= Number(pred[op][1]); }));
            return fileContent.filter(function (item) { return item[field] >= Number(pred[op][0]) && item[field] <= Number(pred[op][1]); });
        case 'lt':
            console.log(fileContent.filter(function (item) { return item[field] < Number(pred[op]); }));
            return fileContent.filter(function (item) { return item[field] < Number(pred[op]); });
        case 'lte':
            console.log(fileContent.filter(function (item) { return item[field] <= Number(pred[op]); }));
            return fileContent.filter(function (item) { return item[field] <= Number(pred[op]); });
        case 'gt':
            console.log(fileContent.filter(function (item) { return item[field] > Number(pred[op]); }));
            return fileContent.filter(function (item) { return item[field] > Number(pred[op]); });
        case 'gte':
            console.log(fileContent.filter(function (item) { return item[field] >= Number(pred[op]); }));
            return fileContent.filter(function (item) { return item[field] >= Number(pred[op]); });
    }
}
function getBoundaryDescription(pred) {
    var field = pred.field;
    var op = Object.keys(pred).filter(function (item) { return item !== "field" && item !== "reasoning"; })[0];
    console.log(op);
    console.log(pred[op]);
    switch (op) {
        case 'equal':
            return "Bin boundary is values equal to ".concat(pred[op], ".");
        case 'oneOf':
            return "Bin boundary is values equal to one of ".concat(pred[op], ".");
        case 'range':
            return "Bin boundary is values in the range ".concat(pred[op][0], " to ").concat(pred[op][1], ".");
        case 'lt':
            return "Bin boundary is values less than ".concat(pred[op], ".");
        case 'lte':
            return "Bin boundary is values less than or equal to ".concat(pred[op], ".");
        case 'gt':
            return "Bin boundary is values greater than ".concat(pred[op], ".");
        case 'gte':
            return "Bin boundary is values greater than or equal to ".concat(pred[op], ".");
    }
}
