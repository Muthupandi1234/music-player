const audio = document.getElementById("main-audio");
const playBtn = document.querySelector(".play-pause");
const playIcon = playBtn.querySelector("i");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressBar = document.querySelector(".progress-bar");
const progressArea = document.querySelector(".progress-area");
const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".max-duration");
const volumeSlider = document.querySelector("input[type='range']");
const playlistItems = document.querySelectorAll(".playlist li");

const songs = Array.from(playlistItems).map(item => ({
  name: item.textContent,
  src: item.getAttribute("data-src")
}));

let currentSongIndex = 0;

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  document.querySelector(".name").textContent = song.name.split(" - ")[0];
  document.querySelector(".artist").textContent = song.name.split(" - ")[1] || "Unknown";
  highlightPlaylist(index);
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playIcon.classList.replace("fa-play", "fa-pause");
  } else {
    audio.pause();
    playIcon.classList.replace("fa-pause", "fa-play");
  }
}

audio.addEventListener("timeupdate", () => {
  const current = audio.currentTime;
  const duration = audio.duration;
  if (!duration) return;

  const percent = (current / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(duration);
});

progressArea.addEventListener("click", e => {
  const width = progressArea.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playIcon.classList.replace("fa-play", "fa-pause");
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playIcon.classList.replace("fa-play", "fa-pause");
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

playlistItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    audio.play();
    playIcon.classList.replace("fa-play", "fa-pause");
  });
});

function highlightPlaylist(index) {
  playlistItems.forEach((item, i) => {
    item.style.background = i === index ? "#1a1a1a" : "";
  });
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("ended", nextSong);

loadSong(currentSongIndex);

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
});


