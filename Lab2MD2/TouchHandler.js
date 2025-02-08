import Matter from 'matter-js';
import { SCREEN_HEIGHT } from './constants';

let enemyDirection = null; // Stores the current swipe direction
let enemyCanMove = false; // Start disabled so enemy stays still until a swipe

const TouchHandler = (entities, { touches }) => {
  let startTouch = touches.find(t => t.type === "start");
  let moveTouch = touches.find(t => t.type === "move");

  if (startTouch) {
    let { pageX, pageY } = startTouch.event;

    // Only allow swiping in the top half of the screen
    if (pageY < SCREEN_HEIGHT / 2) {
      enemyDirection = null; // Reset direction
    }
  }

  if (moveTouch) {
    let { pageX, pageY } = moveTouch.event;

    // Ensure swipe is in the **top half** of the screen
    if (pageY < SCREEN_HEIGHT / 2) {
      let deltaX = moveTouch.delta.pageX;
      let deltaY = moveTouch.delta.pageY;

      // Determine movement direction based on swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        enemyDirection = deltaX > 0 ? 'right' : 'left';
      } else {
        enemyDirection = deltaY > 0 ? 'down' : 'up';
      }

      enableEnemyMovement(); // Allow movement when a swipe occurs
    }
  }

  if (entities.enemy && enemyDirection && enemyCanMove) { // Ensure movement only happens when allowed
    let enemy = entities.enemy.body;
    let speed = 5; // Same speed as the player

    let newX = enemy.position.x;
    let newY = enemy.position.y;

    // Apply continuous movement like the player
    switch (enemyDirection) {
      case 'up':
        newY -= speed;
        break;
      case 'down':
        newY += speed;
        break;
      case 'left':
        newX -= speed;
        break;
      case 'right':
        newX += speed;
        break;
    }

    Matter.Body.setPosition(enemy, { x: newX, y: newY });
  }

  return entities;
};

// Function to allow enemy movement again when the player swipes
export const enableEnemyMovement = () => {
  enemyCanMove = true;
};

// Function to stop enemy movement after collision
export const disableEnemyMovement = () => {
  enemyCanMove = false;
  enemyDirection = null; // Reset direction to prevent auto-movement
};

export default TouchHandler;
