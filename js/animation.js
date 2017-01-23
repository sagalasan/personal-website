# Constants

function AnimationPreferences() {
  this.numNodes = 20;
  this.deathTimeMin = 1;
  this.deathTimeMax = 5;
  this.connectTimeMin = .1;
  this.connectTimeMax = .3;
}

function createAnimation(target) {
  d3.select(target);
}
