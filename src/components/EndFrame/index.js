import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
} from 'react-native';
import BindComponent from '../BindComponent';
import Screen from '../../data/Screen';
import Constant from '../../data/Constant';

class EndFrame extends BindComponent {
  constructor(props) {
    super(props, ['show', 'hide', 'onRestart']);
    this.state = {
      move: new Animated.Value(0),
    };
  }

  show() {
    this.state.move.stopAnimation(() => {
      this.state.move.setValue(0);
      Animated.timing(this.state.move, {
        toValue: 1,
        easing: Easing.out(Easing.sin),
      }).start();
    });
  }

  hide(callback) {
    this.state.move.stopAnimation(() => {
      Animated.timing(this.state.move, {
        toValue: 0,
        easing: Easing.in(Easing.sin),
      }).start(callback);
    });
  }

  onRestart() {
    this.hide(this.props.restart);
  }

  render() {
    const {move} = this.state;
    return (
      <Animated.View style={[styles.endV,{
        transform: [{
          translateY: move.interpolate({
            inputRange: [0, 1],
            outputRange: [Screen.height - Screen.titleHeight, 0]
          })
        }]
      }]}>
        <Text>最高分</Text>
        <Text>9999999</Text>
        <TouchableOpacity onPress={this.onRestart}>
          <Text>重新开始</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

EndFrame.propTypes = {
  restart: React.PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  endV: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Screen.titleHeight,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constant.titleBg,
  }
});

export default EndFrame;
