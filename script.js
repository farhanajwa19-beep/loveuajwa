const typewriterElement = document.getElementById('typewriter');
let audioContext = null;

function ensureAudio() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration = 0.12, type = 'sine', volume = 0.04, delay = 0) {
  const ctx = ensureAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const startTime = ctx.currentTime + delay;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

function playClickSound() {
  playTone(620, 0.06, 'triangle', 0.03);
  setTimeout(() => playTone(820, 0.05, 'triangle', 0.024), 50);
}

const cupcakeScreen = document.getElementById('cupcakeScreen');
const cupcakeButton = document.getElementById('cupcakeButton');
const wishHint = document.getElementById('wishHint');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let wishStage = 0;

cupcakeButton.addEventListener('click', () => {
  if (wishStage === 2) return;
  if (wishStage === 0) {
    wishStage = 1;
    cupcakeButton.classList.add('is-lit');
    cupcakeButton.setAttribute('aria-label', 'Blow out the candle and open the site');
    wishHint.textContent = 'Make your wish… then tap to blow it out';
    document.querySelectorAll('.wish-steps span')[1].classList.add('active');
    return;
  }
  startMusic();
  wishStage = 2;
  cupcakeButton.setAttribute('aria-disabled', 'true');
  cupcakeButton.classList.remove('is-lit');
  cupcakeButton.classList.add('is-blown');
  wishHint.textContent = 'My wish? You. Always. ♡';
  if (!reducedMotion.matches) {
    const bounds = cupcakeButton.getBoundingClientRect();
    const confetti = document.getElementById('wishConfetti');
    for (let i = 0; i < 36; i++) {
      const piece = document.createElement('span');
      piece.textContent = i % 3 === 0 ? '✦' : '♥';
      piece.style.setProperty('--origin-x', `${bounds.left + bounds.width / 2}px`);
      piece.style.setProperty('--origin-y', `${bounds.top + bounds.height * .4}px`);
      piece.style.setProperty('--x', `${(Math.random() - .5) * 650}px`);
      piece.style.setProperty('--y', `${(Math.random() - .65) * 600}px`);
      piece.style.setProperty('--rotation', `${(Math.random() - .5) * 180}deg`);
      piece.style.setProperty('--size', `${10 + Math.random() * 15}px`);
      piece.style.setProperty('--color', ['#fff5e7', '#bd4775', '#e579a2'][i % 3]);
      confetti.appendChild(piece);
    }
  }
  setTimeout(() => {
    document.body.classList.remove('wish-pending');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.querySelector('.page-shell').inert = false;
    cupcakeScreen.classList.add('revealing');
    typewriterElement.focus({ preventScroll: true });
    setTimeout(() => cupcakeScreen.remove(), reducedMotion.matches ? 0 : 950);
  }, reducedMotion.matches ? 350 : 1400);
});

const heartContainer = document.getElementById('floating-hearts');

function createFloatingHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart-particle';
  heart.textContent = ['❤', '♥', '♡'][Math.floor(Math.random() * 3)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${16 + Math.random() * 22}px`;
  heart.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 180}px`);
  heart.style.animationDuration = `${8 + Math.random() * 8}s`;
  heart.style.animationDelay = `${Math.random() * 1.5}s`;
  heartContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 15000);
}

setInterval(() => {
  if (!document.body.classList.contains('wish-pending') && !reducedMotion.matches) createFloatingHeart();
}, 600);

const sparkleBtn = document.getElementById('sparkleBtn');

