const audio = document.getElementById('audioPlayer');
const stationListUI = document.getElementById('stationList');
const playPauseBtn = document.getElementById('playPauseBtn');
const currentTitle = document.getElementById('currentTitle');
const volumeControl = document.getElementById('volume');

// ১. আপনার M3U লিঙ্কটি এখানে দিন
const M3U_URL = 'https://raw.githubusercontent.com/tv-bd1/FM-Radio/refs/heads/main/FM-Playlist.m3u'; 

async function loadPlaylist() {
    try {
        const response = await fetch(M3U_URL);
        const data = await response.text();
        parseM3U(data);
    } catch (err) {
        console.error("প্লেলিস্ট লোড করতে সমস্যা হয়েছে", err);
    }
}

function parseM3U(data) {
    const lines = data.split('\n');
    let stations = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
            const title = lines[i].split(',')[1];
            const url = lines[i + 1].trim();
            stations.push({ title, url });
        }
    }
    renderStations(stations);
}

function renderStations(stations) {
    stationListUI.innerHTML = stations.map(s => `
        <li onclick="playStation('${s.url}', '${s.title}')">
            <i class="fas fa-play-circle"></i> ${s.title}
        </li>
    `).join('');
}

function playStation(url, title) {
    audio.src = url;
    audio.play();
    currentTitle.innerText = title;
    document.getElementById('currentStatus').innerText = "এখন চলছে...";
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// প্লে/পজ কন্ট্রোল
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// ভলিউম কন্ট্রোল
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

window.onload = loadPlaylist;
