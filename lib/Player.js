

//When we call super(name), it passes the name argument to the constructor() of the Character class, where name and other properties like health are officially defined. Afterwards, the Player class will add any additional properties like this.inventory to the object.
        const Potion = require('./Potion');
        const Character = require('./Character');
        
        class Player extends Character {
          constructor(name = '') {
            super(name);
        
            this.inventory = [new Potion('health'), new Potion()];
          }
        
          getStats() {
            return {
              potions: this.inventory.length,
              health: this.health,
              strength: this.strength,
              agility: this.agility
            };
          }
        
          getInventory() {
            if (this.inventory.length) {
              return this.inventory;
            }
            return false;
          }
        
          addPotion(potion) {
            this.inventory.push(potion);
          }
        
          usePotion(index) {
            const potion = this.inventory.splice(index, 1)[0];
        
            switch (potion.name) {
              case 'agility':
                this.agility += potion.value;
                break;
              case 'health':
                this.health += potion.value;
                break;
              case 'strength':
                this.strength += potion.value;
                break;
            }
          }
        }
        
        module.exports = Player;
        