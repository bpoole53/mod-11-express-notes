const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const noteData = require('./db/db.json');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('public'));

//initialize so the index.html page is loaded first
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//create a route to notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//add Middleware for parsing app/json data
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//convert data to json
app.get('/api/notes', (req, res) => res.json(noteData));

//Destructure req.body into title and text variables and pass them into the newNote variable and then add a random id to newNote
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    const newNote = {
        title,
        text,
        id: uuidv4().split('-')[0],
    };   
    console.info(`${req.method} request received`);
    
    //add newNote object to the db.json array 
    noteData.push(newNote);
    //overwrite the existing db.json file with the updated and stringified array
    fs.writeFileSync('db/db.json', JSON.stringify(noteData))
    res.json(newNote);
});

//delete route to get the provided :id and then filter the array to keep anything that does not match the id variable. Then overwrite the db.json file with the remaining data.
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const updateDb = noteData.filter((note) => note.id != id);
    fs.writeFileSync('db/db.json', JSON.stringify(updateDb))
    res.json(updateDb)
})

//have the server listen at port 3001
app.listen(PORT, () =>
  console.log(`Notes app listening at http://localhost:${PORT}`)
);
