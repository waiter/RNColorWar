/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar
} from 'react-native';
import Screen from './data/Screen';
import {Scene, Router, Reducer, ActionConst, Actions} from 'react-native-router-flux';
import Game from './scenes/Game';
import ADManger from './data/adManager';

export default class RNColorWar extends Component {
  constructor(props) {
    super(props);
    const stausBar = (<StatusBar hidden/>);
    ADManger.init();
    console.log(Screen);
  }

  render() {
    return (
      <Router hideNavBar>
        <Scene key="root">
          <Scene key="loading" component={Game}/>
          <Scene key="game" component={Game} initial={true}/>
        </Scene>
      </Router>
    );
  }
}
