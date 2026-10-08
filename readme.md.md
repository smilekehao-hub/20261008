---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿＿＿＿＿＿＿＿　　姓名：＿＿＿＿＿＿＿＿

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習1截圖](請貼上截圖)
![image](https://hackmd.io/_uploads/SkU2EhVszl.png)
![image](https://hackmd.io/_uploads/B1E0V2EoGg.png)
![動畫](https://hackmd.io/_uploads/HJZgdnNszg.gif)

### 第一次問 AI

```tex!
使用p5.js撰寫一個選擇題測驗系統，我已經產生一個p5.js的專案，請把程式碼寫道sketch.js檔案內，每條指令都需要加上中文註解。測驗系統題目設定為五題，題目內容為程式設計p5.js簡易指令測驗，系統採用全螢幕，背景畫布顏色為f4f1de，使用者答錯時，系統會在正確答案選項上，加上04a777背景顏色，該選項上下移動，並冒出彩帶，答錯的選項採用f94144背景顏色，該選項左右晃動，並產生裂紋。選擇題選項共有四個，當五題結束後，需要顯示答對題數，每次顯示一個題目，需要有下一題的按鈕。
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
//// 定義題庫資料（包含 5 題 p5.js 基礎指令測驗）
let questions = [
  {
    question: "1. 在 p5.js 中，哪一個函式主要用於設定初始環境（如畫布大小）且只執行一次？",
    options: ["draw()", "setup()", "createCanvas()", "preload()"],
    answer: 1 // 正確答案索引 (0-based)：setup()
  },
  {
    question: "2. 哪一個指令可以用來繪製一個圓形？",
    options: ["rect()", "line()", "circle()", "triangle()"],
    answer: 2 // 正確答案索引：circle()
  },
  {
    question: "3. 若要改變填滿形狀的顏色，應該使用哪一個指令？",
    options: ["background()", "stroke()", "fill()", "color()"],
    answer: 2 // 正確答案索引：fill()
  },
  {
    question: "4. p5.js 中，預設重複執行繪圖邏輯的函式是哪一個？",
    options: ["draw()", "setup()", "loop()", "start()"],
    answer: 0 // 正確答案索引：draw()
  },
  {
    question: "5. 若要建立一個全螢幕大小的畫布，應該如何填寫 createCanvas 的參數？",
    options: ["createCanvas(800, 600)", "createCanvas(windowWidth, windowHeight)", "createCanvas(100%, 100%)", "createCanvas(MAX, MAX)"],
    answer: 1 // 正確答案索引：createCanvas(windowWidth, windowHeight)
  }
];

// 當前題目索引
let currentQuestionIndex = 0;
// 使用者答對的總題數
let score = 0;
// 紀錄使用者是否已針對當前題目做出選擇
let selectedOption = -1; 
// 紀錄當前題目是否答對 (true / false)
let isCorrect = false;

// 粒子的陣列（用於答對時的彩帶效果）
let confetti = [];
// 動畫計時器/計數器
let animTimer = 0;

function setup() {
  // 建立與瀏覽器視窗同寬同高（全螢幕）的畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字對齊方式為垂直與水平置中
  textAlign(CENTER, CENTER);
}

function draw() {
  // 設定背景顏色為 #f4f1de
  background("#f4f1de");

  // 判斷是否還有題目未完成
  if (currentQuestionIndex < questions.length) {
    // 繪製測驗介面
    drawQuiz();
  } else {
    // 繪製最終結算畫面
    drawResult();
  }
}

// 繪製主要測驗邏輯畫面
function drawQuiz() {
  let q = questions[currentQuestionIndex];

  // --- 繪製題目文字 ---
  fill(50); // 設定字體顏色為深灰
  noStroke(); // 不顯示文字邊框
  textSize(24); // 設定題目文字大小
  text(q.question, width / 2, height * 0.2); // 在畫布上方呈現題目

  // --- 繪製四個選項 ---
  let optionWidth = min(width * 0.8, 500); // 動態計算選項按鈕寬度
  let optionHeight = 50; // 設定選項按鈕高度
  let startY = height * 0.35; // 設定第一個選項的 Y 座標起點
  let spacing = 65; // 設定選項間距

  for (let i = 0; i < 4; i++) {
    let x = width / 2;
    let y = startY + i * spacing;

    // 預設選項樣式
    let bgColor = color(255); // 預設背景為白色
    let offsetX = 0; // X 軸偏移量（震動）
    let offsetY = 0; // Y 軸偏移量（跳動）
    let drawCrack = false; // 是否繪製裂紋

    // 如果使用者已經選擇了答案，處理視覺特效
    if (selectedOption !== -1) {
      if (i === q.answer) {
        // 【正確答案選項】設定為顏色 #04a777
        bgColor = color("#04a777");
        
        // 若答錯時，正確答案會上下移動（跳動特效）
        if (!isCorrect) {
          offsetY = sin(animTimer * 0.2) * 10;
        }
      } else if (i === selectedOption && !isCorrect) {
        // 【答錯的選項】設定為顏色 #f94144
        bgColor = color("#f94144");
        // 左右晃動特效
        offsetX = sin(animTimer * 0.5) * 8;
        // 標記需要繪製裂紋
        drawCrack = true;
      }
    }

    // 繪製選項卡片外框與背景
    push();
    translate(x + offsetX, y + offsetY); // 套用特效偏移量
    fill(bgColor);
    
    // 如果是正確答案或錯誤答案，文字變白色；否則為深色邊框
    if (selectedOption !== -1 && (i === q.answer || (i === selectedOption && !isCorrect))) {
      stroke(255);
      fill(bgColor);
    } else {
      stroke(200);
    }
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, optionWidth, optionHeight, 10); // 繪製圓角矩形

    // 如果答錯，在該選項上繪製裂紋
    if (drawCrack) {
      drawCrackEffect(optionWidth, optionHeight);
    }

    // 繪製選項文字
    noStroke();
    if (selectedOption !== -1 && (i === q.answer || (i === selectedOption && !isCorrect))) {
      fill(255); // 特效狀態下的文字為白色
    } else {
      fill(50); // 平常為深灰色
    }
    textSize(18);
    text(q.options[i], 0, 0);
    pop();
  }

  // --- 繪製彩帶效果（使用者答錯時，正確答案冒出彩帶；或答對時） ---
  if (selectedOption !== -1) {
    updateAndDrawConfetti();
    animTimer++; // 增加動畫計時器
  }

  // --- 繪製「下一題」按鈕（做出選擇後才顯示） ---
  if (selectedOption !== -1) {
    let btnX = width / 2;
    let btnY = startY + 4 * spacing + 20;
    
    push();
    fill("#3d405b"); // 按鈕顏色
    rectMode(CENTER);
    rect(btnX, btnY, 150, 45, 8); // 按鈕外形
    
    fill(255); // 按鈕文字顏色
    textSize(18);
    text(currentQuestionIndex === questions.length - 1 ? "查看結果" : "下一題", btnX, btnY);
    pop();
  }
}

// 繪製選項上的裂紋效果
function drawCrackEffect(w, h) {
  stroke(255, 200); // 裂紋顏色為半透明白色
  strokeWeight(2);
  // 繪製幾條不規則折線模擬裂紋
  line(-w / 4, -h / 4, -w / 8, 0);
  line(-w / 8, 0, -w / 3, h / 4);
  line(-w / 8, 0, 0, -h / 6);
  line(w / 5, -h / 3, w / 8, h / 8);
  line(w / 8, h / 8, w / 3, h / 3);
}

// 生成彩帶粒子（從正確選項位置冒出）
function createConfetti() {
  confetti = []; // 清空舊粒子
  let q = questions[currentQuestionIndex];
  let startY = height * 0.35 + q.answer * 65; // 正確答案選項的 Y 座標

  // 產生 50 個彩色粒子
  for (let i = 0; i < 50; i++) {
    confetti.push({
      x: width / 2 + random(-150, 150),
      y: startY,
      vx: random(-3, 3), // X 軸擴散速度
      vy: random(-6, -2), // Y 軸向上噴發速度
      size: random(6, 12),
      color: color(random(255), random(255), random(255)), // 隨機顏色
      gravity: 0.15 // 重力加速度
    });
  }
}

// 更新並繪製彩帶粒子
function updateAndDrawConfetti() {
  for (let p of confetti) {
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size); // 繪製彩帶粒子
    
    // 更新位置
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity; // 套用重力讓彩帶往下飄落
  }
}

// 繪製最終結算畫面
function drawResult() {
  fill(50);
  textSize(32);
  text("測驗結束！", width / 2, height * 0.3);
  
  textSize(24);
  text(`你的總得分為：${score} / ${questions.length} 題`, width / 2, height * 0.45);

  // 重新開始測驗按鈕
  let btnX = width / 2;
  let btnY = height * 0.6;
  push();
  fill("#e07a5f");
  rectMode(CENTER);
  rect(btnX, btnY, 160, 50, 8);
  fill(255);
  textSize(20);
  text("重新測驗", btnX, btnY);
  pop();
}

// 處理滑鼠點擊事件
function mousePressed() {
  // 如果還在測驗階段
  if (currentQuestionIndex < questions.length) {
    let optionWidth = min(width * 0.8, 500);
    let optionHeight = 50;
    let startY = height * 0.35;
    let spacing = 65;

    // 尚未選擇答案時，檢測是否點擊了某個選項
    if (selectedOption === -1) {
      for (let i = 0; i < 4; i++) {
        let x = width / 2;
        let y = startY + i * spacing;

        // 判斷滑鼠是否點擊在該選項矩形內
        if (
          mouseX > x - optionWidth / 2 &&
          mouseX < x + optionWidth / 2 &&
          mouseY > y - optionHeight / 2 &&
          mouseY < y + optionHeight / 2
        ) {
          selectedOption = i; // 紀錄選擇的選項
          isCorrect = (i === questions[currentQuestionIndex].answer); // 判斷是否正確
          
          if (isCorrect) {
            score++; // 答對則加分
          }
          
          // 無論答對或答錯（包含在正確答案上冒出彩帶），觸發彩帶動畫
          createConfetti();
          animTimer = 0; // 重置計數器
          break;
        }
      }
    } else {
      // 已經選擇答案後，檢測是否點擊了「下一題」按鈕
      let btnX = width / 2;
      let btnY = startY + 4 * spacing + 20;
      if (
        mouseX > btnX - 75 &&
        mouseX < btnX + 75 &&
        mouseY > btnY - 22.5 &&
        mouseY < btnY + 22.5
      ) {
        currentQuestionIndex++; // 進入下一題
        selectedOption = -1; // 重置選擇狀態
        confetti = []; // 清空彩帶
      }
    }
  } else {
    // 結算畫面點擊「重新測驗」按鈕
    let btnX = width / 2;
    let btnY = height * 0.6;
    if (
      mouseX > btnX - 80 &&
      mouseX < btnX + 80 &&
      mouseY > btnY - 25 &&
      mouseY < btnY + 25
    ) {
      currentQuestionIndex = 0; // 題目歸零
      score = 0; // 分數歸零
      selectedOption = -1; // 重置狀態
      confetti = [];
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小保持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習2截圖](請貼上截圖)
![image](https://hackmd.io/_uploads/HyiRs3Eszg.png)

### 第一次問 AI

```tex!
請你把網頁設定為響應式網頁，讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
```

### 第二次問 AI

```tex!
題目也要做換行，讓字體不會被擋到
```
### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
////// 定義題庫資料（5 題 p5.js 基礎指令測驗）
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
```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖



![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
