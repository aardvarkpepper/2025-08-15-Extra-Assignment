const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

let pseudoAPIKey = 'blur';

const menuOptions = "'/' to see 'You have reached My amazing App?" + '<br/>' + "'/api/' to see 'Welcome to my API" + '<br/>' + "'/api/dashboard' to see 'This is the Admin Dashboard'" + '<br/>' + "'/api/profile' to see 'This is the API Profile Screen'" + '<br/>' + "'/api/jigglypuff' to see 'Tishana is correct, Jigglypuff IS the best Pokémon'" + '<br/>' + "=======================" + '<br/>' + "'/api/set' to activate the pseudo-API key" + '<br/>' + "'/api/remove' to deactivate the pseudo-API key" + '<br/>' + "'/api/locked' to see a different message depending on whether the pseudo-API key is activated or inactivated" + '<br/>' + "'/api/greetings/:userName' to see 'Hello, :userName!' (substitute a name for ':username')" + '<br/>' +"'/api/8ball' to battle a couple wild Pokemon because that's Pokéballs are like 8 balls, just go with it and have fun." // apparently the reading is set to HTML encoding or whatever, so \n escape characters don't work, but <br/> does.

const jigglypuff = { name: 'Jigglypuff', hitPoints: 60, attack: ['Bodyslam', 40] };
const rattata = { name: 'Rattata', hitPoints: 30, attack: ['Tackle', 25] };
const pidgey = { name: 'Pidgey', hitPoints: 50, attack: ['Gust', 40] };
const wildPokemon = [rattata, pidgey];
let currentPokemonIndex = 0;
const assignPokemon = () => {
  const randomIndex = Math.floor(Math.random() * wildPokemon.length);
  currentPokemon = wildPokemon[randomIndex];
}

const menu = 

app.get('/', (req, res) => {
  res.send('You have reached My amazing App?' + '<br>' + '<br>' + menuOptions);
});

const myLoggerMiddleware = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`${jigglypuff.name} currently has ${jigglypuff.hitPoints} hit points.`);
  next();
};

const setAPIKey = (req, res, next) => {
  // console.log('req', req);
  req['x-api-key'] = pseudoAPIKey;
  next();
}


// app.use should not trigger on /, I think.
app.use(myLoggerMiddleware);
app.use(setAPIKey);

app.use((req, res, next) => {
  console.log(`Request received at ${req.requestTime}`);
  next();
});

app.get('/api/', (req, res) => {
  res.status(200).send(`Welcome to my API` + '<br>' + '<br>' + menuOptions);
});

app.get('/api/dashboard', (req, res) => {
  res.status(200).send(`This is the Admin Dashboard` + '<br>' + '<br>' + menuOptions);
});

app.get('/api/profile', (req, res) => {
  res.status(200).send(`This is the API Profile Screen` + '<br>' + '<br>' + menuOptions);
});

app.get('/api/jigglypuff', (req, res) => {
  res.status(200).send(`Tishana is correct, Jigglypuff IS the best Pokémon` + '<br>' + '<br>' + menuOptions)
});

app.get('/api/set', (req, res) => {
  pseudoAPIKey = 'supersecretkey';
  res.status(200).send(`Pseudo-API key activated.` + '<br>' + '<br>' + menuOptions)
  // or just res.send a string, eh?
});

app.get('/api/remove', (req, res) => {
  pseudoAPIKey = '';
  res.status(200).send('Pseudo-API key deactivated.' + '<br>' + '<br>' + menuOptions)
});

app.get('/api/locked', (req, res) => {
  if (req['x-api-key'] === 'supersecretkey') {
    res.status(200).send('You have brought yummy persimmons.  If you do not wish to share persimmons, please log out at /api/remove' + '<br>' + '<br>' + menuOptions)
  } else {
    res.status(403).send('Request failed due to insufficient persimmons(?)  Please log in at /api/set.' + '<br>' + '<br>' + menuOptions)
  }
});

// /api/greetings/Hamster Huey
app.get('/api/greetings/:userName', (req, res) => {
  // const userNameParam = req.params.userName;
  res.status(200).send(`Hello, ${req.params.userName}!` + '<br>' + '<br>' + menuOptions);
})

const combat = () => {
  let returnString = "";
  if (currentPokemonIndex >= wildPokemon.length) {
    console.log('Out of wild Pokemon');
    returnString += `${jigglypuff.name} is at ${jigglypuff.hitPoints}!  No wild Pokemon remain!`
  } else {
    returnString += `${jigglypuff.name} has used ${jigglypuff.attack[0]} on ${wildPokemon[currentPokemonIndex].name} doing ${jigglypuff.attack[1]} damage!`;
    wildPokemon[currentPokemonIndex].hitPoints -= jigglypuff.attack[1];
    if (wildPokemon[currentPokemonIndex].hitPoints < 0) {
      returnString += (`<br/>` + `${wildPokemon[currentPokemonIndex].name} has been knocked out!`)
      currentPokemonIndex++;
      if (currentPokemonIndex < wildPokemon.length) {
        returnString += (`<br/>` + `A wild ${wildPokemon[currentPokemonIndex].name} has appeared!`)
      } else {
        returnString += (`<br/>` + 'No more wild Pokemon remain!')
      }
    } else {
      returnString += `${wildPokemon[currentPokemonIndex].name} has used ${wildPokemon[currentPokemonIndex].attack[0]} doing ${wildPokemon[currentPokemonIndex].attack[1]} damage!`
      jigglypuff.hitPoints -= wildPokemon[currentPokemonIndex].attack[1];
      returnString += `${jigglypuff.name} has ${jigglypuff.hitPoints} hit points remaining!`
    }
  }
  return returnString;
}

app.get('/api/8ball', (req, res) => {
  res.status(200).send(`Magic 8-ball says ${combat()}` + '<br>' + '<br>' + menuOptions);
})


//Profile Screen", and D. /api/jigglypuff that shows "Tishana is correct, Jigglypuff IS the best Pokémon". REMEMBER to add an error message if person is FORBIDDEN
// a /greetings route that takes the name in the URL and says "Hello, <person name>!"
// a /8ball route that generates a "Magic 8 ball" like message. Don't know what that is? check out this site: Magic 8-Ball
// a  set of /boss routes that uses middleware to check if you are the boss before allowing you to get to the /boss/dashboard , /boss/profile , and /boss/destruction routes. Be creative with these... ALL BOSS ROUTES SHOULD BE LOGGED WITH TIMESTAMP

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});