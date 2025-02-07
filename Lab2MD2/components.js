import Matter from 'matter-js';
import React from 'react';
import { View } from 'react-native';

const Boundary = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;

  const xPos = props.body.position.x - width / 2;
  const yPos = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: props.color || 'red',
      }}
    />
  );
};

const Player = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;

  const xPos = props.body.position.x - width / 2;
  const yPos = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: props.color || 'blue',
      }}
    />
  );
};

const Enemy = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;

  const xPos = props.body.position.x - width / 2;
  const yPos = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: props.color || 'black',
      }}
    />
  );
};

export const createBoundary = (world, color, pos, size, label) => {
  const boundary = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label,
    isStatic: true,
  });
  Matter.World.add(world, boundary);
  return { body: boundary, color: color || 'red', pos, renderer: <Boundary /> };
};

export const createPlayer = (world, color, pos, size) => {
  const player = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label: 'Player',
    isStatic: false,
    restitution: 1, // Bounciness
  });
  Matter.World.add(world, player);
  return { body: player, color: color || 'blue', pos, renderer: <Player /> };
};

export const createEnemy = (world, color, pos, size) => {
  const enemy = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label: 'Enemy',
    isStatic: false,
    restitution: 1, // Bounciness
  });
  Matter.World.add(world, enemy);
  return { body: enemy, color: color || 'black', pos, renderer: <Enemy /> };
};