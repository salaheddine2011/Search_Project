// server.js
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors'); // Importez le package cors
const fs = require('fs'); // Import File System module

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors())

const port = 5000;

// Function to read marques from file
function getMarquesFromFile(callback) {
    fs.readFile('marques.json', (err, data) => {
        if (err) {
            return callback(err);
        }
        try {
            const marques = JSON.parse(data);
            callback(null, marques);
        } catch (parseError) {
            callback(parseError);
        }
    });
}


app.get('/search', (req, res) => {
    const term = req.query.term;

    getMarquesFromFile((err, marques) => {
        if (err) {
            return res.status(500).send('Failed to read marques data');
        }

        if (!term) {
            // If no term is provided, return all marques
            return res.json(marques);
        }

        const process = exec('python search.py');

        process.stdin.write(JSON.stringify({ marques, term }));
        process.stdin.end();

        let results = '';
        process.stdout.on('data', (data) => {
            results += data;
        });

        process.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).send('Failed to execute search');
            }
            res.send(JSON.parse(results));
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
