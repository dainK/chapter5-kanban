export function initializeModals() {
  createLoginModal();
  createSignupModal();
  hideLoginModal();
  hideSignupModal();
}

// 로그인 모달 활성화
export function showLoginModal() {
  document.getElementById("modal-container").style.display = "flex";
  document.getElementById("login-container").style.display = "block";
}

// 로그인 모달 비활성화
function hideLoginModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("login-container").style.display = "none";
}

// 회원가입 모달 활성화
export function showSignupModal() {
  document.getElementById("modal-container").style.display = "flex";
  document.getElementById("signup-container").style.display = "block";
}

// 회원가입 모달 비활성화
function hideSignupModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("signup-container").style.display = "none";
}

// 입력 폼 그룹 생성
function createFormGroup(labelText, inputId, inputType, placeholder) {
  const group = document.createElement("div");
  group.classList.add("group");

  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;

  const input = document.createElement("input");
  input.classList.add("input");
  input.type = inputType;
  input.id = inputId;
  input.placeholder = placeholder;

  group.appendChild(label);
  group.appendChild(input);

  return group;
}

function createLoginModal() {
  // 모달 컨테이너 생성
  const modalContainer = document.createElement("div");
  modalContainer.id = "login-container";
  modalContainer.classList.add("modal-container");
  document.getElementById("modal-container").appendChild(modalContainer);

  // 닫기 버튼 생성
  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.textContent = "×";
  closeButton.onclick = hideLoginModal; // closeModal 함수를 클릭 이벤트에 연결
  modalContainer.appendChild(closeButton);

  // 모달 헤더 생성
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("column-header");
  modalHeader.textContent = "LOGIN";
  modalContainer.appendChild(modalHeader);

  // 로그인 폼 생성
  const loginForm = document.createElement("div");
  loginForm.classList.add("form");
  modalContainer.appendChild(loginForm);

  const idGroup = createFormGroup("이메일", "login-email", "text", "이메일");
  loginForm.appendChild(idGroup);
  const passwordGroup = createFormGroup(
    "비밀번호",
    "login-password",
    "password",
    "비밀번호"
  );
  loginForm.appendChild(passwordGroup);

  // 로그인 버튼 생성
  const loginButton = document.createElement("button");
  loginButton.id = "login-btn";
  loginButton.textContent = "로그인";
  loginForm.appendChild(loginButton);
  loginButton.addEventListener("click", () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    axios.post('/user/login', { email, password })
      .then(response => {
        console.log(response.data);

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        hideLoginModal();
        location.reload();
      })
      .catch(error => {
        console.error(error);
        // 에러 처리
      });
  });
}

function createSignupModal() {
  const signupContainer = document.createElement("div");
  signupContainer.id = "signup-container";

  // close-btn 생성
  const closeBtn = document.createElement("span");
  closeBtn.id = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = hideSignupModal; // closeModal 함수를 클릭 이벤트에 연결

  // column-header 생성
  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column-header");
  columnHeader.textContent = "SIGNUP";

  // form 생성
  const form = document.createElement("div");
  form.classList.add("form");

  // 입력 폼 그룹 생성 및 추가 - 아이디
  const idGroup = createFormGroup("아이디", "signup-id", "text", "아이디");
  // 입력 폼 그룹 생성 및 추가 - 비밀번호
  const passwordGroup = createFormGroup(
    "비밀번호",
    "signup-password",
    "password",
    "비밀번호"
  );
  // 입력 폼 그룹 생성 및 추가 - 비밀번호 확인
  const passwordConfirmGroup = createFormGroup(
    "비밀번호 확인",
    "signup-passwordconfirm",
    "password",
    "비밀번호 확인"
  );

  // 입력 폼 그룹 생성 및 추가 - 닉네임
  const nameGroup = createFormGroup(
    "닉네임",
    "signup-name",
    "test",
    "닉네임"
  );
  // 회원가입 버튼 생성
  const signupBtn = document.createElement("button");
  signupBtn.id = "signup-btn";
  signupBtn.textContent = "회원가입";

  // 회원가입 API
  signupBtn.addEventListener("click", () => {
    const email = document.getElementById('signup-id').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-passwordconfirm').value;
    const name = document.getElementById('signup-name').value;

    axios.post('/user/signup', { email, password, passwordConfirm, name })
      .then(response => {
        console.log(response.data);

        hideLoginModal();
        location.reload();
      })
      .catch(error => {
        console.error(error);
        alert(error.response.data.message);
        // 에러 처리
        // 비밀번호 오류 체크하기

      });
  });

  // 자식 요소들을 추가
  form.appendChild(idGroup);
  form.appendChild(passwordGroup);
  form.appendChild(passwordConfirmGroup);
  form.appendChild(nameGroup);
  form.appendChild(signupBtn);

  signupContainer.appendChild(closeBtn);
  signupContainer.appendChild(columnHeader);
  signupContainer.appendChild(form);

  document.getElementById("modal-container").appendChild(signupContainer);
}
