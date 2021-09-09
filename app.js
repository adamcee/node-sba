import express, { json } from 'express';
import fs from 'fs';


console.log('program start');

// create our express app server
const app = express();
const PORT = 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/animals', (req, res) => {
  console.log(req.method + " " + req.path);
  console.log('request params ', req.query);

  // same as const query = req.query;
  const { query } = req; 
  console.log('query obj ', query);

  const searchTerm = query.q;
  console.log('search term is ', searchTerm);

  const ANIMALS_LIST_URL = "https://gist.githubusercontent.com/atduskgreg/3cf8ef48cb0d29cf151bedad81553a54/raw/82f142562cf50b0f6fb8010f890b2f934093553e/animals.txt";
  fetch(ANIMALS_LIST_URL)
    .then(data => {
      console.log('GOT DATA from web ', data);

    })


  fs.readFile('./animals-list.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const animals = data.split('\n');

    // When the `q` query param is in the URL, return the list of animals
    if (searchTerm) {
      const desiredAnimals = animals.filter(animal => {
        const animalLowercase = animal.toLowerCase()
        return animalLowercase.includes(searchTerm.toLowerCase());
      });

      console.log('desired animals ', desiredAnimals);
      res.send(desiredAnimals);
    }
    // If there is no q query param, return the whole list
    else {
      res.send(animals);
    }
  });
});

app.post('/animals', (req, res) => {
  console.log(req.method + " " + req.path);
  console.log('request body ', req.body);

  const newAnimal = req.body[0];

  console.log('new animal ', newAnimal)

  const ANIMALS_FILE_PATH = './animals-list.txt'

  fs.writeFile(ANIMALS_FILE_PATH, newAnimal, { flag: 'a+' }, (err) => {
    if(err) {
      console.log('error writing to file ', err);
    }

    console.log('success writing to file');

    res.redirect('/animals');
  })

});

app.listen(PORT, () => {
  console.log('server started on port ' + PORT);

});

