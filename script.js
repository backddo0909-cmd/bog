const dogImage = document.getElementById("dogImage");
const loading = document.getElementById("loading");
const newDogBtn = document.getElementById("newDogBtn");
const likeBtn = document.getElementById("likeBtn");
const saveBtn = document.getElementById("saveBtn");
const dogCountEl = document.getElementById("dogCount");
const favCountEl = document.getElementById("favCount");
const dogBreedEl = document.getElementById("dogBreed");
const aiCommentEl = document.getElementById("aiComment");
const autoSlideCheck = document.getElementById("autoSlideCheck");
const favoritesGrid = document.getElementById("favoritesGrid");

// 특수 효과 레이어 모듈 바인딩
const weatherIcon = document.getElementById("weatherIcon");
const weatherText = document.getElementById("weatherText");
const weatherLayer = document.getElementById("weatherLayer");
const toyRainLayer = document.getElementById("toyRainLayer");
const puffLayer = document.getElementById("puffLayer");

let viewCount = 0;
let currentImgUrl = "";
let currentBreed = "";
let slideInterval = null;
let favoriteDogs = [];

// 20가지 확장 AI 코멘트 데이터
const aiComments = [
  "초롱초롱한 눈망울이 매력적이네요! 당장 최고급 간식을 대령해야 할 비주얼입니다.",
  "이 각도는 완전 견생샷이네요. 카메라 마사지를 제대로 아는 똑똑한 친구군요.",
  "바람을 느끼는 귀가 너무 사랑스럽습니다. 지금 당장 산책 나가고 싶어 보여요!",
  "이 세상 귀여움이 아닙니다. 보기만 해도 오늘 쌓인 피로가 싹 녹아내리네요.",
  "위풍당당함과 댕청미가 공존하는 마법 같은 밸런스! 아주 훌륭한 댕댕이 인재입니다.",
  "렌즈를 정면으로 바라보는 저 당당함, 예사 스웨그가 아닙니다. 장차 슈퍼스타가 될 상이네요.",
  "복슬복슬한 털에 딱 한 번만 파묻혀보고 싶어지는 마성의 촉감을 지녔을 것 같아요.",
  "누구보다 신나 보이는 저 꼬리 스윙 속도! 햅쌀 같은 긍정 에너지가 뿜어져 나옵니다.",
  "우아함의 극치군요. 마치 귀족 가문에서 조기 교육을 받고 자란 듯한 기품이 흐릅니다.",
  "살짝 갸우뚱하는 고개 짓에 제 심장이 멈췄습니다. 이건 유죄입니다, 유죄!",
  "아침에 일어났을 때 이런 얼굴로 쳐다봐 준다면 매일 하루가 행복 가득할 텐데요.",
  "포근한 식빵 구운 냄새가 날 것만 같은 치명적인 뒤태 혹은 옆태의 소유자입니다.",
  "동글동글한 코와 야무진 입매를 보세요! 장난기가 아주 가득 차 있는 장난꾸러기 계열입니다.",
  "세상의 모든 비밀을 품고 있는 듯한 저 깊고 아련한 눈빛... 간식을 갈구하는 눈빛이겠죠?",
  "치즈처럼 말랑하고 푹신해 보여요. 만지는 순간 힐링 지수가 200% 충전될 것 같습니다.",
  "어딘지 모르게 억울해 보이는 저 눈썹 모양이 킬링 포인트! 평생 지켜주고 싶어집니다.",
  "한 귀여움 하는 댕댕이 세계관에서도 상위 1%에 링크될 만한 무결점 외모 스펙트럼입니다.",
  "자유로운 영혼의 아우라가 느껴집니다. 잔디밭을 주름잡는 폭주 기관차가 아닐까 싶네요.",
  "인형이 걸어 다니는 줄 알았는데 진짜 강아지라니, 자연의 신비는 정말 위대합니다.",
  "존재 자체로 인류의 평화에 이바지하는 중입니다. 사진 찍어주신 집사님께 감사패를 보냅시다."
];

