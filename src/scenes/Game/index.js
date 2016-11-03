import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native';
import CircleBtn from '../../components/CircleBtn';
import BindComponent from '../../components/BindComponent';
import Constant from '../../data/Constant';
import { AdMobBanner} from 'react-native-admob';
import ADManager from '../../data/adManager';
import Screen from '../../data/Screen';
import ScoreView from '../../components/ScoreView';
import EndFrame from '../../components/EndFrame';
import GameCenter from '../../data/GameCenter';

export default class RNColorWar extends BindComponent {
  constructor(props) {
    super(props, ['onCirclePress', 'makeStageData', 'gotoNextLevel',
    'hideAllCicle', 'showAllCicle', 'timeout', 'restart']);
    const stage = 1;
    const level = 1;
    const {show, status} = this.makeStageData(level, stage);
    this.state = {
      stage,
      level,
      show,
      colors: ['#00f', '#0f0'],
      status,
      enable: true,
      opacityValue: new Animated.Value(0),
      colorId: 0,
      maxTime: GameCenter.timeLevel(level, stage),
      currentScore: 0,
    };
  }

  makeStageData(level, stage) {
    let arr = Array.from({length: 25}, (it, ind) => ind);
    const count = Constant.levelCounts[stage - 1];
    console.log(count);
    const maxT = level * 2;
    const show = [];
    const status = {};
    const checkC = {};
    for (let i = 0 ; i < count; i++) {
      const ind = parseInt(Math.random() * arr.length, 10);
      const nid = arr[ind];
      const cid = parseInt(Math.random() * maxT, 10);
      show.push(nid);
      status[nid] = cid;
      checkC[cid] = 1;
      arr.splice(ind, 1);
    }
    if (show.length != Object.keys(status).length) {
      console.log('error');
    }
    if (Object.keys(checkC).length == 1) {
      const ind = parseInt(Math.random() * show.length, 10);
      const key = show[ind];
      status[key] = (status[key] + 1) % maxT;
    }
    return {show, status};
  }

  onCirclePress(cid) {
    const {status, level, stage} = this.state;
    const keys = Object.keys(status);
    if (keys.indexOf(cid)) {
      let isGotoNext = false;
      const newStep = (status[cid] + 1) % (level * 2);
      const newState = {
        ...status,
        [cid]: newStep
      };
      const colorId = newStep == 0 ? 0 : 1;
      if (newStep == 0 || newStep == level) {
        isGotoNext = true;
        keys.forEach(it => {
          if (it != cid && status[it] != newStep) {
            isGotoNext = false;
          }
        });
      }
      this.setState({
        status: newState,
        enable: !isGotoNext,
        colorId,
        currentScore: this.state.currentScore + (isGotoNext ? GameCenter.stageUpScore(level, stage) : GameCenter.clickScore(level, stage)),
      });
      this.refs.scoreView.addTime(0.01, isGotoNext);
      if (isGotoNext) {
        this.gotoNextLevel();
      }
    } else {
      console.log(`未找到改圆圈：${cid}`);
    }
  }

  gotoNextLevel() {
    this.state.opacityValue.stopAnimation();
    this.state.opacityValue.setValue(0);
    Animated.timing(this.state.opacityValue, {
      toValue: 1,
      duration: Constant.tranTime,
    }).start(() => {
      this.hideAllCicle();
      const {level, stage} = this.state;
      let newStage = stage + 1;
      let newLevel = level;
      if (newStage > Constant.stageMax) {
        newStage = 1;
        newLevel ++;
      }
      const newData = this.makeStageData(newLevel, newStage);
      this.setState({
        stage: newStage,
        level: newLevel,
        show: newData.show,
        status: newData.status,
        enable: false,
        maxTime: GameCenter.timeLevel(newLevel, newStage),
      });
      Animated.timing(this.state.opacityValue, {
        toValue: 0,
        duration: Constant.tranTime,
      }).start(() => {
        this.showAllCicle(() => {
          this.setState({
            enable: true
          });
          this.refs.scoreView.resumme();
        });
      });
    });
  }

  timeout() {
    this.setState({
      enable: false,
    });
    this.refs.endFrame.show();
  }

  restart() {
    this.hideAllCicle();
    this.refs.scoreView.reset();
    const stage = 1;
    const level = 1;
    const {show, status} = this.makeStageData(level, stage);
    const maxTime = GameCenter.timeLevel(level, stage);
    this.setState({
      stage,
      level,
      show,
      status,
      enable: false,
      maxTime,
      currentScore: 0,
    });
    this.showAllCicle(() => {
      this.setState({
        enable: true
      });
    });
  }

  hideAllCicle() {
    for(let i = 0 ; i < 25; i++) {
      this.refs[`circle-${i}`].stopAllAnimation(0);
    }
  }

  showAllCicle(callback) {
    this.state.show.forEach((it, ind) => {
      this.refs[`circle-${it}`].showAnimation(
        Constant.tranTime / 2.0, ind == 0 ? callback : null);
    });
  }

  render() {
    const {stage, level, show, colors,
      status, enable, opacityValue, colorId,
      maxTime, currentScore} = this.state;
    const circles = [];
    for(let i = 0; i < 5; i++) {
      const lineC = [];
      for(let j = 0; j < 5; j++) {
        const cid = i*5+j;
        lineC.push(<CircleBtn
          ref={`circle-${cid}`}
          show={show.indexOf(cid) > -1}
          key={cid}
          max={level}
          step={status[cid]}
          colors={colors}
          onPress={() => this.onCirclePress(cid)}
          enable={enable}
          />);
      }
      circles.push(<View key={i} style={styles.lineV}>{lineC}</View>);
    }
    const adView = ADManager.isNoAd ? null : (
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        testDeviceID={ADManager.testDeviceID}
        adUnitID={ADManager.keys.home}
      />
    );
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.av, {
          backgroundColor: colors[colorId],
          opacity: opacityValue
        }]}>
        </Animated.View>
        <View style={styles.mainV}>
          <ScoreView
            ref="scoreView"
            max={maxTime}
            level={level}
            stage={stage}
            timeout={this.timeout}
            score={currentScore}
          />
          <View style={styles.cv}>
            {circles}
          </View>
        </View>
        <EndFrame
          ref="endFrame"
          restart={this.restart}
        />
        <View style={styles.AdV}>
          {adView}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777',
  },
  av: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#777',
  },
  lineV: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#0ff',
    width: Screen.width,
    height: Screen.cicleSize,
  },
  progress: {
    height: 30,
    backgroundColor: '#f00',
    width: 200,
  },
  mianV: {
    flex: 1,
  },
  cv: {
    height: Screen.cicleHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  AdV: {
    width: Screen.width,
    height: Screen.adHeight,
    justifyContent: 'flex-end'
  },
});
