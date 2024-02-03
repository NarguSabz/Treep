class Player {
  constructor() {
    this.health = 100;
    this.level = 1;
    this.skills = [];
    this.mealCount = 0;
    this.healthyDayCount = 0;
    this.lastMealTime = null;

    // Bind methods to the instance
    this.feedPlayer = this.feedPlayer.bind(this);
    this.checkHealth = this.checkHealth.bind(this);
  }

  // Method to feed the player
  feedPlayer(food_class) {
      const currentTime = Date.now();
      
      // Check if enough time has passed since the last meal
      if (this.lastMealTime && currentTime - this.lastMealTime < 10 * 1000) {
        console.log("Wait for 10 seconds before feeding again.");
      } else {
        // Calculate the health increase based on the food class
        let healthIncrease = 0;
        
        if (food_class === "healthy") {
          healthIncrease = 10;
        } else if (food_class === "unhealthy") {
          healthIncrease = 5;
        }
    
        // Update health within the range [0, 100]
        this.health = Math.min(100, Math.max(0, this.health + healthIncrease));
    
        // Update meal count and last meal time
        this.mealCount += 1;
        this.lastMealTime = currentTime;
    
        console.log("Player fed! Health:", this.health);
      }
    
      return this.health;
    }

  // Method to check player's health and level
  checkHealth() {
    // If not fed 3 times during 24 hours, lose 50 health points
    if (this.mealCount === 3) {
      this.healthyDayCount += 1;
    }
  
    // Deduct health within the range [0, 100]
    this.health -= Math.min((3 - this.mealCount) * 20, this.health);
    this.mealCount = 0; // Reset meal count after health deduction
  
    console.log("Updating health after one day", this.health);
  
    // Check for level up based on health (adjust as needed) after 2 days of healthy eating
    if (this.healthyDayCount >= 2) {
      this.level += 1;
      this.healthyDayCount = 0;
      console.log("Level Up! New Level:", this.level);
  
      // Reset health to maximum after leveling up
      this.health = 100;
    }
    return {"health":this.health,"level":this.level}
  }
}

export default Player;
