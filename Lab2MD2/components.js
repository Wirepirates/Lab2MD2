import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Matter from 'matter-js';

// ✅ Component for rendering boundaries
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

// ✅ Updated Player component to dynamically update color when it changes
const Player = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const xPos = props.body.position.x - width / 2;
  const yPos = props.body.position.y - height / 2;

  // ✅ Ensure color updates properly
  const [playerColor, setPlayerColor] = useState(props.color);

  useEffect(() => {
    setPlayerColor(props.color);
  }, [props.color, props.__rerender]); // ✅ Triggers UI update when color changes

  return (
    <View
      style={{
        position: 'absolute',
        left: xPos,
        top: yPos,
        width: width,
        height: height,
        backgroundColor: playerColor, // ✅ Use dynamically updated color
      }}
    />
  );
};

// ✅ Enemy component (unchanged, but included for completeness)
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

// ✅ Function to create a static boundary
export const createBoundary = (world, color, pos, size, label) => {
  const boundary = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label,
    isStatic: true,
  });
  Matter.World.add(world, boundary);
  return { body: boundary, color: color || 'red', pos, renderer: <Boundary /> };
};

// ✅ Function to create a player entity
export const createPlayer = (world, color, pos, size) => {
  const player = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label: 'Player',
    isStatic: false,
    restitution: 1, // Bounciness
  });
  Matter.World.add(world, player);
  return { 
    body: player, 
    color: color || 'blue', // ✅ Initial color, will change dynamically
    __rerender: false, // ✅ Add this flag to force React re-render
    pos, 
    renderer: <Player /> 
  };
};

// ✅ Function to create an enemy entity
export const createEnemy = (world, color, pos, size) => {
  const enemy = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    label: 'Enemy',
    isStatic: false,
    restitution: 1, // Bounciness
  });
  Matter.World.add(world, enemy);
  return { body: enemy, color: color || 'black', pos, renderer: <Enemy /> };
};
