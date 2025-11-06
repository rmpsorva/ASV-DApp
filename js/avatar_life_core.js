// AVATAR VIDA: Estilo 2 "Explorador Curioso"
let curiosityLevel = 0;

window.addEventListener("ASV_PRESENCE_TICK", () => {
  curiosityLevel = (curiosityLevel + 1) % 8;
  updateAvatarPresence();
});

function updateAvatarPresence() {
  const avatar = document.getElementById("asv-avatar");
  if (!avatar) return;

  const scale = 1 + (curiosityLevel * 0.008);
  const glow = 1 + (curiosityLevel * 0.03);

  avatar.style.transform = `scale(${scale})`;
  avatar.style.filter = `brightness(${glow})`;
}