sparkleBtn.addEventListener('click', () => {
  playClickSound();
  for (let i = 0; i < 18; i += 1) {
    const burst = document.createElement('span');
    burst.className = 'heart-particle';
    burst.textContent = '❤';
    burst.style.left = `${sparkleBtn.getBoundingClientRect().left + sparkleBtn.offsetWidth / 2}px`;
    burst.style.top = `${sparkleBtn.getBoundingClientRect().top + sparkleBtn.offsetHeight / 2}px`;
    burst.style.fontSize = `${20 + Math.random() * 20}px`;
    burst.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 220}px`);
    burst.style.animationDuration = `${2.2 + Math.random() * 2.4}s`;
    heartContainer.appendChild(burst);

    setTimeout(() => burst.remove(), 4500);
  }

  sparkleBtn.animate(
    [
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(255, 105, 180, 0)' },
      { transform: 'scale(1.08)', boxShadow: '0 0 30px rgba(255, 105, 180, 0.7)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(255, 105, 180, 0)' }
    ],
    { duration: 500, easing: 'ease-out' }
  );
});

const loveMeter = document.getElementById('loveMeter');
const loveBoost = document.getElementById('loveBoost');
const finalMessageBtn = document.getElementById('finalMessageBtn');
const finalMessage = document.getElementById('finalMessage');
const daysSinceNode = document.getElementById('daysSince');
let loveLevel = 52;

finalMessageBtn.addEventListener('click', () => {
  finalMessage.classList.toggle('hidden');
  finalMessageBtn.textContent = finalMessage.classList.contains('hidden') ? 'A little P.S. for you ♡' : 'I love you ♡';
  finalMessageBtn.setAttribute('aria-expanded', String(!finalMessage.classList.contains('hidden')));
  playClickSound();
});

function updateDaysSinceStart() {
  const startDate = new Date('2025-12-31T00:00:00');
  const now = new Date();
  const diffMs = now - startDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  daysSinceNode.textContent = diffDays;
}

updateDaysSinceStart();

const lovePanel = document.querySelector('.love-meter-panel');
const loveStatus = document.getElementById('loveStatus');
const meterTrack = document.querySelector('.meter');
const loveKitty = document.getElementById('loveKitty');
const kittyReaction = document.getElementById('kittyReaction');
// Preload reaction stickers so a fast tapping spree never shows an empty image.
['296902-catevil.png', '278650-catexcited.png'].forEach((file) => {
  const sticker = new Image();
  sticker.src = `cute-gifs/${file}`;
});
let loveBroken = false;
let lastLoveBurst = 0;
loveBoost.addEventListener('click', () => {
  loveLevel += 8;
  if (!loveBroken) {
    loveMeter.style.width = `${Math.min(loveLevel, 100)}%`;
    meterTrack.setAttribute('aria-valuenow', String(Math.min(loveLevel, 100)));
    if (loveLevel >= 100) {
      lovePanel.classList.add('love-overloading');
      loveKitty.src = 'cute-gifs/296902-catevil.png';
      kittyReaction.textContent = 'hehe... keep going';
      loveStatus.textContent = '100%... wait, theres more? ♡';
    }
    if (loveLevel >= 132) {
      loveBroken = true;
      loveKitty.src = 'cute-gifs/278650-catexcited.png';
      loveKitty.classList.add('kitty-celebrating');
      kittyReaction.textContent = 'I KNEW IT!! ♡';
      lovePanel.classList.remove('love-overloading');
      lovePanel.classList.add('love-broken');
      loveStatus.innerHTML = '<strong>???</strong><span>oops... our love broke the meter ♡<br>too much love to fit in here</span>';
      meterTrack.setAttribute('aria-valuetext', 'Beyond measure. Our love broke the meter!');
    }
  }
  // Keep rapid taps responsive without accumulating unlimited particles or sounds.
  const now = performance.now();
  if (now - lastLoveBurst < 140) return;
  lastLoveBurst = now;
  playClickSound();
  if (reducedMotion.matches) return;
  const bounds = loveBoost.getBoundingClientRect();
  for (let i = 0; i < (loveBroken ? 16 : 6); i++) {
    const heart = document.createElement('span');
    heart.className = 'love-burst';
    heart.textContent = i % 3 ? '♥' : '✦';
    heart.style.left = `${bounds.left + bounds.width / 2}px`;
    heart.style.top = `${bounds.top + bounds.height / 2}px`;
    heart.style.setProperty('--x', `${(Math.random() - .5) * 300}px`);
    heart.style.setProperty('--y', `${-60 - Math.random() * 220}px`);
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  }
});

function getNext31stDate() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  while (true) {
    const candidate = new Date(year, month, 31, 0, 0, 0, 0);
    if (candidate.getMonth() === month && candidate > now) {
      return candidate;
    }

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
}

function updateCountdown() {
  const countdownNode = document.getElementById('countdown');
  const target = getNext31stDate();
  const now = new Date();

  const diff = target - now;
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownNode.innerHTML = `
    <div class="countdown-item"><strong>${days}</strong>Days</div>
    <div class="countdown-item"><strong>${hours}</strong>Hours</div>
    <div class="countdown-item"><strong>${minutes}</strong>Min</div>
    <div class="countdown-item"><strong>${seconds}</strong>Sec</div>
  `;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const memoryDialog = document.getElementById('memoryDialog');
const memoryFullImage = document.getElementById('memoryFullImage');
document.querySelectorAll('.memory-photo').forEach((button) => {
  button.addEventListener('click', () => {
    const photo = button.querySelector('img');
    memoryFullImage.src = photo.src;
    memoryFullImage.alt = photo.alt;
    document.getElementById('memoryCaption').textContent = button.closest('.memory-card').querySelector('h3').textContent;
    memoryDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.getElementById('closeMemory').addEventListener('click', () => memoryDialog.close());
memoryDialog.addEventListener('click', (event) => {
  if (event.target === memoryDialog) {
    const rect = memoryDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) memoryDialog.close();
  }
});
memoryDialog.addEventListener('close', () => { document.body.style.overflow = ''; });

// A local original instrumental; playback begins with the cupcake gesture.
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
backgroundMusic.volume = 0.45;
let musicStarting = false;
let lastMusicPointer = -Infinity;
function updateMusicControl() {
  const playing = !backgroundMusic.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
  musicLabel.textContent = playing ? 'Music on' : 'Music off';
}
async function startMusic() {
  if (musicStarting) return;
  musicStarting = true;
  musicLabel.textContent = 'Loading music…';
  try {
    if (backgroundMusic.error) backgroundMusic.load();
    backgroundMusic.muted = false;
    await backgroundMusic.play();
    updateMusicControl();
  } catch (error) {
    musicLabel.textContent = 'Tap to retry ♫';
    musicToggle.setAttribute('aria-label', 'Retry background music');
    musicToggle.setAttribute('aria-pressed', 'false');
    console.warn('Music playback did not start:', error.name);
  } finally {
    musicStarting = false;
  }
}
function toggleMusic() {
  if (backgroundMusic.paused) startMusic();
  else { backgroundMusic.pause(); updateMusicControl(); }
}
// Start directly within the touch/mouse gesture; ignore its following click.
musicToggle.addEventListener('pointerup', (event) => {
  if (event.button !== 0) return;
  lastMusicPointer = performance.now();
  toggleMusic();
});
musicToggle.addEventListener('click', () => {
  if (performance.now() - lastMusicPointer < 500) return;
  toggleMusic();
});
backgroundMusic.addEventListener('playing', updateMusicControl);
backgroundMusic.addEventListener('pause', updateMusicControl);
backgroundMusic.addEventListener('error', () => {
  musicLabel.textContent = 'Tap to retry ♫';
  musicToggle.setAttribute('aria-label', 'Retry background music');
  musicToggle.setAttribute('aria-pressed', 'false');
});
