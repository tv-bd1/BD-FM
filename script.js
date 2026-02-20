const m3uUrl = 'https://raw.githubusercontent.com/tv-bd1/FM-Radio/refs/heads/main/FM-Playlist.m3u';
// CORS সমস্যা সমাধানের জন্য প্রক্সি (যদি প্রয়োজন হয়)
const proxyUrl = 'https://api.allorigins.win/raw?url='; 

const audio = document.getElementById('mainAudio');
const playBtn = document.getElementById('playBtn');
const drawer = document.getElementById('playlistDrawer');
const stationList = document.getElementById('stationList');

// ১. ড্রয়ার টগল
document.getElementById('menuToggle').onclick = () => drawer.classList.toggle('open');

// ২. M3U ডেটা ফেচ এবং প্রসেস
async function loadStations() {
    try {
        stationList.innerHTML = '<div class="loader">লোডিং...</div>';
        
        // প্রক্সি ব্যবহার করে ডেটা ফেচ করা হচ্ছে যাতে ব্লক না হয়
        const response = await fetch(proxyUrl + encodeURIComponent(m3uUrl));
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.text();
        const lines = data.split('\n');
        stationList.innerHTML = '';

        let firstStation = null;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('#EXTINF')) {
                const info = lines[i].split(',');
                const name = info[1] ? info[1].trim() : "Unknown Radio";
                const url = lines[i + 1]?.trim();
                
                if(url && url.startsWith('http')) {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-broadcast-tower"></i> <span>${name}</span>`;
                    li.onclick = () => playRadio(url, name);
                    stationList.appendChild(li);

                    // প্রথম চ্যানেলটি সেভ করে রাখা হচ্ছে অটো-প্লে এর জন্য
                    if (!firstStation) {
                        firstStation = { url, name };
                    }
                }
            }
        }

        // ৩. প্রথম চ্যানেল অটো-প্লে লজিক
        if (firstStation) {
            playRadio(firstStation.url, firstStation.name);
        }

    } catch (err) {
        stationList.innerHTML = '<div style="color:red; padding:10px;">তালিকা লোড করা যায়নি। ইন্টারনেট চেক করুন।</div>';
        console.error("Error loading M3U:", err);
    }
}

// ৪. রেডিও প্লে ফাংশন
function playRadio(url, name) {
    audio.src = url;
    audio.play().catch(error => {
        // ব্রাউজার অটো-প্লে ব্লক করলে এখানে মেসেজ দেখাবে
        console.log("Autoplay blocked: User interaction required.");
        document.getElementById('stationName').innerText = "প্লে বাটনে ক্লিক করুন";
    });
    
    document.getElementById('stationName').innerText = name;
    document.body.classList.add('playing');
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    drawer.classList.remove('open');
}

// ৫. প্লে/পজ বাটন
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

// ৬. ভলিউম কন্ট্রোল
document.getElementById('volume').oninput = (e) => {
    audio.volume = e.target.value;
};

// অ্যাপ স্টার্ট
window.onload = loadStations;
