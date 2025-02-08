import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';

const SPEED = 5;
let playerBody = null;
let currentDirection = null;
let stuckToWall = false;
let stuckWallType = null; // 'left', 'right', 'top', 'bottom', 'center'

// Generate a random hex color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log("Generated color:", color);
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

    // Update physics engine
    Matter.Engine.update(engine, time.delta);

    // Collision with left and right walls
    if (x <= BOUNDARY_THICKNESS && stuckWallType !== 'left') {
      entities.player.color = getRandomColor();
      console.log("Wall hit on left! New color:", entities.player.color);

      newPosition.x = BOUNDARY_THICKNESS;
      stuckToWall = true;
      stuckWallType = 'left';
      colorChanged = true;
    }

    if (x >= SCREEN_WIDTH - BOUNDARY_THICKNESS && stuckWallType !== 'right') {
      entities.player.color = getRandomColor();
      console.log("Wall hit on right! New color:", entities.player.color);

      newPosition.x = SCREEN_WIDTH - BOUNDARY_THICKNESS;
      stuckToWall = true;
      stuckWallType = 'right';
      colorChanged = true;
    }

    // Collision with top and bottom walls
    if (y <= BOUNDARY_THICKNESS && stuckWallType !== 'top') {
      entities.player.color = getRandomColor();
      console.log("Wall hit on top! New color:", entities.player.color);

      newPosition.y = BOUNDARY_THICKNESS;
      stuckToWall = true;
      stuckWallType = 'top';
      colorChanged = true;
    }

    if (y >= SCREEN_HEIGHT - BOUNDARY_THICKNESS && stuckWallType !== 'bottom') {
      entities.player.color = getRandomColor();
      console.log("Wall hit on bottom! New color:", entities.player.color);

      newPosition.y = SCREEN_HEIGHT - BOUNDARY_THICKNESS;
      stuckToWall = true;
      stuckWallType = 'bottom';
      colorChanged = true;
    }

    // ✅ FINAL FIX: Prevent Color Change While Sliding Along Center
    if (
      entities.boundaryCenterHorizontal &&
      Matter.Collision.collides(playerBody, entities.boundaryCenterHorizontal.body)
    ) {
      if (stuckWallType !== 'center') { // Only change color when first colliding
        entities.player.color = getRandomColor();
        console.log("Collision with central barrier! New color:", entities.player.color);
        colorChanged = true;

        // Prevent movement through the barrier
        if (currentDirection === 'up' && y > SCREEN_HEIGHT / 2) {
          newPosition.y = SCREEN_HEIGHT / 2 + BOUNDARY_THICKNESS;
        } else if (currentDirection === 'down' && y < SCREEN_HEIGHT / 2) {
          newPosition.y = SCREEN_HEIGHT / 2 - BOUNDARY_THICKNESS;
        }

        stuckToWall = true;
        stuckWallType = 'center';
      } else {
        // If already stuck on center, lock movement but do NOT change color
        if (currentDirection === 'up' && y > SCREEN_HEIGHT / 2) {
          newPosition.y = SCREEN_HEIGHT / 2 + BOUNDARY_THICKNESS;
        }
        if (currentDirection === 'down' && y < SCREEN_HEIGHT / 2) {
          newPosition.y = SCREEN_HEIGHT / 2 - BOUNDARY_THICKNESS;
        }
      }
    }

    // ✅ Force UI update if color changed
    if (colorChanged) {
      entities.player.__rerender = Date.now();
    }

    // Check for collision with the enemy
    if (entities.enemy && Matter.Collision.collides(playerBody, entities.enemy.body)) {
      entities.player.color = getRandomColor();
      console.log("Collision with enemy! New color:", entities.player.color);
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

    // ✅ Prevent `stuckToWall` from interfering with updates
    if (stuckToWall) {
      if (stuckWallType === 'left' || stuckWallType === 'right') {
        newPosition.x = playerBody.position.x;
      } else if (stuckWallType === 'top' || stuckWallType === 'bottom' || stuckWallType === 'center') {
        newPosition.y = playerBody.position.y;
      }
    }

    // Set the new position
    Matter.Body.setPosition(playerBody, newPosition);
  }

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
  stuckWallType = null; // Reset wall type when moving
  currentDirection = direction;
};

export default Physics;
