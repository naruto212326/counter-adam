// 获取页面上的各个元素
const counterFormArea = document.querySelector('.form-area');
const counterForm = document.getElementById('counter-form');
const counterEl = document.getElementById('counter');
const counterTitleEl = document.getElementById('counter-title');
const timeElements = document.querySelectorAll('span');
const counterResetBtn = document.getElementById('counter-reset');
const complete = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');
const datePicker = document.getElementById('counter-date');

// 初始化倒计时相关变量
let countdownValue; // 倒计时值
let countdownActive; // 倒计时活动状态
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
let title = '';
let date = '';

// 获取当前日期并设置日期选择器的最小值
const today = new Date().toISOString().split('T')[0];
datePicker.setAttribute('min', today);

// 更新页面上的倒计时显示
function updateDom() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    if (distance < 0) {
      counterEl.hidden = true;
      counterFormArea.hidden = true;
      complete.hidden = false;
      clearInterval(countdownActive);
      completeInfo.textContent = `${title} is finished on ${date}`;
    } else {
      timeElements[0].textContent = days;
      timeElements[1].textContent = hours;
      timeElements[2].textContent = minutes;
      timeElements[3].textContent = seconds;
      counterTitleEl.textContent = title;
      counterFormArea.hidden = true;
      counterEl.hidden = false;
    }
  }, 1000);
}

// 更新倒计时标题和日期，并保存到本地存储
function updateCountdown(e) {
  e.preventDefault();
  title = e.srcElement[0].value;
  date = e.srcElement[1].value;

  const savedCountdown = { title, date };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (!date) {
    alert('Please enter a date!');
  } else {
    countdownValue = new Date(date).getTime();
    updateDom();
  }
}

// 重置倒计时
function reset() {
  const confirmReset = confirm("Are you sure you want to reset?");
  if (confirmReset) {
    localStorage.removeItem('countdown');
    counterEl.hidden = true;
    complete.hidden = true;
    clearInterval(countdownActive);
    title = '';
    date = '';
    counterFormArea.hidden = false;
  }
}

// 恢复上次保存的倒计时状态
function restoreCountdown() {
  const savedCountdown = localStorage.getItem('countdown');
  if (savedCountdown) {
    const { title: savedTitle, date: savedDate } = JSON.parse(savedCountdown);
    title = savedTitle;
    date = savedDate;
    countdownValue = new Date(date).getTime();
    updateDom();
  }
}

// 添加事件监听器
counterForm.addEventListener('submit', updateCountdown);
counterResetBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// 恢复上次保存的倒计时状态
restoreCountdown();