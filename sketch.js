// 定義題庫資料（5 題 p5.js 基礎指令測驗）
let questions = [
  {
    question: "1. 在 p5.js 中，哪一個函式主要用於設定初始環境（如畫布大小）且只執行一次？",
    options: ["draw()", "setup()", "createCanvas()", "preload()"],
    answer: 1 // setup()
  },
  {
    question: "2. 哪一個指令可以用來繪製一個圓形？",
    options: ["rect()", "line()", "circle()", "triangle()"],
    answer: 2 // circle()
  },
  {
    question: "3. 若要改變填滿形狀的顏色，應該使用哪一個指令？",
    options: ["background()", "stroke()", "fill()", "color()"],
    answer: 2 // fill()
  },
  {
    question: "4. p5.js 中，預設重複執行繪圖邏輯的函式是哪一個？",
    options: ["draw()", "setup()", "loop()", "start()"],
    answer: 0 // draw()
  },
  {
    question: "5. 若要建立一個全螢幕大小的畫布，應該如何填寫 createCanvas 的參數？",
    options: ["createCanvas(800, 600)", "createCanvas(windowWidth, windowHeight)", "createCanvas(100%, 100%)", "createCanvas(MAX, MAX)"],
    answer: 1 // createCanvas(windowWidth, windowHeight)
  }
];

// 測驗狀態變數
let currentQuestionIndex = 0; // 當前題目
let score = 0; // 答對總數
let selectedOption = -1; // 當前選擇選項 (-1 表示未選)
let isCorrect = false; // 是否答對

// 特效變數
let confetti = []; // 彩帶粒子陣列
let animTimer = 0; // 動畫計時器

// 佈局與捲動變數
let layout = {};
let scrollY = 0; // 當前滾動位移
let maxScrollY = 0; // 最大可滾動距離

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textWrap(WORD); // 啟用單字換行
  calculateLayout();
}

// 根據視窗尺寸動態計算尺寸與佈局（防止切題與重疊）
function calculateLayout() {
  let minDim = min(width, height);
  let isShortScreen = height < 600; // 是否為較矮螢幕（如手機橫向）

  // 動態調整字體與選項大小，避免過大
  layout = {
    titleSize: constrain(minDim * 0.038, 14, 22),
    titleWidth: constrain(width * 0.88, 240, 520),
    titleY: isShortScreen ? 20 : height * 0.05,
    
    optionWidth: constrain(width * 0.88, 240, 520),
    optionHeight: constrain(height * 0.07, 36, 50),
    optionSpacing: constrain(height * 0.08, 44, 60),
    optionTextSize: constrain(minDim * 0.026, 12, 16),
    
    btnWidth: constrain(width * 0.35, 120, 180),
    btnHeight: constrain(height * 0.06, 34, 45),
    btnTextSize: constrain(minDim * 0.026, 13, 16)
  };

  // 重置滾動值
  scrollY = 0;
}

function draw() {
  background("#f4f1de"); // 設定背景顏色

  push();
  // 套用畫面上下滾動位移
  translate(0, -scrollY);

  if (currentQuestionIndex < questions.length) {
    drawQuiz();
  } else {
    drawResult();
  }
  pop();
}

// 繪製測驗畫面
function drawQuiz() {
  let q = questions[currentQuestionIndex];

  // --- 1. 計算題目文字高度 ---
  textSize(layout.titleSize);
  let titleLeading = layout.titleSize * 1.35;
  textLeading(titleLeading);
  
  // 計算題目換行後的真實高低
  let approxLines = ceil(textWidth(q.question) / layout.titleWidth);
  let titleHeight = approxLines * titleLeading;

  // 動態計算第一個選項的起點
  let dynamicStartY = layout.titleY + titleHeight + 25;

  // --- 2. 繪製題目文字 ---
  fill(50);
  noStroke();
  textAlign(CENTER, TOP);
  text(q.question, width / 2 - layout.titleWidth / 2, layout.titleY, layout.titleWidth);

  // --- 3. 繪製選項 ---
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 4; i++) {
    let x = width / 2;
    let y = dynamicStartY + i * layout.optionSpacing;

    let bgColor = color(255);
    let offsetX = 0;
    let offsetY = 0;
    let drawCrack = false;

    if (selectedOption !== -1) {
      if (i === q.answer) {
        bgColor = color("#04a777"); // 正確答案背景
        if (!isCorrect) {
          offsetY = sin(animTimer * 0.2) * (layout.optionHeight * 0.15);
        }
      } else if (i === selectedOption && !isCorrect) {
        bgColor = color("#f94144"); // 錯誤選擇背景
        offsetX = sin(animTimer * 0.5) * 8;
        drawCrack = true;
      }
    }

    push();
    translate(x + offsetX, y + offsetY);
    rectMode(CENTER);
    fill(bgColor);

    if (selectedOption !== -1 && (i === q.answer || (i === selectedOption && !isCorrect))) {
      stroke(255);
    } else {
      stroke(200);
    }
    strokeWeight(2);
    rect(0, 0, layout.optionWidth, layout.optionHeight, 10);

    if (drawCrack) {
      drawCrackEffect(layout.optionWidth, layout.optionHeight);
    }

    noStroke();
    if (selectedOption !== -1 && (i === q.answer || (i === selectedOption && !isCorrect))) {
      fill(255);
    } else {
      fill(50);
    }
    textSize(layout.optionTextSize);
    text(q.options[i], 0, 0);
    pop();
  }

  // --- 4. 彩帶效果更新 ---
  if (selectedOption !== -1) {
    updateAndDrawConfetti(dynamicStartY);
    animTimer++;
  }

  // --- 5. 繪製下一題按鈕 ---
  let totalContentHeight = dynamicStartY + 4 * layout.optionSpacing + 30;

  if (selectedOption !== -1) {
    let btnX = width / 2;
    let btnY = dynamicStartY + 4 * layout.optionSpacing + 20;

    push();
    fill("#3d405b");
    rectMode(CENTER);
    rect(btnX, btnY, layout.btnWidth, layout.btnHeight, 8);

    fill(255);
    textSize(layout.btnTextSize);
    text(currentQuestionIndex === questions.length - 1 ? "查看結果" : "下一題", btnX, btnY);
    pop();

    totalContentHeight = btnY + layout.btnHeight + 40;
  }

  // 計算內容總高度與最大可滾動範圍，防止底部被遮擋
  maxScrollY = max(0, totalContentHeight - height);
}

