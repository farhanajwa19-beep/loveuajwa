const viewer = document.getElementById('albumViewer');
const photos = [...document.querySelectorAll('.album-photo')];
let activePhoto = 0;
let returnButton;
function displayPhoto(index) {
  activePhoto = (index + photos.length) % photos.length;
  const source = photos[activePhoto].querySelector('img');
  const full = document.getElementById('albumFull');
  full.src = source.src;
  full.alt = source.alt;
  document.getElementById('albumCaption').textContent = photos[activePhoto].closest('article').querySelector('h2').textContent;
  document.getElementById('albumPosition').textContent = `${activePhoto + 1} / ${photos.length}`;
}
photos.forEach((button, index) => button.addEventListener('click', () => {
  returnButton = button;
  displayPhoto(index);
  viewer.showModal();
  document.body.style.overflow = 'hidden';
}));
document.getElementById('albumClose').addEventListener('click', () => viewer.close());
document.getElementById('albumPrev').addEventListener('click', () => displayPhoto(activePhoto - 1));
document.getElementById('albumNext').addEventListener('click', () => displayPhoto(activePhoto + 1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    displayPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const r = viewer.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) viewer.close();
});
viewer.addEventListener('close', () => {
  document.body.style.overflow = '';
  returnButton?.focus({preventScroll:true});
});
