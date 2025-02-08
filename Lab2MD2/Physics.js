import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';

const SPEED = 5;
let playerBody = null;
let currentDirection = null;
let stuckToWall = false;
let stuckWallType = null; // 'left', 'right', 'top', 'bottom'

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

    // Stop movement at boundaries and ensure smooth wall attachment
    if (x <= BOUNDARY_THICKNESS) {
      newPosition.x = BOUNDARY_THICKNESS;
      if (currentDirection === 'left') {
        stuckToWall = true;
        stuckWallType = 'left';
      }
    }
    if (x >= SCREEN_WIDTH - BOUNDARY_THICKNESS) {
      newPosition.x = SCREEN_WIDTH - BOUNDARY_THICKNESS;
      if (currentDirection === 'right') {
        stuckToWall = true;
        stuckWallType = 'right';
      }
    }
    if (y <= BOUNDARY_THICKNESS) {
      newPosition.y = BOUNDARY_THICKNESS;
      if (currentDirection === 'up') {
        stuckToWall = true;
        stuckWallType = 'top';
      }
    }
    if (y >= SCREEN_HEIGHT - BOUNDARY_THICKNESS) {
      newPosition.y = SCREEN_HEIGHT - BOUNDARY_THICKNESS;
      if (currentDirection === 'down') {
        stuckToWall = true;
        stuckWallType = 'bottom';
      }
    }

    // Update the player's position directly for smoother movement
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
        // Only allow vertical movement when stuck to left or right walls
        newPosition.x = playerBody.position.x;
      } else if (stuckWallType === 'top' || stuckWallType === 'bottom') {
        // Only allow horizontal movement when stuck to top or bottom walls
        newPosition.y = playerBody.position.y;
      }
    }

    // Set the new position
    Matter.Body.setPosition(playerBody, newPosition);
  }

  Matter.Engine.update(engine, time.delta);
  return entities;
};

// Function to move the player in a smooth straight line
export const movePlayer = (direction) => {
  if (!playerBody) return;

  stuckToWall = false; // Reset wall lock when moving freely
  currentDirection = direction;
};

export default Physics;