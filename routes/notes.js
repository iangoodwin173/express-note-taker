const notes = require('express').Router(); 
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

notes.get('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteID);
      return result.length > 0
        ? res.json(result)
        : res.json('there is no note that has that ID');
    });
});

notes.delete('/:id', (req, res) => {
  const noteID = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      
      const result = json.filter((note) => note.id != noteID);

      
      writeToFile('./db/db.json', result);

      
      res.json(`Item ${noteID} has been deleted 🗑️`);
    });
});

notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json');

      const response = {
        status: 'success',
        body: newNote
      }

      res.json(response);
    } else {
      res.error('Error in adding note');
    }
})



module.exports = notes;