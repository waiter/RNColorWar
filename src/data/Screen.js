import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

const adHeight = 90;
const showHeight = height - adHeight;
const titleHeight = parseInt(showHeight * 0.3, 10);
const cicleHeight = showHeight - titleHeight;
const cicleSize = Math.min(cicleHeight, width) / 5.0;

export default {
  width,
  height,
  adHeight,
  showHeight,
  titleHeight,
  cicleHeight,
  cicleSize,
};
