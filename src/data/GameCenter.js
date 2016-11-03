const GameCenter = {
  timeLevel: function(level, stage) {
    return 1000 * (9 + level + (stage - 1) / 10);
  },
  clickScore: function(level, stage) {
    return level;
  },
  stageUpScore: function(level, stage) {
    return (level * 10 + stage - 1) * 10;
  }
};

export default GameCenter;