// 繪製裂紋
function drawCrackEffect(w, h) {
  stroke(255, 200);
  strokeWeight(2);
  line(-w / 4, -h / 4, -w / 8, 0);
  line(-w / 8, 0, -w / 3, h / 4);
  line(-w / 8, 0, 0, -h / 6);
  line(w / 5, -h / 3, w / 8, h / 8);
  line(w / 8, h / 8, w / 3, h / 3);
}

// 產生彩帶粒子
function createConfetti(dynamicStartY) {
  confetti = [];
  let q = questions[currentQuestionIndex];
  let startY = dynamicStartY + q.answer * layout.optionSpacing;

  for (let i = 0; i < 40; i++) {
    confetti.push({
      x: width / 2 + random(-layout.optionWidth / 2, layout.optionWidth / 2),
      y: startY,
      vx: random(-3, 3),
      vy: random(-5, -2),
      size: random(5, 10),
      color: color(random(255), random(255), random(255)),
      gravity: 0.15
    });
  }
}

// 更新彩帶
function updateAndDrawConfetti(dynamicStartY) {
  for (let p of confetti) {
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
  }
}

// 繪製結果畫面
function drawResult() {
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(layout.titleSize * 1.3);
  text("測驗結束！", width / 2, height * 0.3);

  textSize(layout.titleSize);
  text(`你的總得分為：${score} / ${questions.length} 題`, width / 2, height * 0.45);

  let btnX = width / 2;
  let btnY = height * 0.6;
  push();
  fill("#e07a5f");
  rectMode(CENTER);
  rect(btnX, btnY, layout.btnWidth * 1.2, layout.btnHeight, 8);
  fill(255);
  textSize(layout.btnTextSize);
  text("重新測驗", btnX, btnY);
  pop();

  maxScrollY = 0; // 結果頁不需滾動
}

// 支援滑鼠滾輪滾動畫面
function mouseWheel(event) {
  if (maxScrollY > 0) {
    scrollY += event.delta;
    scrollY = constrain(scrollY, 0, maxScrollY);
  }
}

// 點擊事件處理（考量 scrollY 偏移）
function mousePressed() {
  // 將滑鼠的真實 Y 軸座標加上滾動偏移量
  let adjustedMouseY = mouseY + scrollY;

  if (currentQuestionIndex < questions.length) {
    let q = questions[currentQuestionIndex];
    textSize(layout.titleSize);
    let titleLeading = layout.titleSize * 1.35;
    let approxLines = ceil(textWidth(q.question) / layout.titleWidth);
    let titleHeight = approxLines * titleLeading;
    let dynamicStartY = layout.titleY + titleHeight + 25;

    if (selectedOption === -1) {
      for (let i = 0; i < 4; i++) {
        let x = width / 2;
        let y = dynamicStartY + i * layout.optionSpacing;

        if (
          mouseX > x - layout.optionWidth / 2 &&
          mouseX < x + layout.optionWidth / 2 &&
          adjustedMouseY > y - layout.optionHeight / 2 &&
          adjustedMouseY < y + layout.optionHeight / 2
        ) {
          selectedOption = i;
          isCorrect = (i === questions[currentQuestionIndex].answer);
          if (isCorrect) score++;
          
          createConfetti(dynamicStartY);
          animTimer = 0;
          break;
        }
      }
    } else {
      let btnX = width / 2;
      let btnY = dynamicStartY + 4 * layout.optionSpacing + 20;
      if (
        mouseX > btnX - layout.btnWidth / 2 &&
        mouseX < btnX + layout.btnWidth / 2 &&
        adjustedMouseY > btnY - layout.btnHeight / 2 &&
        adjustedMouseY < btnY + layout.btnHeight / 2
      ) {
        currentQuestionIndex++;
        selectedOption = -1;
        confetti = [];
        scrollY = 0; // 切換下一題時重置滾動位置
      }
    }
  } else {
    let btnX = width / 2;
    let btnY = height * 0.6;
    if (
      mouseX > btnX - (layout.btnWidth * 1.2) / 2 &&
      mouseX < btnX + (layout.btnWidth * 1.2) / 2 &&
      adjustedMouseY > btnY - layout.btnHeight / 2 &&
      adjustedMouseY < btnY + layout.btnHeight / 2
    ) {
      currentQuestionIndex = 0;
      score = 0;
      selectedOption = -1;
      confetti = [];
      scrollY = 0;
    }
  }
}

// 視窗改變大小時更新計算
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateLayout();
}