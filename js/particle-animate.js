// 引入 Matter.js
const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
} = Matter;

// 全局宣告 mouseConstraint（解決作用域問題）
let mouseConstraint;

// 找到 #particle-animate 容器
const container = document.getElementById("particle-animate");

// 設定 Canvas 尺寸
const canvasWidth = container.clientWidth;
const canvasHeight = container.clientHeight;

// 檢查視窗寬度
const windowWidth = window.innerWidth;

// 根據寬度決定是否需要放大元素
let scaleFactor = 1;
if (windowWidth > 1280) {
  scaleFactor = 1.2; // 放大1.2倍
}

// 根據寬度決定元素生成的數量
let objectCount = Math.floor(Math.random() * 24) + 12; // 預設隨機數量
if (windowWidth < 992) {
  objectCount = 12; // 裝置寬度小於992時，固定為12個
}

// 建立 Matter.js 物理引擎
const engine = Engine.create();
const world = engine.world;

// 創建渲染器
const render = Render.create({
  element: container, // 將 Canvas 放進 #particle-animate 容器中
  engine: engine,
  options: {
    width: canvasWidth,
    height: canvasHeight,
    wireframes: false,
    background: "transparent", // 背景透明
  },
});

// 創建世界邊界（上下左右牆壁）
const boundaries = [
  Bodies.rectangle(canvasWidth / 2, -10, canvasWidth, 20, {
    isStatic: true,
    render: { visible: false },
  }),
  Bodies.rectangle(canvasWidth / 2, canvasHeight + 10, canvasWidth, 20, {
    isStatic: true,
    render: { visible: false },
  }),
  Bodies.rectangle(-10, canvasHeight / 2, 20, canvasHeight, {
    isStatic: true,
    render: { visible: false },
  }),
  Bodies.rectangle(canvasWidth + 10, canvasHeight / 2, 20, canvasHeight, {
    isStatic: true,
    render: { visible: false },
  }),
];
World.add(world, boundaries);

// 預載圖片函數（確保圖片載入完成）
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

// 隨機位置和角度創建掉落物件（需等待圖片載入）
async function createImageObject(img) {
  const x = Math.random() * (canvasWidth - scaleFactor * 60) + scaleFactor * 30;
  const y = Math.random() * (canvasHeight / 2) + scaleFactor * 30;
  const angle = Math.random() * Math.PI * 2;

  return Bodies.circle(x, y, scaleFactor * 30, {
    restitution: 0.7,
    friction: 0.1,
    frictionAir: 0.02,
    density: 0.005,
    angle: angle,
    render: {
      sprite: {
        texture: img.src, // 使用已載入的圖片物件
        xScale: 0.5 * scaleFactor,
        yScale: 0.5 * scaleFactor,
      },
    },
  });
}

// 主初始化函數（使用 async 確保圖片全部載入）
async function initialize() {
  try {
    // 確保圖片載入完成
    const img = await loadImage("../images/Logo_Coin.svg");

    // 創建所有物件（等待所有物件生成完成）
    const objects = await Promise.all(
      Array.from({ length: objectCount }, () => createImageObject(img))
    );

    // 加入物理世界
    World.add(world, objects);

    // 增加滑鼠拖曳互動
    const mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        damping: 0.1,
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    // 邊界處理
    Events.on(engine, "beforeUpdate", function () {
      objects.forEach((obj) => {
        // 如果物件超出下方範圍，重置到畫布上方
        if (obj.position.y > canvasHeight + 50) {
          Matter.Body.setPosition(obj, {
            x: Math.random() * canvasWidth,
            y: -50,
          });
          Matter.Body.setVelocity(obj, { x: 0, y: 0 });
        }

        // 如果物件超出左邊界，反彈
        if (obj.position.x - scaleFactor * 30 < 0) {
          Matter.Body.setPosition(obj, {
            x: scaleFactor * 30,
            y: obj.position.y,
          });
          Matter.Body.setVelocity(obj, {
            x: -obj.velocity.x,
            y: obj.velocity.y,
          });
        }

        // 如果物件超出右邊界，反彈
        if (obj.position.x + scaleFactor * 30 > canvasWidth) {
          Matter.Body.setPosition(obj, {
            x: canvasWidth - scaleFactor * 30,
            y: obj.position.y,
          });
          Matter.Body.setVelocity(obj, {
            x: -obj.velocity.x,
            y: obj.velocity.y,
          });
        }

        // 如果物件超出上方範圍，反彈
        if (obj.position.y - scaleFactor * 30 < 0) {
          Matter.Body.setPosition(obj, {
            x: obj.position.x,
            y: scaleFactor * 30,
          });
          Matter.Body.setVelocity(obj, {
            x: obj.velocity.x,
            y: -obj.velocity.y,
          });
        }
      });
    });

    // 啟動掉落效果
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startDropEffect();
          observer.unobserve(container);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(container);
  } catch (error) {
    console.error("初始化失敗:", error);
  }
}

// 啟動掉落效果
function startDropEffect() {
  const runner = Runner.create();
  Runner.run(runner, engine);
  Render.run(render);
}

// 執行初始化
initialize();

// 監聽滑鼠離開事件
container.addEventListener("mouseout", function () {
  if (mouseConstraint) {
    World.remove(world, mouseConstraint);
  }
});

// 監聽滑鼠進入事件，以便在滑鼠進入時重新添加約束
container.addEventListener("mouseover", function () {
  if (mouseConstraint) {
    World.remove(world, mouseConstraint);
  }
  const mouse = Mouse.create(render.canvas);
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      damping: 0.1,
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);
});
