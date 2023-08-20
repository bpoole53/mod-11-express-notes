const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
app.use(express.static('public'));
const noteData = require('./db/db.json')

//initialize so the index.html page is loaded first
app.get('/', (req, res) => res.send('Navigate to /notes'));

//create a route to notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//have the server listen at port 3001
app.listen(PORT, () =>
  console.log(`Notes app listening at http://localhost:${PORT}`)
);

//add Middleware for parsing app/json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    console.log(title)
    console.log(text)
    const newNote = {
        title,
        text
    };   
    console.info(`${req.method} request received`);
    res.json(newNote);
    console.log(newNote);
  });

app.get('/api/notes', (req, res) => res.json(noteData));
console.log(noteData);