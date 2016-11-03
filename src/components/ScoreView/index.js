import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Easing,
  Text,
} from 'react-native';
import BindComponent from '../BindComponent';
import Screen from '../../data/Screen';
import Constant from '../../data/Constant';

class ScoreView extends BindComponent {
  constructor(props) {
    super(props, ['start', 'stop', 'runPercent', 'addTime', 'resumme', 'reset']);
    this.state = {
      per: new Animated.Value(1)
    };
    this.tempPercent = 1;
  }

  start() {
    this.stop(() => {
      this.runPercent(1);
    });
  }

  runPercent(percent, isNo) {
    const perc = percent > 1 ? 1 : percent;
    if (perc <= 0) {
      console.log('end');
      return;
    }
    this.state.per.setValue(perc);
    if (isNo) {
      return;
    }
    Animated.timing(this.state.per, {
      toValue: 0,
      duration: this.props.max * perc,
      easing: Easing.linear
    }).start((t) => {
      if (t.finished) {
        this.props.timeout();
      }
    });
  }

  stop(callback) {
    this.state.per.stopAnimation(callback);
  }

  resumme() {
    this.runPercent(this.tempPercent);
  }

  addTime(addP, isStop) {
    this.stop(per => {
      this.tempPercent = per + addP;
      this.runPercent(this.tempPercent, isStop);
    });
  }

  reset() {
    this.stop(() => {
      this.state.per.setValue(1);
      this.tempPercent = 1;
    });
  }

  render() {
    const {level, stage, score} = this.props;
    return (
      <View style={styles.baseView}>
        <View style={styles.line}>
          <Text style={styles.word}>关卡{level}-{stage}</Text>
        </View>
        <View style={styles.pline}>
          <Animated.View style={[styles.pv, {
            transform: [{
              scaleX: this.state.per
            }]
          }]}>
          </Animated.View>
        </View>
        <View style={styles.line}>
          <Text style={styles.word}>{score}</Text>
        </View>
      </View>
    );
  }
}

ScoreView.propTypes = {
  max: React.PropTypes.number.isRequired,
  level: React.PropTypes.number.isRequired,
  stage: React.PropTypes.number.isRequired,
  timeout: React.PropTypes.func.isRequired,
  score: React.PropTypes.number.isRequired,
}

const styles = {
  baseView: {
    height: Screen.titleHeight,
    backgroundColor: Constant.titleBg,
  },
  line: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pline: {
    flex: 1,
    backgroundColor: '#3657',
  },
  pv: {
    flex: 1,
    backgroundColor: '#f00',
  },
  word: {
    fontSize: Screen.titleHeight / 5.0,
  }
};

export default ScoreView;
