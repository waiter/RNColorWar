import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';
import BindComponent from '../BindComponent';
import Screen from '../../data/Screen';

const baseSize = Screen.cicleSize;
const size = baseSize * 0.8;

class CircleBtn extends BindComponent {
  constructor(props) {
    super(props, ['onPress', 'stopAllAnimation', 'showAnimation']);
    this.state = {
      rate: new Animated.Value(1)
    };
  }

  componentWillMount(){
    // this.state.rate.setValue(1.5);
    Animated.spring(
      this.state.rate,
      {
        toValue: 1,
        friction: 1,
      }
    ).start();
  }

  onPress() {
    if (!this.props.enable) {
      return;
    }
    this.stopAllAnimation(1);
    Animated.sequence([
      Animated.timing(this.state.rate, {
        toValue: 0.7,
        duration: 100,
      }),
      Animated.spring(this.state.rate, {
          toValue: 1,
          friction: 1,
      })
    ]).start();
    this.props.onPress();
  }

  stopAllAnimation(rate) {
    this.state.rate.stopAnimation();
    this.state.rate.setValue(rate);
  }

  showAnimation(time, callback) {
    this.stopAllAnimation(0);
    Animated.timing(this.state.rate, {
      toValue: 1,
      duration: time,
      easing: Easing.out(Easing.sin)
    }).start(callback);
  }

  render() {
    const {show, max, colors, step} = this.props;
    if (!show) {
      return (
        <View style={styles.touch}>
        </View>
      );
    }
    const inScale = 1.0 * (step % max) / max;
    const baseColor = step >= max ? 1 : 0;
    return (
      <View  style={styles.touch}>
      <TouchableWithoutFeedback onPressIn={this.onPress}>
        <Animated.View style={[styles.circle, {
          backgroundColor: colors[baseColor],
          transform: [{
            scale: this.state.rate
          }]
        }]}>
          <View style={[
            {
              width: size * inScale,
              height: size * inScale,
              borderRadius: size * inScale / 2.0,
              backgroundColor: colors[1 - baseColor],
            }
          ]}>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    width: baseSize,
    height: baseSize,
    // borderWidth: 1,
    // borderColor: '#000',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    borderRadius: size/2.0,
  }
});

CircleBtn.propTypes = {
  colors: React.PropTypes.array.isRequired,
  max: React.PropTypes.number.isRequired,
  show: React.PropTypes.bool,
  onPress: React.PropTypes.func.isRequired,
  enable: React.PropTypes.bool.isRequired,
  // step: React.PropTypes.number.isRequired,
};

export default CircleBtn;
