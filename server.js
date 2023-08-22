const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const noteData = require('./db/db.json');
const jsonPath = path.join(__dirname, "./db/db.json");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));

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

//convert data to json
app.get('/api/notes', (req, res) => res.json(noteData));
console.log(noteData);

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    console.log(title)
    console.log(text)
    const newNote = {
        title,
        text,
        id: uuidv4(),
    };   
    console.info(`${req.method} request received`);
    
    console.log(newNote);


    noteData.push(newNote);
    fs.writeFileSync('db/db.json', JSON.stringify(noteData))
    
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const updateDb = noteData.filter((note) => note.id != id);
    fs.writeFileSync('db/db.json', JSON.stringify(updateDb))
    res.json(updateDb)
})

