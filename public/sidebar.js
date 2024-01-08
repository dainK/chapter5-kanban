import { showLoginModal, showSignupModal } from "./modal.js";


// Sidebar 생성
export function initailizeSideBar () {
  const sidebar = document.getElementById("sidebar");

  // Close 버튼 생성
  const closeBtn = document.createElement("a");
  closeBtn.href = "javascript:void(0)";
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";
  closeBtn.onclick = closeNav;
  
  // 로그인 버튼 생성
  const loginButton = document.createElement("a");
  loginButton.href = "#";
  loginButton.id = "login-button";
  loginButton.textContent = "로그인";
  loginButton.addEventListener("click", showLoginModal);
  
  // 회원가입 버튼 생성
  const signupButton = document.createElement("a");
  signupButton.href = "#";
  signupButton.id = "signup-button";
  signupButton.textContent = "회원가입";
  signupButton.addEventListener("click", showSignupModal);
  
  // Sidebar에 요소들 추가
  sidebar.appendChild(closeBtn);
  sidebar.appendChild(loginButton);
  sidebar.appendChild(signupButton);

  
  const main = document.getElementById("main");
  
  const button = document.createElement("span");
  button.id ='menu-button';
  button.innerText = '☰';
  button.onclick = openNav;
  main.appendChild(button);
  // document.body.appendChild(button);
}

function openNav() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("board").style.marginLeft = "250px";
  document.getElementById("menu-button").style.display = "none";
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("board").style.marginLeft = "0";
  document.getElementById("menu-button").style.display = "block";
}