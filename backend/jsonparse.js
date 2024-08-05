const fs = require('fs');

fs.readFile('data/data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        console.log('Parsed JSON:', jsonData);
    } catch (e) {
        console.error('Error parsing JSON:', e);
    }
});
