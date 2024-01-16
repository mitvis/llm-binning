import fs from 'fs';
import csv from 'csv-parser';

export async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        let data = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', reject);
    });
}