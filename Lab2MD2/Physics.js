import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';

const SPEED = 5;
let playerBody = null;
let currentDirection = null;
let stuckToWall = false;
let stuckWallType = null; // 'left', 'right', 'top', 'bottom'

// Generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log("Generated color:", color); // Debugging
  return color;
};

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  playerBody = entities.player.body;

  // Disable gravity and bouncing
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;

  if (playerBody) {
    playerBody.restitution = 0; // No bounce
    playerBody.frictionAir = 0; // No slowdown

    const { x, y } = playerBody.position;
    let newPosition = { x, y };
    let colorChanged = false; // Track if color changes

    // Ensure color changes when hitting a boundary
    if (x <= BOUNDARY_THICKNESS) {
      newPosition.x = BOUNDARY_THICKNESS;
      if (currentDirection === 'left') {
        stuckToWall = true;
        stuckWallType = 'left';
      }
      const newColor = getRandomColor();
      entities.player.color = newColor;
      colorChanged = true;
      console.log("Wall hit on left! New color:", newColor);
    }

    if (x >= SCREEN_WIDTH - BOUNDARY_THICKNESS) {
      newPosition.x = SCREEN_WIDTH - BOUNDARY_THICKNESS;
      if (currentDirection === 'right') {
        stuckToWall = true;
        stuckWallType = 'right';
      }
      const newColor = getRandomColor();
      entities.player.color = newColor;
      colorChanged = true;
      console.log("Wall hit on right! New color:", newColor);
    }

    if (y <= BOUNDARY_THICKNESS) {
      newPosition.y = BOUNDARY_THICKNESS;
      if (currentDirection === 'up') {
        stuckToWall = true;
        stuckWallType = 'top';
      }
      const newColor = getRandomColor();
      entities.player.color = newColor;
      colorChanged = true;
      console.log("Wall hit on top! New color:", newColor);
    }

    if (y >= SCREEN_HEIGHT - BOUNDARY_THICKNESS) {
      newPosition.y = SCREEN_HEIGHT - BOUNDARY_THICKNESS;
      if (currentDirection === 'down') {
        stuckToWall = true;
        stuckWallType = 'bottom';
      }
      const newColor = getRandomColor();
      entities.player.color = newColor;
      colorChanged = true;
      console.log("Wall hit on bottom! New color:", newColor);
    }

    // Force UI update if color changed
    if (colorChanged) {
      entities.player.__rerender = Math.random(); // ✅ Force re-render
    }

    // Check for collision with the enemy
    if (entities.enemy && Matter.Collision.collides(playerBody, entities.enemy.body)) {
      const newColor = getRandomColor();
      entities.player.color = newColor;
      console.log("Collision with enemy! New color:", newColor);
      handleEnemyCollision(entities);
    }

    // Handle player movement
    if (currentDirection) {
      switch (currentDirection) {
        case 'up':
          newPosition.y -= SPEED;
          break;
        case 'down':
          newPosition.y += SPEED;
          break;
        case 'left':
          newPosition.x -= SPEED;
          break;
        case 'right':
          newPosition.x += SPEED;
          break;
      }
    }

    // Ensure the player stays stuck to the wall when moving along it
    if (stuckToWall) {
      if (stuckWallType === 'left' || stuckWallType === 'right') {
        newPosition.x = playerBody.position.x;
      } else if (stuckWallType === 'top' || stuckWallType === 'bottom') {
        newPosition.y = playerBody.position.y;
      }
    }

    // Set the new position
    Matter.Body.setPosition(playerBody, newPosition);
  }

  Matter.Engine.update(engine, time.delta);
  return { ...entities }; // ✅ Ensure entities update
};

// Handle enemy collision by changing position
import { disableEnemyMovement } from './TouchHandler';

const handleEnemyCollision = (entities) => {
  if (entities.enemy) {
    const newX = Math.random() * SCREEN_WIDTH;
    const newY = Math.random() * (SCREEN_HEIGHT / 2);

    Matter.Body.setVelocity(entities.enemy.body, { x: 0, y: 0 });
    Matter.Body.setPosition(entities.enemy.body, { x: newX, y: newY });

    disableEnemyMovement();
  }
};

// Allow movement in different directions
export const movePlayer = (direction) => {
  if (!playerBody) return;

  stuckToWall = false;
  currentDirection = direction;
};

export default Physics;
