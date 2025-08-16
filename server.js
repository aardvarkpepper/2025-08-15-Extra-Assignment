const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

let pseudoAPIKey = 'blur';

const menuOptions = "'/' to see 'You have reached My amazing App?" + '<br/>' + "'/api/' to see 'Welcome to my API" + '<br/>' + "'/api/dashboard' to see 'This is the Admin Dashboard'" + '<br/>' + "'/api/profile' to see 'This is the API Profile Screen'" + '<br/>' + "'/api/jigglypuff' to see 'Tishana is correct, Jigglypuff IS the best Pokémon'" + '<br/>' + "=======================" + '<br/>' + "'/api/set' to activate the pseudo-API key" + '<br/>' + "'/api/remove' to deactivate the pseudo-API key" + '<br/>' + "'/api/locked' to see a different message depending on whether the pseudo-API key is activated or inactivated" + '<br/>' + "'/api/greetings/:userName' to see 'Hello, :userName!' (substitute a name for ':username')" + '<br/>' +"'/api/8ball' to battle a couple wild Pokemon because that's Pokéballs are like 8 balls, just go with it and have fun." + '<br>' + "=======================" + '<br/>' + "'/api/imtheboss' to be the boss" + '<br>' + "'/api/imnottheboss' to resign as the boss" + '<br/>' + "'/api/boss/dashboard' to see the boss dashboard if you're the boss." + '<br/>' + "'/api/boss/destruction' to see boss destruction if you're the boss, but save this for when you're done with everything else."

// apparently the reading is set to HTML encoding or whatever, so \n escape characters don't work, but <br/> does.

const jigglypuff = { name: 'Jigglypuff', hitPoints: 60, attack: ['Bodyslam', 40] };
const rattata = { name: 'Rattata', hitPoints: 30, attack: ['Tackle', 25] };
const pidgey = { name: 'Pidgey', hitPoints: 50, attack: ['Gust', 40] };
const wildPokemon = [rattata, pidgey];
let currentPokemonIndex = 0;
const assignPokemon = () => {
  const randomIndex = Math.floor(Math.random() * wildPokemon.length);
  currentPokemon = wildPokemon[randomIndex];
}

let boss = false;
let notDestructed = true;

app.use((req, res, next) => {
  if (notDestructed) {
    next();
  } else {
    res.status(404).send("Apparently the boss decided to destroy everything.  Nothing a server reset wouldn't fix, though.  Somewhere in the distance you hear a Jigglypuff singing.");
  }
})

const whosTheBoss = (req, res, next) => {
  req['bossMode'] = boss;
  next();
}

app.get('/', (req, res) => {
  res.send('You have reached My amazing App?' + '<br>' + '<br>' + menuOptions);
});

const myLoggerMiddleware = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`${jigglypuff.name} currently has ${jigglypuff.hitPoints} hit points.`);
  next();
};

const setAPIKey = (req, res, next) => {
  req['x-api-key'] = pseudoAPIKey;
  next();
}

app.use(whosTheBoss);
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

app.get('/api/greetings/:userName', (req, res) => {
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

app.get('/api/imtheboss', (req, res) => {
  boss = true;
  res.status(200).send(`You are now the boss.` + '<br>' + '<br>' + menuOptions);
})

app.get('/api/imnottheboss', (req, res) => {
  boss = false;
  res.status(200).send(`You are no longer the boss.` + '<br>' + '<br>' + menuOptions);
})

app.get('/api/boss/dashboard', (req, res) => {
  console.log('api boss dash', req['bossMode']);
  if (req['bossMode'] === true) {
    res.status(200).send("You are the boss.  You enjoy a simple dashboard free of the complications of your everyday boss life.  You might think you could at least get dark mode as boss, but apparently Jigglypuff ran off with the implementation.  If you grow weary of being the boss, you can visit 'api/imnottheboss' to let Jigglypuff be the boss for the day." + '<br>' + '<br>' + menuOptions)
  } else {
    res.status(403).send("If you were the boss, you would have visited 'api/imtheboss' to turn on boss mode.  Good thing Jigglypuff doesn't have the manual dexterity to type on a character or Jigglypuff would be the boss . . ." + '<br>' + '<br>' + menuOptions)
  }
});

app.get('/api/boss/destruction', (req, res) => {
  if (req.bossMode) {
    notDestructed = false;
    res.status(200).send("You have decided to retire from the stresses of your everyday boss life with your friend and companion Jigglypuff.  As you set the destruction timer and walk away, you think to yourself 'That'll teach them not to implement dark mode!  Bwahahahaha!'")
  } else {
    res.status(403).send("If you were the boss, you would have visited 'api/imtheboss' to turn on boss mode.  Good thing Jigglypuff doesn't have the manual dexterity to type on a character or Jigglypuff would be the boss . . ." + '<br>' + '<br>' + menuOptions)
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});