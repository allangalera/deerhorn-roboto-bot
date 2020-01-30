const moment = require('moment');

const timeUntilNextBattle = () => {
  let now = moment().utc();
  let next_war = moment().utc();

  next_war.minute(0);
  next_war.second(0);
  next_war.millisecond(0);

  if (now.hour() < 7) {
    next_war.hour(7);
  } else if (now.hour() < 15) {
    next_war.hour(15);
  } else if (now.hour() < 23) {
    next_war.hour(23);
  } else {
    next_war.hour(7);
    next_war.add(1, 'days');
  }

  return (next_war - now) / 1000;
};

const calculateAimingBonus = (aimingBonus, aimingTimeToCharge, timeRemaining) => {
  let bonus = aimingBonus * (timeRemaining / (aimingTimeToCharge * 60));

  bonus = Math.min(aimingBonus, bonus);
  bonus = parseInt(bonus);

  let timeLeft = parseInt((timeRemaining - aimingTimeToCharge * 60) / 60);

  if (timeLeft <= 0) {
    timeLeft = 0;
  }

  return { bonus, timeLeft };
};

exports.timeUntilNextBattle = timeUntilNextBattle;
exports.calculateAimingBonus = calculateAimingBonus;
