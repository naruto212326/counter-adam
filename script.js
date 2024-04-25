//獲取業面元素
const counterFormArea = document.querySelector ('.form-area');
const counterForm = document.getElementById ('counter-form');
const counterEl = document.getElementById ('counter');

const counterTitleEl = document.getElementById ('counter-title');
const timeElements = document.querySelectorAll ('span');
const counterResetBtn = document.getElementById ('counter-reset');

const complete = document.getElementById ('complete');
const completeInfo = document.getElementById ('complete-info');
const completeBtn = document.getElementById ('complete-button');

const datePicker = document.getElementById ('counter-date');


//初始化變量
let countdownValue = Date; //倒數時值，莫認為當前時間
let countdownActive; //倒數時間狀態，莫認為未激活

//定義時間毫秒數
const second = 1000; //一秒的毫秒數
const minute = second * 60; 
const hour = minute * 60;
const day = hour * 24;


//初始化標題和日期
let title = '';
let date = '';

//獲取當前時間，讓時間選擇器有當前的時間
let today = new Date ().toISOString ().split ('T')[0];
console.log (today);
datePicker.setAttribute ('min', today);




//更新頁面上倒數顯示
function updateDom () {
  countdownActive = setInterval (() => {
    let now = new Date ().getTime (); //獲取當前時間
    let distance = countdownValue - now; //計算剩餘時間

    // 計算剩餘天時分秒
    const days = Math.floor (distance / day);
    const hours = Math.floor (distance % day / hour);
    const minutes = Math.floor (distance % hour / minute);
    const seconds = Math.floor (distance % minute / second);

    //如果倒數結束，顯示完成，否則更新時間
    if (distance < 0) {
      counterEl.hidden = true;
      counterFormArea.hidden = true;
      complete.hidden = false;
      clearInterval (countdownActive);
      completeInfo.textContent = `${title} 在 ${date}結束`;
    } else {
      timeElements[0].textContent = days;
      timeElements[1].textContent = hours;
      timeElements[2].textContent = minutes;
      timeElements[3].textContent = seconds;
      counterTitleEl.textContent = title;
      counterFormArea.hidden = true;
      counterEl.hidden = false;
    }
  }, 1000); //每秒更新一次
};

//更新倒數標題和日期，並保存到本地存儲
function updateCountdown (e) {
  e.preventDefault ();
  title = e.srcElement[0].value;
  date = e.srcElement[1].value;
  //保存到本地
  const savedCountdown = {
    title: title,
    date: date,
  };

  localStorage.setItem ('countdown', JSON.stringify (savedCountdown));

  console.log (title, date);

  //如果日期空的，顯示警告提示
  if (date === '') {
    alert ('請填上時間');
  } else {
    countdownValue = new Date (date).getTime (); //設置倒數計時的值為指定日期的毫秒數
    console.log (countdownValue); //輸出倒數計時值到控制台
    updateDom (); //更新倒數顯示
  }
};

function reset () {
  let confirmReset = confirm("你確定要重置嗎"); //reset詢問
  //如果用戶確認執行reset
  if (confirmReset) {
  localStorage.removeItem ('countdown'); //移除本地
  counterEl.hidden = true; //隱藏計數器元素
  complete.hidden = true; //隱藏完成元素
  clearInterval (countdownActive); //清除倒數定時器
  title = ''; //重置標題
  date = ''; //重置時間
  counterFormArea.hidden = false;} //顯示設定區域
};

//恢復上次保存倒數計時狀態
function restoreCountdown () {
  if (localStorage.getItem ('countdown')) { 
    counterFormArea.hidden = true; //隱藏表單元素
    let countdownData = JSON.parse (localStorage.getItem ('countdown')); //解析本地存儲的計時器
    title = countdownData.title; //設置標題
    date = countdownData.date; //設置時間
    countdownValue = new Date (date).getTime (); //設置時間
    updateDom ();
  }
};

counterForm.addEventListener ('submit', updateCountdown);
counterResetBtn.addEventListener ('click', reset);
completeBtn.addEventListener ('click', reset);

//恢復上次保存的倒數計時狀態
restoreCountdown ();



