import Matter from 'matter-js';
import { SCREEN_HEIGHT } from './constants';

let enemyDirection = null; // Stores the current swipe direction

const TouchHandler = (entities, { touches }) => {
  let startTouch = touches.find(t => t.type === "start");
  let moveTouch = touches.find(t => t.type === "move");
  let endTouch = touches.find(t => t.type === "end");

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
    }
  }

  if (entities.enemy && enemyDirection) {
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

export default TouchHandler;