// 날씨 프리셋 템플릿 정보
const weatherPresets = [
  { text: "맑음", icon: "☀️", bg: ["#fffbeb", "#fef3c7"], effect: "sunny" },
  { text: "비", icon: "🌧️", bg: ["#e2e8f0", "#cbd5e1"], effect: "rain" },
  { text: "눈", icon: "❄️", bg: ["#f1f5f9", "#e2e8f0"], effect: "snow" },
  { text: "흐림/안개", icon: "☁️", bg: ["#eceff1", "#cfd8dc"], effect: "cloudy" }
];

// [NEW] 1. 랜덤 날씨 엔진 + 기후 맞춤형 배경색 처리
function applyRandomWeather() {
  // 날씨 레이어 초기화
  weatherLayer.innerHTML = "";
  
  const randomWeather = weatherPresets[Math.floor(Math.random() * weatherPresets.length)];
  weatherIcon.textContent = randomWeather.icon;
  weatherText.textContent = randomWeather.text;
  
  // 기후 테마 색상 그라데이션 자연스럽게 바디에 바인딩
  document.body.style.backgroundColor = randomWeather.bg[0];

  // 환경 입자 렌더링 (비나 눈일 경우 하늘에서 내리게 됨)
  if (randomWeather.effect === "rain" || randomWeather.effect === "snow") {
    for (let i = 0; i < 30; i++) {
      const drop = document.createElement("div");
      drop.className = "weather-drop";
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = `${Math.random() * -20}px`;
      
      const duration = Math.random() * 2 + 1.5;
      drop.style.animationDuration = `${duration}s`;
      drop.style.animationDelay = `${Math.random() * 2}s`;
      drop.style.animationIterationCount = "infinite";

      if (randomWeather.effect === "rain") {
        drop.style.width = "1.5px";
        drop.style.height = "15px";
        drop.style.background = "rgba(79, 124, 255, 0.4)";
      } else {
        drop.style.width = `${Math.random() * 4 + 3}px`;
        drop.style.height = drop.style.width;
        drop.style.borderRadius = "50%";
        drop.style.background = "rgba(255, 255, 255, 0.9)";
      }
      weatherLayer.appendChild(drop);
    }
  }
}

// [NEW] 2. 1번 아이디어 - 뼈다귀 & 장난감 비 효과 (Rain Effect)
function createToyRain() {
  toyRainLayer.innerHTML = "";
  const toys = ["🦴", "⚽", "🧶", "🧸"];
  const spawnCount = 8; // 화면 과부하를 막는 쾌적한 개수

  for (let i = 0; i < spawnCount; i++) {
    const toy = document.createElement("div");
    toy.className = "falling-toy";
    toy.textContent = toys[Math.floor(Math.random() * toys.length)];
    
    toy.style.left = `${Math.random() * 95}%`;
    toy.style.animationDuration = `${Math.random() * 2.5 + 2}s`; // 떨어지는 속도 변주
    toy.style.animationDelay = `${Math.random() * 0.6}s`;
    
    toyRainLayer.appendChild(toy);
    setTimeout(() => toy.remove(), 4500);
  }
}

// [NEW] 3. 3번 아이디어 - 폭신폭신 털 뭉치 구름 효과 (Puff Effect)
function createFluffyPuffs() {
  puffLayer.innerHTML = "";
  const count = Math.floor(Math.random() * 4) + 3; // 카드 주변 3~6개 팝핑

  for (let i = 0; i < count; i++) {
    const puff = document.createElement("div");
    puff.className = "fluffy-puff";
    
    // 카드 주변 외곽에 퍼지도록 무작위 좌표 설정
    const x = Math.random() * 85;
    const y = Math.random() * 80;
    const size = Math.random() * 25 + 15; // 15px ~ 40px 구름 크기 균형

    puff.style.left = `${x}%`;
    puff.style.top = `${y}%`;
    puff.style.width = `${size}px`;
    puff.style.height = `${size}px`;
    puff.style.animationDelay = `${Math.random() * 0.4}s`;

    puffLayer.appendChild(puff);
    setTimeout(() => puff.remove(), 2000);
  }
}

