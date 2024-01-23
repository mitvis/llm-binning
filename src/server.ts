import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import {parse} from 'csv-parse/sync';
import axios from 'axios';
import { makeJSON, fetchGPTResponse } from './llm';

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = 3000;
const datasetsDir = path.join(__dirname, '../datasets');

app.use(express.static('./main.ts'));
app.use(express.json()); // Parse JSON bodies

app.get('/datasets/:datasetName/fields', (req, res) => {
    const datasetName = req.params.datasetName;
    const datasetPath = path.join(datasetsDir, datasetName);

    fs.readFile(datasetPath, 'utf8', (err, data) => {
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
            } else if (datasetPath.endsWith('.csv')) {
                const records = parse(data, { to_line: 1 });
                fields = records[0];
            }

            res.json(fields); // Send the field names
        } catch (parseError) {
            res.status(500).send('Error parsing data');
        }
    });
});

app.get('/datasets', (req, res) => {
    fs.readdir(datasetsDir, (err, files) => {
        if (err) {
            res.status(500).send('Error reading directory');
            return;
        }
        res.json(files);
    });
});

app.post('/bin', express.json(), async (req, res) => {
    const { dataset, field } = req.body;

    try {
        const field_bins = await fetchGPTResponse(dataset, field);
        const response = await makeJSON(field_bins);
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing GPT request');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


