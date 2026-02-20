const m3uUrl = 'https://raw.githubusercontent.com/tv-bd1/FM-Radio/refs/heads/main/FM-Playlist.m3u';
const audio = document.getElementById('mainAudio');
const playBtn = document.getElementById('playBtn');
const drawer = document.getElementById('playlistDrawer');

// ১. ড্রয়ার টগল
document.getElementById('menuToggle').onclick = () => drawer.classList.toggle('open');

// ২. M3U ডেটা ফেচ এবং প্রসেস
async function loadStations() {
    try {
        const response = await fetch(m3uUrl);
        const data = await response.text();
        const lines = data.split('\n');
        const list = document.getElementById('stationList');
        list.innerHTML = '';

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('#EXTINF')) {
                const info = lines[i].split(',');
                const name = info[1] || "Unknown Radio";
                const url = lines[i + 1]?.trim();
                
                if(url && url.startsWith('http')) {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-play"></i> <span>${name}</span>`;
                    li.onclick = () => playRadio(url, name);
                    list.appendChild(li);
                }
            }
        }
    } catch (err) {
        console.error("Error loading M3U:", err);
    }
}

// ৩. রেডিও প্লে ফাংশন
function playRadio(url, name) {
    audio.src = url;
    audio.play();
    document.getElementById('stationName').innerText = name;
    document.body.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    drawer.classList.remove('open');
}

// ৪. প্লে/পজ বাটন
playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.body.classList.add('playing');
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.body.classList.remove('playing');
    }
};

// ৫. ভলিউম কন্ট্রোল
document.getElementById('volume').oninput = (e) => {
    audio.volume = e.target.value;
};

loadStations();
