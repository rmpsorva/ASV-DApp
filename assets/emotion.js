// Pequeño motor emocional: cambia microgestos y color según energía/historial
window.ASVEmotion = (function(){
  const states = ["calm","curious","focused","tired","excited"];
  let idx = 3;

  function next(vital){
    if(vital > 75) idx = 4;
    else if(vital > 55) idx = 2;
    else if(vital > 35) idx = 1;
    else if(vital > 15) idx = 0;
    else idx = 3;
    return states[idx];
  }

  function hueFor(state){
    return {
      calm: 188, curious: 195, focused: 182, tired: 175, excited: 190
    }[state] || 188;
  }

  return { next, hueFor };
})();  real human
