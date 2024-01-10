import { loadBoardList } from './board.js';
import { value } from './value.js';

value.socket = io();


value.socket.on('connect', async (socket) => {
  console.log('Connected');
});

value.socket.on('disconnect', function () {
  console.log('Disconnected');
});

value.socket.on('roomMessage', function (message) {
  console.log('roomMessage', message);
  showNotificationModal(message)
  
});

export function socketLogin(user) {
  value.socket.emit('login', user.id.toString(), response =>
    console.log('login:', response),
  );
}

export function socketLogout() {
  
}

export function initailizeNotification() {
  createNotificationModal();
  hideNotificationModal();
}



function createNotificationModal() {
  // 모달 컨테이너 생성
  const notiContainer = document.createElement("div");
  notiContainer.id = "noti-container";
  notiContainer.classList.add("modal-box");
  document.getElementById("modal-container").appendChild(notiContainer);

  // 닫기 버튼 생성
  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.textContent = "×";
  closeButton.onclick = hideNotificationModal; // closeModal 함수를 클릭 이벤트에 연결
  notiContainer.appendChild(closeButton);

  // 모달 헤더 생성
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("column-header");
  modalHeader.textContent = "NOTIFICATION";
  notiContainer.appendChild(modalHeader);
  
  const group = document.createElement("div");
  group.classList.add("group");
  notiContainer.appendChild(group);

  const label = document.createElement("label");
  label.textContent = "알림";
  group.appendChild(label);

  const input = document.createElement("div");
  input.classList.add("input");
  // input.innerText = boxText;
  input.id = "noti-text";
  group.appendChild(input);
}

function hideNotificationModal(  ) {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("noti-container").style.display = "none";
}

function showNotificationModal(message) {
  document.getElementById("modal-container").style.display = "flex";
  document.getElementById("noti-container").style.display = "block";
  
  const text = document.getElementById("noti-text");
  text.innerText = message;

  loadBoardList();
}