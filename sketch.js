// ====== 全域變數宣告區 ======
let bambooStalks = [], leaves = [], flowers = []; // 存放竹子、葉子、花的資料
let buttons = [], iframe; // 按鈕陣列，iframe 是嵌入的影片視窗
let sprite1, sprite2, sprite3, sprite4; // 四組動畫素材圖片
let sprite1Frames = [], sprite2Frames = [], sprite3Frames = [], sprite4Frames = []; // 分割後的動畫影格
let sprite1Index = 0, sprite2Index = 0, sprite3Index = 0, sprite4Index = 0; // 各角色目前動畫播放的影格索引
let sprite1Timer = 0, sprite2Timer = 0, sprite3Timer = 0, sprite4Timer = 0; // 各動畫的播放時間控制
let isHovering = [false, false, false, false]; // 記錄滑鼠是否在四個按鈕上
let isInPortfolioMode = false; // 是否開啟作品集模式
let clouds = []; // 存放雲朵資料
let bambooSound; // 竹子被觸碰時播放的音效
let isNight = false; // 是否為夜間模式（按下 N 切換）

// ====== 預先載入素材 ======
function preload() {
  sprite1 = loadImage('1_all.png');
  sprite2 = loadImage('2_all.png');
  sprite3 = loadImage('3_all.png');
  sprite4 = loadImage('4_all.png');
  soundFormats('wav');
  bambooSound = loadSound('130532__stomachache__d1.wav');
}

// ====== 初始化程式畫面內容 ======
function setup() {
  createCanvas(windowWidth, windowHeight);
  setupBamboo();   // 初始化竹子
  setupLeaves();   // 初始化葉子
  setupFlowers();  // 初始化花朵
  setupButtons();  // 建立按鈕
  setupSprites();  // 分割動畫圖片
  setupClouds();   // 建立雲朵
}

// ====== 畫面更新函式，每秒60次 ======
function draw() {
  drawAtmosphere();   // 畫背景和雲
  drawBamboo();       // 畫竹子
  drawLeaves();       // 畫掉落的葉子
  drawFlowers();      // 畫花朵
  drawSprites();      // 畫動畫角色
  if (isInPortfolioMode) drawPortfolioLinks(); // 如果是作品集模式，就顯示連結
}

// ====== 將精靈動畫圖分割成每一格影像 ======
function setupSprites() {
  for (let i = 0; i < 10; i++) sprite1Frames.push(sprite1.get(i * 56, 0, 56, 54));
  for (let i = 0; i < 7; i++) sprite2Frames.push(sprite2.get(i * 44.285, 0, 44.285, 46));
  for (let i = 0; i < 12; i++) sprite3Frames.push(sprite3.get(i * 64.583, 0, 64.583, 45));
  for (let i = 0; i < 8; i++) sprite4Frames.push(sprite4.get(i * 47.375, 0, 47.375, 34));
}

// ====== 畫出角色動畫 ======
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

// ====== 初始化竹子位置和屬性 ======
function setupBamboo() {
  for (let i = 0; i < width; i += 80) {
    bambooStalks.push({
      x: i + random(-10, 10),
      height: random(100, height),
      hover: false
    });
  }
}

// ====== 畫出竹子並檢查滑鼠是否在上面 ======
function drawBamboo() {
  for (let b of bambooStalks) {
    const isMouseOver = mouseX >= b.x && mouseX <= b.x + 15 && mouseY >= height - b.height && mouseY <= height;

    if (isMouseOver) {
      if (!b.hover) {
        b.hover = true;
        bambooSound.play(); // 播放竹子聲音（每次進入時觸發）
      }
    } else {
      b.hover = false;
    }

    if (b.hover) {
      stroke('#f2e8cf'); // 高亮邊框
      strokeWeight(3);
    } else {
      noStroke();
    }

    fill('#6a994e');
    rect(b.x, height - b.height, 15, b.height, 5);

    stroke('#386641');
    for (let y = height - b.height + 20; y < height; y += 25) {
      line(b.x, y, b.x + 15, y);
    }
  }
}

// ====== 建立漂浮落下的葉子 ======
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

// ====== 畫葉子並製造掉落飄動感 ======
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

// ====== 建立地上的花朵 ======
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

// ====== 畫地上的花 ======
function drawFlowers() {
  for (let f of flowers) {
    fill(f.c);
    noStroke();
    ellipse(f.x, f.y, f.r * 2);
  }
}

// ====== 建立選單按鈕及點擊事件 ======
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
      if (iframe) iframe.remove();
      if (i === 1) {
        setPortfolioMode(true);
      } else {
        setPortfolioMode(false);
        createIframe(links[i]);
      }
    });
    buttons.push(btn);
  }
}

// ====== 控制是否顯示作品集模式 ======
function setPortfolioMode(isEnabled) {
  isInPortfolioMode = isEnabled;
  if (iframe) iframe.remove();
  if (!isEnabled && window.portfolioAnchors) {
    for (let a of window.portfolioAnchors) a.remove();
    window.portfolioAnchors = null;
  }
}

// ====== 畫出作品集的超連結 ======
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

// ====== 建立嵌入式影片框架（iframe） ======
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

// ====== 建立雲朵初始位置與大小 ======
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

// ====== 畫出背景、天空、太陽／月亮、雲 ======
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

  fill(255, 255, 255, isNight ? 10 : 15);
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.w, cloud.h);
  }
}

// ====== 畫面尺寸改變時重新調整畫布大小 ======
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (iframe) iframe.position((windowWidth - 800) / 2, (windowHeight - 450) / 2);
}

// ====== 鍵盤按下 N 鍵時切換夜晚模式 ======
function keyPressed() {
  if (key === 'n' || key === 'N') {
    isNight = !isNight;
  }
}

// ====== 滑鼠點下竹子時再播一次聲音（補強 hover 觸發不到的情況） ======
function mousePressed() {
  for (let b of bambooStalks) {
    if (
      mouseX >= b.x &&
      mouseX <= b.x + 15 &&
      mouseY >= height - b.height &&
      mouseY <= height
    ) {
      bambooSound.play();
      break;
    }
  }
}
