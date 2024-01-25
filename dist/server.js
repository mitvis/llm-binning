"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const sync_1 = require("csv-parse/sync");
const llm_1 = require("./llm");
const parse_json_1 = require("./utils/parse_json");
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable CORS for all routes
const PORT = 3000;
const datasetsDir = path_1.default.join(__dirname, '../datasets');
app.use(express_1.default.static('./main.ts'));
app.use(express_1.default.json()); // Parse JSON bodies
app.get('/datasets/:datasetName/fields', (req, res) => {
    const datasetName = req.params.datasetName;
    const datasetPath = path_1.default.join(datasetsDir, datasetName);
    fs_1.default.readFile(datasetPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading dataset');
            return;
        }
        try {
            let fields = [];
            // Check the file extension to determine the format
            if (datasetPath.endsWith('.json')) {
                const jsonData = JSON.parse(data);
                fields = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
            }
            else if (datasetPath.endsWith('.csv')) {
                const records = (0, sync_1.parse)(data, { to_line: 1 });
                fields = records[0];
                console.log(records[0]);
            }
            res.json(fields); // Send the field names
        }
        catch (parseError) {
            res.status(500).send('Error parsing data');
        }
    });
});
app.get('/datasets', (req, res) => {
    fs_1.default.readdir(datasetsDir, (err, files) => {
        if (err) {
            res.status(500).send('Error reading directory');
            return;
        }
        res.json(files);
    });
});
app.post('/bin', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dataset, field } = req.body;
    try {
        const field_bins = yield (0, llm_1.fetchGPTResponse)(dataset, field);
        const response = (0, parse_json_1.extractAndParseJSON)(field_bins);
        res.json({ response });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error processing GPT request');
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
