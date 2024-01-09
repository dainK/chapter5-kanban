import { loadBoardList } from "./board.js";
import { showLoginModal, showSignupModal, showProfileModal } from "./user.js";

// Sidebar 생성
export function initailizeSideBar() {
  createSidebar();
  showSidebarState(false);
}

export function showSidebarState() {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken !== null) {
    showSideStatelogin();
    loadBoardList();
  } else {
    showSideStatelogout();
  }
}




function showSideStatelogin() {
  const text = document.getElementById("sidebar-text");
  text.innerText = `${"유저"}님 안녕하세요.`;
  document.getElementById("login-button").style.display = "none";
  document.getElementById("signup-button").style.display = "none";
  document.getElementById("logout-button").style.display = "block";
  document.getElementById("profile-button").style.display = "block";
}

function showSideStatelogout() {
  const text = document.getElementById("sidebar-text");
  text.innerText = `로그인이 필요합니다.`;
  document.getElementById("login-button").style.display = "block";
  document.getElementById("signup-button").style.display = "block";
  document.getElementById("logout-button").style.display = "none";
  document.getElementById("profile-button").style.display = "none";
}

function createSidebar() {
  const main = document.getElementById("main");
  const button = document.createElement("button");
  button.id = "menu-button";
  button.style.backgroundColor = "#a2cfff";
  button.style.border = "2px solid white";
  button.style.color = "#white";
  button.style.padding = "4px";
  button.innerHTML = `<span class="material-symbols-outlined">
  arrow_forward_ios
  </span>`;
  button.innerHTML = `☰`;
  button.onclick = openNav;
  main.appendChild(button);

  const sidebar = document.getElementById("sidebar");

  // Close 버튼 생성
  const closeBtn = document.createElement("div");
  closeBtn.href = "javascript:void(0)";
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";
  closeBtn.onclick = closeNav;
  sidebar.appendChild(closeBtn);

  const text = document.createElement("p");
  text.id = "sidebar-text";
  text.innerHTML = `<span class="material-symbols-outlined">
  account_circle
  </span>`;
  sidebar.appendChild(text);

  // 로그인 해야 할 때
  const notUserbox = document.createElement("div");
  notUserbox.id = "sidebar-not-user";
  notUserbox.classList.add("button-box");
  sidebar.appendChild(notUserbox);

  // 로그인 버튼 생성
  const loginButton = document.createElement("button");
  loginButton.id = "login-button";
  loginButton.textContent = "로그인";
  loginButton.addEventListener("click", showLoginModal);
  notUserbox.appendChild(loginButton);

  // 회원가입 버튼 생성
  const signupButton = document.createElement("button");
  signupButton.id = "signup-button";
  signupButton.textContent = "회원가입";
  signupButton.addEventListener("click", showSignupModal);
  notUserbox.appendChild(signupButton);

  // 로그인 하고 나서
  const userbox = document.createElement("div");
  userbox.id = "sidebar-not-user";
  userbox.classList.add("button-box");
  sidebar.appendChild(userbox);

  // 로그아웃 버튼 생성
  const logoutButton = document.createElement("button");
  logoutButton.id = "logout-button";
  logoutButton.textContent = "로그아웃";
  logoutButton.addEventListener("click", () => {
    const accessToken = localStorage.getItem('access_token');
    axios
      .post(
        '/user/logout',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      .then((response) => {
        localStorage.removeItem('access_token');
        location.reload();
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  });
  userbox.appendChild(logoutButton);

  // 프로필보기 버튼 생성
  const myButton = document.createElement("button");
  myButton.id = "profile-button";
  myButton.textContent = "프로필";
  myButton.addEventListener("click", showProfileModal);
  userbox.appendChild(myButton);

  const boardtext = document.createElement("p");
  boardtext.innerText = `내 보드 목록`;
  sidebar.appendChild(boardtext);

  const boardList = document.createElement("div");
  boardList.id = "board-list";
  boardList.classList.add("board-list");
  sidebar.appendChild(boardList);
}


function openNav() {
  document.getElementById("sidebar");
  const sidebar = document.getElementById("sidebar");
  sidebar.style.left = "0px";
  document.getElementById("main-container").style.marginLeft = "250px";
  document.getElementById("menu-button").style.display = "none";
}

function closeNav() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.left = "-250px"; // sidebar의 폭만큼 왼쪽으로 이동
  document.getElementById("main-container").style.marginLeft = "0px";
  document.getElementById("menu-button").style.display = "block";
}
