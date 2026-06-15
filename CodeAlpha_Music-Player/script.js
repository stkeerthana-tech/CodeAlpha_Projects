const playlist = [
  {
    title:  "Midnight Drive",
    artist: "Luna & The Waves",
    src:    "songs/song1.mp3",
    cover:  "images/song1.jpg"
  },
  {
    title:  "Golden Hour",
    artist: "The Dusk Collective",
    src:    "songs/song2.mp3",
    cover:  "images/song2.jpg"
  },
  {
    title:  "Neon Rain",
    artist: "Cipher Bloom",
    src:    "songs/song3.mp3",
    cover:  "images/song3.jpg"
  },
  {
    title:  "Starfall",
    artist: "Vela & Echo",
    src:    "songs/song4.mp3",
    cover:  "images/song4.jpg"
  },
  {
    title:  "Quiet Storm",
    artist: "Arbour Sound",
    src:    "songs/song5.mp3",
    cover:  "images/song5.jpg"
  }
];


const audio         = document.getElementById("audio-player");

const albumCover    = document.getElementById("album-cover");
const songTitle     = document.getElementById("song-title");
const artistName    = document.getElementById("artist-name");

const progressTrack = document.getElementById("progress-track");
const progressFill  = document.getElementById("progress-fill");
const progressThumb = document.getElementById("progress-thumb");
const currentTimeEl = document.getElementById("current-time");
const totalDurEl    = document.getElementById("total-duration");

const btnPlay       = document.getElementById("btn-play");
const btnPrev       = document.getElementById("btn-prev");
const btnNext       = document.getElementById("btn-next");
const iconPlay      = document.getElementById("icon-play");
const iconPause     = document.getElementById("icon-pause");

const volumeSlider  = document.getElementById("volume-slider");
const volLabel      = document.getElementById("vol-label");
const btnMute       = document.getElementById("btn-mute");
const iconVolOn     = document.getElementById("icon-vol-on");
const iconVolOff    = document.getElementById("icon-vol-off");

const playlistEl    = document.getElementById("playlist");


let currentIndex  = 0;     
let isPlaying     = false;  
let isMuted       = false;  
let lastVolume    = 0.8;    


function init() {
  buildPlaylist();          
  loadSong(currentIndex);   
  audio.volume = parseFloat(volumeSlider.value);   
}


function loadSong(index) {
  const song = playlist[index];

  audio.src = song.src;

  albumCover.style.opacity = "0";
  setTimeout(() => {
    albumCover.src           = song.cover;
    albumCover.alt           = `${song.title} by ${song.artist}`;
    albumCover.style.opacity = "1";
    albumCover.style.transition = "opacity 0.4s ease";
  }, 200);

  songTitle.classList.remove("updating");
  artistName.classList.remove("updating");

  void songTitle.offsetWidth;

  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  songTitle.classList.add("updating");
  artistName.classList.add("updating");

  setProgressUI(0);
  currentTimeEl.textContent = "0:00";
  totalDurEl.textContent    = "0:00";

  updateActiveItem(index);
}


function playSong() {
  audio.play();
  isPlaying = true;

  iconPlay.style.display  = "none";
  iconPause.style.display = "block";

  document.body.classList.add("playing");
}


function pauseSong() {
  audio.pause();
  isPlaying = false;

  iconPlay.style.display  = "block";
  iconPause.style.display = "none";

  document.body.classList.remove("playing");
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}


function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);

  if (isPlaying) {
    playSong();
  }
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    if (isPlaying) playSong();
    return;
  }

  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);

  if (isPlaying) {
    playSong();
  }
}

function updateProgress() {
  const duration = audio.duration;
  const current  = audio.currentTime;

  if (!duration || isNaN(duration)) return;

  const pct = (current / duration) * 100;   

  setProgressUI(pct);

  currentTimeEl.textContent = formatTime(current);
  totalDurEl.textContent    = formatTime(duration);

  progressTrack.setAttribute("aria-valuenow", Math.round(pct));
}

