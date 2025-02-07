import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';
import { createBoundary } from './components';

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
    world, 'red', // Use a different color to distinguish it
    { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }, // Center of the screen
    { width: SCREEN_WIDTH, height: BOUNDARY_THICKNESS },
    'BoundaryCenterHorizontal'
  );

  return entities;
};