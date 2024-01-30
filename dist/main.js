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
    var fileInput, uploadButton, fieldsContainer, apiKeyInput, currentSelectedIndex, data;
    var _this = this;
    return __generator(this, function (_a) {
        fileInput = document.getElementById('fileInput');
        uploadButton = document.getElementById('uploadButton');
        fieldsContainer = document.getElementById('fieldsContainer');
        apiKeyInput = document.getElementById('apiKeyInput');
        currentSelectedIndex = 0;
        data = [];
        uploadButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var apiKey, file, fileId_1, reader;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiKey = apiKeyInput.value;
                        if (!apiKey) {
                            alert("Please enter the API key.");
                            return [2 /*return*/];
                        }
                        if (!(fileInput.files && fileInput.files.length > 0)) return [3 /*break*/, 2];
                        file = fileInput.files[0];
                        return [4 /*yield*/, uploadFileGPT(apiKey, file)];
                    case 1:
                        fileId_1 = _a.sent();
                        console.log(fileId_1);
                        reader = new FileReader();
                        reader.onload = function (e) { return __awaiter(_this, void 0, void 0, function () {
                            function createTree(data) {
                                var ul = document.createElement('ul');
                                data.forEach(function (item, index) {
                                    var fieldLi = document.createElement('li');
                                    fieldLi.classList.add('tree-item', 'field-item');
                                    fieldLi.textContent = item.fieldName;
                                    fieldLi.id = 'field-item-' + index;
                                    // Create sublist for bins
                                    var binsUl = document.createElement('ul');
                                    binsUl.classList.add('hidden', 'bins-list');
                                    item.bins.forEach(function (bin, binIndex) {
                                        var binLi = document.createElement('li');
                                        if (binIndex !== 0) {
                                            binLi.classList.add('hidden');
                                        }
                                        binLi.classList.add('bin-item');
                                        binLi.textContent = bin.bin_name;
                                        // Create a sublist for bin reasoning and pred information
                                        var detailsUl = document.createElement('ul');
                                        detailsUl.classList.add('hidden', 'details-list');
                                        var reasoningLi = document.createElement('li');
                                        reasoningLi.textContent = 'Reasoning: ' + bin.pred.reasoning;
                                        detailsUl.appendChild(reasoningLi);
                                        var predLi = document.createElement('li');
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
                                var allFields = fieldsContainer.querySelectorAll('.field-item');
                                // Check if the index is within the valid range
                                if (index >= 0 && index < allFields.length) {
                                    // Remove 'selected' class from all fields
                                    allFields.forEach(function (item) {
                                        item.classList.remove('selected');
                                    });
                                    // Add 'selected' class to the new active field
                                    var selectedField = document.getElementById('field-item-' + index);
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
                            var fileContent, uniqueFields, _i, uniqueFields_1, field, response, parsedResponse, bins, error_1, currentLevel_1, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(e.target && e.target.result && typeof e.target.result === 'string')) return [3 /*break*/, 9];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 8, , 9]);
                                        fileContent = JSON.parse(e.target.result);
                                        fieldsContainer.innerHTML = '';
                                        uniqueFields = Object.keys(fileContent[0]);
                                        // Display a loading message
                                        fieldsContainer.innerHTML = '<p>Loading GPT response...</p>';
                                        _i = 0, uniqueFields_1 = uniqueFields;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < uniqueFields_1.length)) return [3 /*break*/, 7];
                                        field = uniqueFields_1[_i];
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, fetchOpenAI(apiKey, fileId_1, field)];
                                    case 4:
                                        response = _a.sent();
                                        parsedResponse = extractAndParseJSON(response);
                                        bins = parsedResponse.bins;
                                        console.log({ "fieldName": field, "bins": bins });
                                        data.push({ "fieldName": field, "bins": bins });
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_1 = _a.sent();
                                        console.error('Error:', error_1);
                                        fieldsContainer.innerHTML = '<p>Error loading data.</p>';
                                        return [3 /*break*/, 7]; // Break out of the loop on error
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 7:
                                        fieldsContainer.appendChild(createTree(data));
                                        updateSelection(currentSelectedIndex);
                                        currentLevel_1 = 'field';
                                        document.addEventListener('keydown', function (e) {
                                            var selectedField = document.getElementById('field-item-' + currentSelectedIndex);
                                            var binsList = selectedField.querySelector('.bins-list');
                                            var selectedBin = binsList.querySelector('.bin-item:not(.hidden)');
                                            var detailsList = selectedBin ? selectedBin.querySelector('.details-list') : null;
                                            var totalFields = data.length;
                                            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                                if (currentLevel_1 === 'field') {
                                                    // Navigate between fields
                                                    currentSelectedIndex = (e.key === 'ArrowRight')
                                                        ? (currentSelectedIndex + 1) % totalFields
                                                        : (currentSelectedIndex - 1 + totalFields) % totalFields;
                                                    updateSelection(currentSelectedIndex);
                                                    currentLevel_1 = 'field';
                                                }
                                                else if (currentLevel_1 === 'bin') {
                                                    // Navigate between bins
                                                    var nextBin = (e.key === 'ArrowRight')
                                                        ? selectedBin.nextElementSibling
                                                        : selectedBin.previousElementSibling;
                                                    if (nextBin) {
                                                        selectedBin.classList.add('hidden');
                                                        nextBin.classList.remove('hidden');
                                                        selectedBin = nextBin; // Update selectedBin to the new bin
                                                    }
                                                }
                                            }
                                            else if (e.key === 'ArrowDown') {
                                                if (currentLevel_1 === 'field' && binsList.classList.contains('hidden')) {
                                                    binsList.classList.remove('hidden');
                                                    currentLevel_1 = 'bin';
                                                }
                                                else if (currentLevel_1 === 'bin' && detailsList && detailsList.classList.contains('hidden')) {
                                                    detailsList.classList.remove('hidden');
                                                    currentLevel_1 = 'details';
                                                }
                                            }
                                            else if (e.key === 'ArrowUp') {
                                                if (currentLevel_1 === 'details' && detailsList && !detailsList.classList.contains('hidden')) {
                                                    detailsList.classList.add('hidden');
                                                    currentLevel_1 = 'bin';
                                                }
                                                else if (currentLevel_1 === 'bin' && !binsList.classList.contains('hidden')) {
                                                    binsList.classList.add('hidden');
                                                    currentLevel_1 = 'field';
                                                }
                                            }
                                        });
                                        return [3 /*break*/, 9];
                                    case 8:
                                        error_2 = _a.sent();
                                        console.error('Error parsing JSON:', error_2);
                                        fieldsContainer.innerHTML = '<p>Error processing file.</p>';
                                        return [3 /*break*/, 9];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); };
                        reader.readAsText(file);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
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
function fetchOpenAI(apiKey, fileId, field) {
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
                            instructions: "Please analyze the uploaded dataset. For a field in the dataset, you will format all of it's binnings \n                using the Vega-Lite predicate formatting. For a bin, a field must be provided along with one of \n                the predicate properties: equal, lt (less than), lte (less than or equal), gt (greater than), \n                gte (greater than or equal), range, or oneOf.\n                \n                For example, if we have:\n\n                {\n                    \"field\": \"Displacement\",\n                    \"field_bins\": [\"Compact\", \"Mid-Size\", \"Full-Size\"]\n                },\n                \n                You should output:\n                \n                { bins: [\n                        {\n                            \"bin_name\": \"Compact\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"lte\": 100,\n                            \"reasoning\": [insert detailed reasoning for bin and its boundaries]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"Mid-Size\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"range\": [101, 150],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"Full-Size\",\n                            \"pred\": {\n                            \"field\": \"Displacement\",\n                            \"gt\": 150,\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        }\n                    ]\n                }\n\n                Another example, if we have:\n\n                {\n                    \"field\": \"car_origin\",\n                    \"field_bins\": [\"Japan\", \"USA\", \"France\"]\n                },\n                \n                You should output:\n                \n                { bins: [\n                        {\n                            \"bin_name\": \"Japan\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"nissan\", \"lexus\"],\n                            \"reasoning\": [insert detailed reasoning for bin and its boundaries]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"USA\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"ford\", \"ram\"],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        },\n                        {\n                            \"bin_name\": \"France\",\n                            \"pred\": {\n                            \"field\": \"car_origin\",\n                            \"oneOf\": [\"renault\", \"citroen\"],\n                            \"reasoning\": [insert detailed reasoning for bin]\n                            }\n                        }\n                    ]\n                }",
                            model: "gpt-4-1106-preview",
                            tools: [{ "type": "retrieval" }],
                            file_ids: [fileId]
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
                                        { "role": "user",
                                            "content": "For the ".concat(field, " in the data, please create a way of breaking down this data in a non-obvious way that \n                        includes the semantic meaning of the data with the following JSON format.\n            \n                        {bins: [\n                                {\n                                    \"bin_name\": [insert bin name],\n                                    \"pred\": {\n                                        [fill in predicate information]\n                                    }\n                                }\n                            ]\n                        }\n                        \n                        ")
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
    var jsonPattern = /```json([\s\S]*?)```/; // Regular expression to match JSON block
    var match = jsonPattern.exec(text);
    if (match && match[1]) {
        try {
            var jsonString = match[1].trim();
            var jsonData = JSON.parse(jsonString);
            return jsonData;
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    }
    else {
        console.log('No JSON found in the text.');
        return null;
    }
}