function setProgressUI(pct) {
  progressFill.style.width = pct + "%";
  progressThumb.style.left = pct + "%";
}


function seekTo(event) {
  const rect    = progressTrack.getBoundingClientRect();
  const clickX  = event.clientX - rect.left; 
  const ratio   = Math.max(0, Math.min(1, clickX / rect.width)); 

  if (audio.duration && !isNaN(audio.duration)) {
    audio.currentTime = ratio * audio.duration;
    setProgressUI(ratio * 100);
  }
}


function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}


function setVolume() {
  const vol = parseFloat(volumeSlider.value);
  audio.volume = vol;
  lastVolume   = vol;
  volLabel.textContent = Math.round(vol * 100) + "%";

  
  if (isMuted && vol > 0) {
    isMuted = false;
    iconVolOn.style.display  = "block";
    iconVolOff.style.display = "none";
    audio.muted = false;
  }

  if (vol === 0) {
    iconVolOn.style.display  = "none";
    iconVolOff.style.display = "block";
  } else {
    iconVolOn.style.display  = "block";
    iconVolOff.style.display = "none";
  }
}


function toggleMute() {
  if (isMuted) {
  
    isMuted            = false;
    audio.muted        = false;
    audio.volume       = lastVolume;
    volumeSlider.value = lastVolume;
    volLabel.textContent = Math.round(lastVolume * 100) + "%";
    iconVolOn.style.display  = "block";
    iconVolOff.style.display = "none";
  } else {
    
    isMuted      = true;
    lastVolume   = audio.volume;   
    audio.muted  = true;
    volumeSlider.value = 0;
    volLabel.textContent = "0%";
    iconVolOn.style.display  = "none";
    iconVolOff.style.display = "block";
  }
}


function buildPlaylist() {
  
  playlistEl.innerHTML = "";

  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.className    = "playlist-item";
    li.dataset.index = index;              
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");

    li.innerHTML = `
      <!-- Track number -->
      <span class="pl-num">${index + 1}</span>

      <!-- Small album thumbnail -->
      <img class="pl-thumb" src="${song.cover}" alt="${song.title} cover" />

      <!-- Title + artist -->
      <div class="pl-info">
        <span class="pl-title">${song.title}</span>
        <span class="pl-artist">${song.artist}</span>
      </div>

      <!-- Animated bars shown only on active + playing row -->
      <div class="pl-playing-icon" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    `;

    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });

    playlistEl.appendChild(li);
  });
}


function updateActiveItem(index) {
  
  document.querySelectorAll(".playlist-item").forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-selected", "false");
  });

  const activeItem = document.querySelector(`.playlist-item[data-index="${index}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
    activeItem.setAttribute("aria-selected", "true");

    activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}


btnPlay.addEventListener("click", togglePlay);
btnNext.addEventListener("click", nextSong);
btnPrev.addEventListener("click", prevSong);


volumeSlider.addEventListener("input", setVolume);
btnMute.addEventListener("click", toggleMute);

progressTrack.addEventListener("click", seekTo);

progressTrack.addEventListener("keydown", (e) => {
  if (!audio.duration) return;
  const step = 5; 
  if (e.key === "ArrowRight") {
    audio.currentTime = Math.min(audio.currentTime + step, audio.duration);
  } else if (e.key === "ArrowLeft") {
    audio.currentTime = Math.max(audio.currentTime - step, 0);
  }
});

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("loadedmetadata", () => {
  totalDurEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  nextSong();
  playSong();   
});

document.addEventListener("keydown", (e) => {

  if (
    e.target.tagName === "BUTTON" ||
    e.target.tagName === "INPUT"
  ) return;

  if (e.code === "Space") {
    e.preventDefault();   
    togglePlay();
  }
});


document.addEventListener("DOMContentLoaded", init);