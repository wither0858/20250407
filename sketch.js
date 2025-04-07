// === 變數宣告區：用來儲存各種物件和設定 ===
let bambooStalks = [], leaves = [], flowers = []; // 存放竹子、葉子、花朵的資料陣列
let buttons = [], iframe; // 頁面上的按鈕和嵌入式 iframe
let sprite1, sprite2, sprite3, sprite4; // 四隻角色的動畫圖像
let sprite1Frames = [], sprite2Frames = [], sprite3Frames = [], sprite4Frames = []; // 動畫影格陣列
let sprite1Index = 0, sprite2Index = 0, sprite3Index = 0, sprite4Index = 0; // 每個角色目前顯示的影格索引
let sprite1Timer = 0, sprite2Timer = 0, sprite3Timer = 0, sprite4Timer = 0; // 每個動畫用的計時器
let isHovering = [false, false, false, false]; // 記錄滑鼠是否懸停在按鈕上
let isInPortfolioMode = false; // 是否進入作品集模式
let clouds = []; // 雲朵資料
let bambooSound; // 竹子被點擊播放的音效
let isNight = false; // 是否為黑夜模式（按下 N 鍵切換）

// === 預載入圖像和音效資源 ===
function preload() {
  sprite1 = loadImage('1_all.png');
  sprite2 = loadImage('2_all.png');
  sprite3 = loadImage('3_all.png');
  sprite4 = loadImage('4_all.png');
  soundFormats('wav');
  bambooSound = loadSound('130532__stomachache__d1.wav');
}

// === 畫布與物件初始化 ===
function setup() {
  createCanvas(windowWidth, windowHeight); // 設定畫布為整個視窗大小
  setupBamboo();     // 建立竹子資料
  setupLeaves();     // 建立落葉資料
  setupFlowers();    // 建立花朵資料
  setupButtons();    // 建立按鈕
  setupSprites();    // 切割角色動畫影格
  setupClouds();     // 建立雲朵
}

// === 每幀畫面更新函式 ===
function draw() {
  drawAtmosphere();  // 繪製背景與雲朵
  drawBamboo();      // 繪製竹子（含 hover 效果）
  drawLeaves();      // 繪製飄落的葉子
  drawFlowers();     // 繪製地上的花朵
  drawSprites();     // 繪製角色動畫（滑鼠移到按鈕時）
  if (isInPortfolioMode) drawPortfolioLinks(); // 顯示作品集連結
}

// === 分割每張角色圖為多張動畫影格 ===
function setupSprites() {
  for (let i = 0; i < 10; i++) sprite1Frames.push(sprite1.get(i * 56, 0, 56, 54));
  for (let i = 0; i < 7; i++) sprite2Frames.push(sprite2.get(i * 44.285, 0, 44.285, 46));
  for (let i = 0; i < 12; i++) sprite3Frames.push(sprite3.get(i * 64.583, 0, 64.583, 45));
  for (let i = 0; i < 8; i++) sprite4Frames.push(sprite4.get(i * 47.375, 0, 47.375, 34));
}

// === 根據滑鼠移動動畫角色 ===
function drawSprites() {
  const posX = mouseX + 10, posY = mouseY + 10;
  if (isHovering[0]) {
    if (millis() - sprite1Timer > 200) {
      sprite1Index = (sprite1Index + 1) % sprite1Frames.length;
      sprite1Timer = millis();
    }
    image(sprite1Frames[sprite1Index], posX, posY);
  }
  if (isHovering[1]) {
    if (millis() - sprite2Timer > 200) {
      sprite2Index = (sprite2Index + 1) % sprite2Frames.length;
      sprite2Timer = millis();
    }
    image(sprite2Frames[sprite2Index], posX, posY);
  }
  if (isHovering[2]) {
    if (millis() - sprite3Timer > 200) {
      sprite3Index = (sprite3Index + 1) % sprite3Frames.length;
      sprite3Timer = millis();
    }
    image(sprite3Frames[sprite3Index], posX, posY);
  }
  if (isHovering[3]) {
    if (millis() - sprite4Timer > 200) {
      sprite4Index = (sprite4Index + 1) % sprite4Frames.length;
      sprite4Timer = millis();
    }
    image(sprite4Frames[sprite4Index], posX, posY);
  }
}

