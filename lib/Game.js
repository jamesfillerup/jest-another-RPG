const inquirer = require('inquirer');
const Enemy = require('../lib/Enemy');
const Player = require('../lib/Player');

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy;
  this.player;
}

Game.prototype.initializeGame = function() {
  this.enemies.push(new Enemy('goblin', 'sword'));
  this.enemies.push(new Enemy('orc', 'baseball bat'));
  this.enemies.push(new Enemy('skeleton', 'axe'));

  this.currentEnemy = this.enemies[0];

  inquirer
    .prompt({
      type: 'text',
      name: 'name',
      message: 'What is your name?'
    })
    .then(({ name }) => {
      this.player = new Player(name);

      this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function() {
  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }
  console.log('Your stats are as follows:');
  console.table(this.player.getStats());

  console.log(this.currentEnemy.getDescription());

  this.battle();
};

Game.prototype.battle = function() {
  if (this.isPlayerTurn) {
    inquirer
      .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['Attack', 'Use potion']
      })
      .then(({ action }) => {
        if (action === 'Use potion') {
          if (!this.player.getInventory()) {
            console.log("You don't have any potions!");
            return this.checkEndOfBattle();
          }

          inquirer
            .prompt({
              type: 'list',
              message: 'Which potion would you like to use?',
              name: 'action',
              choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)//the map() callback has a second optional parameter to capture the index of the item. We're using that index to create a human-readable number for the user. Many users might not know that arrays start at zero, so adding 1 will make more sense to them. We can always subtract 1 later to get the true value. 

              //When the user selects a Potion, the returned value will be a string like '2: agility'. We can use the String.prototype.split() method, though, to split on the ': ', giving us an array with the number and Potion name (e.g., ['2', 'agility']). Subtracting 1 from the number will put us back at the original array index.
            })
            .then(({ action }) => {
              const potionDetails = action.split(': ');

              this.player.usePotion(potionDetails[0] - 1);
              console.log(`You used a ${potionDetails[1]} potion.`);
              this.checkEndOfBattle();
            });
        } else {
          const damage = this.player.getAttackValue();
          this.currentEnemy.reduceHealth(damage);

          console.log(`You attacked the ${this.currentEnemy.name}`);
          console.log(this.currentEnemy.getHealth());

          this.checkEndOfBattle();
        }
      });
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());

    this.checkEndOfBattle();
  }
};

Game.prototype.checkEndOfBattle = function() {
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.battle();
  } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
    console.log(`You've defeated the ${this.currentEnemy.name}`);

    this.player.addPotion(this.currentEnemy.potion);
    console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

    this.roundNumber++;

    if (this.roundNumber < this.enemies.length) {
      this.currentEnemy = this.enemies[this.roundNumber];
      this.startNewBattle();
    } else {
      console.log('You win!');
    }
  } else {
    console.log("You've been defeated!");
  }
};

module.exports = Game;
