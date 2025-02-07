import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';
import { createBoundary, createPlayer, createEnemy } from './components';

export const createEntities = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  const entities = {
    physics: { engine, world },
  };

  // Create boundaries
  entities.boundaryTop = createBoundary(
    world, 'red',
    { x: SCREEN_WIDTH / 2, y: 0 },
    { width: SCREEN_WIDTH, height: BOUNDARY_THICKNESS },
    'BoundaryTop'
  );

  entities.boundaryBottom = createBoundary(
    world, 'red',
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT },
    { width: SCREEN_WIDTH, height: BOUNDARY_THICKNESS },
    'BoundaryBottom'
  );

  entities.boundaryLeft = createBoundary(
    world, 'red',
    { x: 0, y: SCREEN_HEIGHT / 2 },
    { width: BOUNDARY_THICKNESS, height: SCREEN_HEIGHT },
    'BoundaryLeft'
  );

  entities.boundaryRight = createBoundary(
    world, 'red',
    { x: SCREEN_WIDTH, y: SCREEN_HEIGHT / 2 },
    { width: BOUNDARY_THICKNESS, height: SCREEN_HEIGHT },
    'BoundaryRight'
  );

  // Add a horizontal boundary in the center
  entities.boundaryCenterHorizontal = createBoundary(
    world, 'red',
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 },
    { width: SCREEN_WIDTH, height: BOUNDARY_THICKNESS },
    'BoundaryCenterHorizontal'
  );

  // Player
  const playerSize = 30; // Size of the player (square)
  entities.player = createPlayer(
    world, 'blue', // Player color
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 4 }, // Center of the upper half
    { width: playerSize, height: playerSize }
  );

  // Enemy
  const enemySize = 50; // Size of the enemy (square)
  entities.enemy = createEnemy(
    world, 'green', // Enemy color
    { x: Math.random() * SCREEN_WIDTH, y: SCREEN_HEIGHT / 6 }, // Random position in the upper half
    { width: enemySize, height: enemySize }
  );

  return entities;
};