// === 初始化竹子的位置與高度 ===
function setupBamboo() {
  for (let i = 0; i < width; i += 80) {
    bambooStalks.push({
      x: i + random(-10, 10),
      height: random(100, height),
      hover: false
    });
  }
}

// === 繪製竹子並加上 hover 效果與音效 ===
function drawBamboo() {
  for (let b of bambooStalks) {
    const isMouseOver = mouseX >= b.x && mouseX <= b.x + 15 && mouseY >= height - b.height && mouseY <= height;
    if (isMouseOver && !b.hover) {
      b.hover = true;
      if (!bambooSound.isPlaying()) bambooSound.play();
    } else if (!isMouseOver && b.hover) {
      b.hover = false;
    }

    if (b.hover) {
      stroke('#f2e8cf'); // 畫出外框高亮
      strokeWeight(3);
    } else {
      noStroke();
    }

    fill('#6a994e'); // 主體顏色
    rect(b.x, height - b.height, 15, b.height, 5); // 主體

    stroke('#386641'); // 畫竹節
    for (let y = height - b.height + 20; y < height; y += 25) {
      line(b.x, y, b.x + 15, y);
    }
  }
}

// === 初始化落葉資料 ===
function setupLeaves() {
  for (let i = 0; i < 50; i++) {
    leaves.push({
      x: random(width),
      y: random(-500, 0),
      speed: random(0.5, 1.5),
      size: random(10, 20),
      angle: random(TWO_PI)
    });
  }
}

// === 繪製飄落的葉子 ===
function drawLeaves() {
  fill('#a7c957');
  noStroke();
  for (let leaf of leaves) {
    push();
    translate(leaf.x, leaf.y);
    rotate(leaf.angle);
    ellipse(0, 0, leaf.size, leaf.size / 3);
    pop();

    leaf.y += leaf.speed;
    leaf.angle += 0.01;
    if (leaf.y > height) {
      leaf.y = random(-200, 0);
      leaf.x = random(width);
    }
  }
}

// === 初始化地上花朵 ===
function setupFlowers() {
  for (let i = 0; i < 30; i++) {
    flowers.push({
      x: random(width),
      y: random(height - 100, height - 20),
      r: random(4, 8),
      c: color(random(200, 255), random(100, 200), random(100, 200), 180)
    });
  }
}

// === 繪製花朵 ===
function drawFlowers() {
  for (let f of flowers) {
    fill(f.c);
    noStroke();
    ellipse(f.x, f.y, f.r * 2);
  }
}

// === 建立頁面上的四個按鈕 ===
function setupButtons() {
  const labels = ['自我介紹', '作品集', '測驗題', '教學影片'];
  const links = [
    'https://www.et.tku.edu.tw/',
    '',
    'https://wither0858.github.io/20250310/',
    'https://cfchen58.synology.me/程式設計2024/B2/week8/20250407_112555.mp4'
  ];

  for (let i = 0; i < labels.length; i++) {
    let btn = createButton(labels[i]);
    btn.position(130 + i * 130, 40);
    btn.size(110, 45);
    btn.style('font-size', '18px');
    btn.style('border-radius', '20px');
    btn.style('background-color', '#386641');
    btn.style('color', 'white');
    btn.style('font-family', 'Comic Sans MS');
    btn.style('border', 'none');
    btn.style('box-shadow', '0 4px 10px rgba(0,0,0,0.2)');
    btn.mouseOver(() => isHovering[i] = true);
    btn.mouseOut(() => isHovering[i] = false);
    btn.mousePressed(() => {
      if (iframe) {
        iframe.remove();
        iframe = null;
      }
      if (i === 1) {
        setPortfolioMode(true); // 開啟作品集模式
      } else {
        setPortfolioMode(false);
        createIframe(links[i]); // 顯示影片或網站
      }
    });
    buttons.push(btn);
  }
}

