const button = document.getElementById('success');
let disabled = false;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let confettiInterval = null;

function startConfettiInterval() {
    // 避免重複啟動多個 interval
    if (confettiInterval) clearInterval(confettiInterval);
    // 立即噴一次
    winConfetti();
    // 每10秒再噴一次
    confettiInterval = setInterval(winConfetti, 6000);
}

function stopConfettiInterval() {
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cx = ctx.canvas.width / 2;
let cy = ctx.canvas.height / 2;

// Confetti 和 Sequins 陣列
let confetti = [];
let sequins = [];

// 每次觸發產生的數量
const confettiCount = 100;
const sequinCount = 50;

// 物理參數
const gravityConfetti = 0.3;
const gravitySequins = 0.55;
const dragConfetti = 0.075;
const dragSequins = 0.02;
const terminalVelocity = 3;

// 顏色設定，背面顏色較深
const colors = [
  { front: '#26D07C', back: '#008A49' }, // 綠色
  { front: '#F2FF49', back: '#FFB000' }, // 黃色
  { front: '#40C4E2', back: '#A366F5' }  // 藍色
];

// 取得指定範圍隨機數
const randomRange = (min, max) => Math.random() * (max - min) + min;

// 取得 confetti 初速度，讓飛舞更自然
const initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += (Math.random() < 0.25) ? randomRange(1, 3) : 0;
  }
  return { x: x, y: -y };
};

// Confetto 類別
function Confetto() {
  this.randomModifier = randomRange(0, 99);
  this.color = colors[Math.floor(randomRange(0, colors.length))];
  this.dimensions = {
    x: randomRange(5, 9),
    y: randomRange(8, 15),
  };
  // this.position = { // 彩帶噴出的區塊偏方型
  //   x: randomRange(canvas.width / 3, canvas.width / 3 * 2),
  //   y: randomRange(canvas.height / 4 , canvas.height / 3 * 2),
  // };
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 3; // 半徑可調整

  const angle = randomRange(0, 2 * Math.PI);
  const r = radius * Math.sqrt(Math.random());

  this.position = {
    x: centerX + r * Math.cos(angle),
    y: centerY + r * Math.sin(angle),
  };

  this.rotation = randomRange(0, 2 * Math.PI);
  this.scale = { x: 1, y: 1 };
  this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
Confetto.prototype.update = function () {
  // 速度阻力與重力
  this.velocity.x -= this.velocity.x * dragConfetti;
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

  // 位置更新
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // 旋轉效果，利用 scale.y 模擬翻轉
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
};

// Sequin 類別
function Sequin() {
  this.color = colors[Math.floor(randomRange(0, colors.length))].back;
  this.radius = randomRange(1, 2);
  this.position = {
    x: randomRange(canvas.width / 2 - button.offsetWidth / 3, canvas.width / 2 + button.offsetWidth / 3),
    y: randomRange(canvas.height / 2 + button.offsetHeight / 2 + 8, canvas.height / 2 + (1.5 * button.offsetHeight) - 8),
  };
  this.velocity = {
    x: randomRange(-20, 20),
    y: randomRange(-8, -20),
  };
}
Sequin.prototype.update = function () {
  this.velocity.x -= this.velocity.x * dragSequins;
  this.velocity.y += gravitySequins;

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

// 初始化產生 confetti 與 sequins
const initBurst = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto());
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin());
  }
};

// 繪製動畫
const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    confetto.update();

    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    ctx.fillRect(-width / 2, -height / 2, width, height);

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 避免 confetti 被按鈕遮擋
    if (confetto.velocity.y < 0) {
      ctx.clearRect(canvas.width / 2 - button.offsetWidth / 2, canvas.height / 2 + button.offsetHeight / 2, button.offsetWidth, button.offsetHeight);
    }
  });

  sequins.forEach((sequin, index) => {
    ctx.translate(sequin.position.x, sequin.position.y);

    sequin.update();

    ctx.fillStyle = sequin.color;
    ctx.beginPath();
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (sequin.velocity.y < 0) {
      ctx.clearRect(canvas.width / 2 - button.offsetWidth / 2, canvas.height / 2 + button.offsetHeight / 2, button.offsetWidth, button.offsetHeight);
    }
  });

  // 移除畫面外的 confetti 與 sequins
  confetti = confetti.filter(confetto => confetto.position.y < canvas.height);
  sequins = sequins.filter(sequin => sequin.position.y < canvas.height);

  window.requestAnimationFrame(render);
};

// 按鈕點擊觸發動畫
const winConfetti = () => {
  if (!disabled) {
    disabled = true;
    button.classList.add('loading');
    button.classList.remove('ready');

    button.classList.add('complete');
    button.classList.remove('loading');

    setTimeout(() => {
      initBurst();
      setTimeout(() => {
        disabled = false;
        button.classList.add('ready');
        button.classList.remove('complete');
      }, 4000);
    }, 320);
  }
};

// 監聽視窗大小調整，重新設定 canvas
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};
window.addEventListener('resize', resizeCanvas);

// 按鈕點擊函式
const clickButton = () => {
  winConfetti();
};

// 設定按鈕文字動畫效果
const textElements = button.querySelectorAll('.button-text');
textElements.forEach((element) => {
  const characters = element.innerText.split('');
  let characterHTML = '';
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`;
  });
  element.innerHTML = characterHTML;
});

// 啟動動畫渲染循環
render();
