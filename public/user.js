export function initializeModals() {
  createLoginModal();
  hideLoginModal();

  createSignupModal();
  hideSignupModal();

  createProfileModal();
  hideProfileModal();
  
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

export async function showProfileModal() {
  document.getElementById("modal-container").style.display = "flex";
  document.getElementById("profile-container").style.display = "block";

  document.getElementById("profile-header").textContent = "PROFILE";

  document.getElementById("profile-edit").style.display = "none";

  const view = document.getElementById("profile-veiw");
  view.innerHTML = ``;
  view.style.display = 'block';

  // 회원 정보 조회 API
  const accessToken = await localStorage.getItem('access_token');
  await axios.get('/user/profile', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
    .then(response => {
      const user = response.data.user;
      const emailgroup = createVeiwGroup("이메일", user.email);
      view.appendChild(emailgroup);
      const nicknamegroup = createVeiwGroup("닉네임", user.name);
      view.appendChild(nicknamegroup);
      document.getElementById("profile-name").value = user.name; // 프로필 수정 부분에도 name 조회시켜놓기!!
    })
    .catch(error => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });

  const buttonbox = document.createElement("div");
  buttonbox.classList.add("button-box");
  view.appendChild(buttonbox);

  // 프로필 수정 버튼 
  const editBtn = document.createElement("button");
  editBtn.id = "editProfile-btn";
  editBtn.textContent = "수정하기";
  buttonbox.appendChild(editBtn);
  editBtn.addEventListener("click", () => {
    document.getElementById("profile-header").textContent = "EDIT PROFILE";

    document.getElementById("profile-edit").style.display = "block";
    document.getElementById("profile-veiw").style.display = "none";
  });

  // 회원 탈퇴 버튼
  const withdrawBtn = document.createElement("button");
  withdrawBtn.id = "withdraw-btn";
  withdrawBtn.textContent = "탈퇴하기";
  buttonbox.appendChild(withdrawBtn);

  withdrawBtn.addEventListener("click", () => {
    if (confirm("보드도 지워집니다 탈퇴하실?")) {
      // 사용자가 '확인'을 클릭한 경우
      // 회원 정보 삭제 API
      axios.delete(`/user`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
        .then(response => {
          console.log('response: ', response);
          alert("탈퇴가 완료되었습니다.");
          localStorage.removeItem('access_token');
          location.reload();
        })
        .catch(error => {
          console.log('error: ', error);
          alert(error.response.data.message);
        });
    }
  });
}

function hideProfileModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("profile-container").style.display = "none";
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

// 보여지는 라벨 그룹 생성
function createVeiwGroup(labelText, boxText) {
  const group = document.createElement("div");
  group.classList.add("group");

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("div");
  input.classList.add("input");
  input.innerText = boxText;

  group.appendChild(label);
  group.appendChild(input);

  return group;
}

function createLoginModal() {
  // 모달 컨테이너 생성
  const modalContainer = document.createElement("div");
  modalContainer.id = "login-container";
  modalContainer.classList.add("modal-box");
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

    // 로그인 API 
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
        alert(error.response.data.message);
      });
  });
}

function createSignupModal() {
  const signupContainer = document.createElement("div");
  signupContainer.id = "signup-container";
  signupContainer.classList.add("modal-box");

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

async function createProfileModal() {
  const profileContainer = document.createElement("div");
  profileContainer.id = "profile-container";
  profileContainer.classList.add("modal-box");
  document.getElementById("modal-container").appendChild(profileContainer);

  // close-btn 생성
  const closeBtn = document.createElement("span");
  closeBtn.id = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = hideProfileModal;
  profileContainer.appendChild(closeBtn);
  // column-header 생성
  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column-header");
  columnHeader.id = 'profile-header';
  columnHeader.textContent = "PROFILE";
  profileContainer.appendChild(columnHeader);

  // 프로필 보기 모드
  const viewProfile = document.createElement("div");
  viewProfile.id = 'profile-veiw';
  profileContainer.appendChild(viewProfile);

  // 프로필 수정 모드
  const editProfile = document.createElement("div");
  editProfile.id = 'profile-edit';
  profileContainer.appendChild(editProfile);

  // form 생성
  const form = document.createElement("div");
  form.classList.add("form");
  editProfile.appendChild(form);

  // 입력 폼 그룹 생성 및 추가 - 닉네임
  const nicknameGroup = createFormGroup("닉네임", "profile-name", "text", "");
  form.appendChild(nicknameGroup);

  // 회원 정보 수정 API
  const editBtn2 = document.createElement("button");
  editBtn2.textContent = "수정하기";
  form.appendChild(editBtn2);

  editBtn2.addEventListener("click", () => {
    const name = document.getElementById("profile-name").value;
    const accessToken = localStorage.getItem('access_token');

    // 보드 정보 수정 API
    axios.patch(`/user`,
      { name },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
      .then(response => {
        console.log('response: ', response);
        alert("수정이 완료되었습니다.");
      })
      .catch(error => {
        console.log('error: ', error);
        alert(error.response.data.message);
      });
  });
}