// 4. 데이터 가공 및 기초 동작 함수들
function parseBreed(url) {
  try {
    const part = url.split("/breeds/")[1];
    const breedRaw = part.split("/")[0];
    return breedRaw.split("-").reverse().join(" ");
  } catch (e) {
    return "밀크코코아 댕댕이";
  }
}

function generateRandomStats() {
  ["stat-cute", "stat-energy", "stat-friendly"].forEach(id => {
    const rating = Math.floor(Math.random() * 3) + 3; // 3~5성 배치
    document.getElementById(id).textContent = "⭐".repeat(rating);
  });
}

// 5. 메인 로직: 드로우 이벤트 연동
async function getDogImage() {
  loading.style.display = "block";
  likeBtn.disabled = true;

  try {
    const response = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await response.json();

    currentImgUrl = data.message;
    dogImage.src = currentImgUrl;

    dogImage.onload = () => {
      loading.style.display = "none";
      likeBtn.disabled = false;
      
      viewCount++;
      dogCountEl.textContent = viewCount;

      currentBreed = parseBreed(currentImgUrl);
      dogBreedEl.textContent = `📋 품종 카드: ${currentBreed}`;
      
      const randomIdx = Math.floor(Math.random() * aiComments.length);
      aiCommentEl.textContent = `🤖 AI 감상: "${aiComments[randomIdx]}"`;

      // 특수 파트 및 확장 비주얼 이펙트 3연타 동시 가동!
      generateRandomStats();
      applyRandomWeather();
      createToyRain();
      createFluffyPuffs();
    };

  } catch (error) {
    loading.textContent = "댕댕이가 소풍을 떠났나 봐요! 다시 시도해 주세요.";
    likeBtn.disabled = false;
    console.error(error);
  }
}

// 6. 보관함 찜 & 찜 삭제 취소 처리
function handleLike() {
  if (!currentImgUrl) return;
  if (favoriteDogs.includes(currentImgUrl)) {
    alert("이미 보관함에 등록된 컬렉션 카드입니다!"); return;
  }
  if (favoriteDogs.length >= 5) {
    alert("보관함 공간이 부족해요! 기존 카드를 정리해 주세요."); return;
  }
  favoriteDogs.push(currentImgUrl);
  renderFavorites();
}

function renderFavorites() {
  favoritesGrid.innerHTML = "";
  favoriteDogs.forEach((url, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "fav-wrapper";
    wrapper.onclick = () => removeFavorite(index);

    const img = document.createElement("img");
    img.src = url; img.className = "fav-item";
    
    wrapper.appendChild(img);
    favoritesGrid.appendChild(wrapper);
  });
  favCountEl.textContent = favoriteDogs.length;
}

function removeFavorite(index) {
  if (confirm("선택한 강아지 카드를 보관함에서 해제하시겠습니까?")) {
    favoriteDogs.splice(index, 1);
    renderFavorites();
  }
}

function handleSave() {
  if (currentImgUrl) window.open(currentImgUrl, '_blank');
}

// 7. 자동 재생 타이머 제어
autoSlideCheck.addEventListener("change", (e) => {
  if (e.target.checked) {
    slideInterval = setInterval(getDogImage, 5000);
  } else {
    clearInterval(slideInterval);
    slideInterval = null;
  }
});

newDogBtn.addEventListener("click", () => {
  if (autoSlideCheck.checked) {
    clearInterval(slideInterval);
    slideInterval = setInterval(getDogImage, 5000);
  }
  getDogImage();
});

likeBtn.addEventListener("click", handleLike);
saveBtn.addEventListener("click", handleSave);

// 이니셜 기동
getDogImage();