// === 控制作品集模式（顯示連結或關閉） ===
function setPortfolioMode(isEnabled) {
  isInPortfolioMode = isEnabled;
  if (iframe) {
    iframe.remove();
    iframe = null;
  }
  if (!isEnabled && window.portfolioAnchors) {
    for (let a of window.portfolioAnchors) a.remove();
    window.portfolioAnchors = null;
  }
}

// === 畫出 HackMD 作品連結按鈕 ===
function drawPortfolioLinks() {
  fill(isNight ? '#ffeb3b' : '#386641');
  textSize(24);
  textAlign(LEFT);
  text('作品集連結:', 50, 150);

  const portfolioLinks = [
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/ryDDxMgqke',
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/By7t04Gsye',
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/rk4QTmsi1l',
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/HyHJTp431e',
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/B1WafQC2ke',
    'https://hackmd.io/@yljBsqXlRrKGO44yTylRTg/BkX9dVbAyl'
  ];

  if (!window.portfolioAnchors) {
    window.portfolioAnchors = [];
    for (let i = 0; i < portfolioLinks.length; i++) {
      let a = createA(portfolioLinks[i], `作品 ${i + 1}`, '_blank');
      a.position(50, 180 + i * 40);
      a.style('font-size', '18px');
      a.style('color', isNight ? '#ffeb3b' : '#386641');
      a.style('text-decoration', 'none');
      a.style('font-family', 'Comic Sans MS');
      a.mouseOver(() => a.style('text-decoration', 'underline'));
      a.mouseOut(() => a.style('text-decoration', 'none'));
      window.portfolioAnchors.push(a);
    }
  } else {
    for (let i = 0; i < window.portfolioAnchors.length; i++) {
      window.portfolioAnchors[i].style('color', isNight ? '#ffeb3b' : '#386641');
    }
  }
}

// === 建立影片 iframe 元素 ===
function createIframe(url) {
  if (iframe) iframe.remove();
  iframe = createElement('iframe');
  iframe.attribute('src', url);
  iframe.size(800, 450);
  iframe.position((windowWidth - 800) / 2, (windowHeight - 450) / 2);
  iframe.style('border', '3px solid #6a994e');
  iframe.style('border-radius', '12px');
  iframe.style('box-shadow', '0 4px 20px rgba(0,0,0,0.2)');
}

// === 初始化雲朵 ===
function setupClouds() {
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(width),
      y: random(height / 2),
      w: random(200, 400),
      h: random(100, 200)
    });
  }
}

// === 繪製天空背景與雲朵、太陽或月亮 ===
function drawAtmosphere() {
  let gradient = drawingContext.createLinearGradient(0, 0, 0, height);
  if (isNight) {
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
  } else {
    gradient.addColorStop(0, '#d8f3dc');
    gradient.addColorStop(1, '#a7c957');
  }
  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);

  // 太陽或月亮
  if (isNight) {
    noStroke();
    for (let r = 200; r > 50; r -= 10) {
      fill(255, 255, 200, map(r, 200, 50, 10, 80));
      ellipse(width - 150, 150, r, r);
    }
    fill(255, 255, 230);
    ellipse(width - 150, 150, 80, 80);
  } else {
    fill(255, 255, 255, 20);
    ellipse(width / 2, height / 2, 600, 600);
  }

  // 雲朵
  fill(255, 255, 255, isNight ? 10 : 15);
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.w, cloud.h);
  }
}

// === 畫面大小改變時自動重新調整 ===
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (iframe) iframe.position((windowWidth - 800) / 2, (windowHeight - 450) / 2);
}

// === 按下 N 鍵切換白天／夜晚模式 ===
function keyPressed() {
  if (key === 'n' || key === 'N') {
    isNight = !isNight;
  }
}

// === 滑鼠點擊竹子時播放音效 ===
function mousePressed() {
  for (let b of bambooStalks) {
    if (
      mouseX >= b.x &&
      mouseX <= b.x + 15 &&
      mouseY >= height - b.height &&
      mouseY <= height
    ) {
      if (!bambooSound.isPlaying()) bambooSound.play();
      break;
    }
  }
}
