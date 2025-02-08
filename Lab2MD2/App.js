import React from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { createEntities } from './gameLogic';
import Physics, { movePlayer } from './Physics';

export default function App() {
  return (
    <View style={styles.container}>
      <GameEngine
        systems={[Physics]} 
        entities={createEntities()}
        style={styles.gameContainer}
      >
        <StatusBar style="auto" />
      </GameEngine>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer('up')}>
          <Text style={styles.buttonText}>Up</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('left')}>
            <Text style={styles.buttonText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => movePlayer('right')}>
            <Text style={styles.buttonText}>Right</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => movePlayer('down')}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
