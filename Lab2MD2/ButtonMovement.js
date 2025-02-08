import Matter from 'matter-js';
import { SCREEN_WIDTH, SCREEN_HEIGHT, BOUNDARY_THICKNESS } from './constants';

const ButtonMovement = (playerDirection) => (entities, { time }) => {
  const { engine } = entities.physics;
  const player = entities.player.body;

  // Movement speed (pixels per frame)
  const speed = 5;

  // Calculate new position based on direction
  const newX = player.position.x + playerDirection.current.x * speed;
  const newY = player.position.y + playerDirection.current.y * speed;

  // Ensure player stays within boundaries
  if (
    newX >= BOUNDARY_THICKNESS &&
    newX <= SCREEN_WIDTH - BOUNDARY_THICKNESS &&
    newY >= BOUNDARY_THICKNESS &&
    newY <= SCREEN_HEIGHT - BOUNDARY_THICKNESS
  ) {
    Matter.Body.setPosition(player, { x: newX, y: newY });
  }

  Matter.Engine.update(engine, time.delta);
  return entities;
};

export default ButtonMovement;