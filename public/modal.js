
import { createTaskCard } from "./card.js";
import { moveAddCardButton } from "./column.js";
import { value } from "./value.js";

export function initializeModals() {
  createLoginModal();
  createSignupModal();
  createAddTaskModal();
  createTaskModal();
  
  closeModal();
}

export function openModal() {
  document.getElementById("modal-container").style.display = "flex";
}

export function closeModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("submit-container").style.display = "none";
  document.getElementById("task-container").style.display = "none";
}

export function showLoginModal() {
  openModal();
  document.getElementById("login-container").style.display = "block";
}

export function showSignupModal() {
  openModal();
  document.getElementById("signup-container").style.display = "block";
}

export function showAddTaskModal(columnId) {
  value.cardColumnId = columnId;
  openModal();
  
  //reset
  document.getElementById("task-title").value = "";
  document.getElementById("task-assignee").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-priority").value = "MEDIUM";
  document.getElementById("task-content").value = "";

  document.getElementById("submit-btn").style.display = "block";
  document.getElementById("edit-btn").style.display = "none";

  document.getElementById("add-task").style.display = "block";
  document.getElementById("edit-task").style.display = "none";

  document.getElementById("submit-container").style.display = "block";
}

export function showEditTaskModal() {
  openModal();
  
  document.getElementById("add-task").style.display = "none";
  document.getElementById("edit-task").style.display = "block";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("edit-btn").style.display = "block";

  document.getElementById("submit-container").style.display = "block";
}


export function showTaskModal() {
  openModal();
  document.getElementById("task-container").style.display = "block";
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

  // 닫기 버튼 생성
  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.textContent = "×";
  closeButton.onclick = closeModal; // closeModal 함수를 클릭 이벤트에 연결

  // 모달 헤더 생성
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("column-header");
  modalHeader.textContent = "LOGIN";

  // 로그인 폼 생성
  const loginForm = document.createElement("div");
  loginForm.classList.add("form");

  const idGroup = createFormGroup("아이디", "login-id", "text", "아이디");
  const passwordGroup = createFormGroup(
    "비밀번호",
    "login-password",
    "password",
    "비밀번호"
  );

  // 로그인 버튼 생성
  const loginButton = document.createElement("button");
  loginButton.id = "login-btn";
  loginButton.textContent = "로그인";
  loginButton.addEventListener("click", closeModal);

  // 모달에 요소들 추가
  modalContainer.appendChild(closeButton);
  modalContainer.appendChild(modalHeader);
  loginForm.appendChild(idGroup);
  loginForm.appendChild(passwordGroup);
  loginForm.appendChild(loginButton);
  modalContainer.appendChild(loginForm);

  document.getElementById("modal-container").appendChild(modalContainer);
}

function createSignupModal() {
  const signupContainer = document.createElement("div");
  signupContainer.id = "signup-container";

  // close-btn 생성
  const closeBtn = document.createElement("span");
  closeBtn.id = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal; // closeModal 함수를 클릭 이벤트에 연결

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

  // 회원가입 버튼 생성
  const signupBtn = document.createElement("button");
  signupBtn.id = "signup-btn";
  signupBtn.textContent = "회원가입";
  signupBtn.addEventListener("click", closeModal);

  // 자식 요소들을 추가
  form.appendChild(idGroup);
  form.appendChild(passwordGroup);
  form.appendChild(passwordConfirmGroup);
  form.appendChild(signupBtn);

  signupContainer.appendChild(closeBtn);
  signupContainer.appendChild(columnHeader);
  signupContainer.appendChild(form);

  document.getElementById("modal-container").appendChild(signupContainer);
}

function createAddTaskModal() {
  const submitContainer = document.createElement("div");
  submitContainer.id = "submit-container";

  // close-btn 생성
  const closeBtn = document.createElement("span");
  closeBtn.id = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = closeModal; // closeModal 함수를 클릭 이벤트에 연결

  // ADD TASK column-header 생성
  const addTaskHeader = document.createElement("div");
  addTaskHeader.classList.add("column-header");
  addTaskHeader.id = "add-task";
  addTaskHeader.textContent = "ADD TASK";

  // EDIT TASK column-header 생성
  const editTaskHeader = document.createElement("div");
  editTaskHeader.classList.add("column-header");
  editTaskHeader.id = "edit-task";
  editTaskHeader.style.display = "none";
  editTaskHeader.textContent = "EDIT TASK";

  // form 생성
  const form = document.createElement("div");
  form.classList.add("form");

  // 입력 폼 그룹들 생성 및 추가
  const titleGroup = createFormGroup("제목", "task-title", "text", "제목");

  const assigneeGroup = document.createElement("div");
  assigneeGroup.classList.add("group");

  const assigneelabel = document.createElement("label");
  assigneelabel.setAttribute("for", "task-assignee");
  assigneelabel.textContent = "담당자";

  const assigneeselect = document.createElement("select");
  assigneeselect.classList.add("select-input");
  assigneeselect.id = "task-assignee";

  const assignees = ["윤겸", "정선", "아영", "다형"];
  assignees.forEach((assignee) => {
    const option = document.createElement("option");
    option.value = assignee;
    option.textContent = assignee;
    assigneeselect.appendChild(option);
  });

  assigneeGroup.appendChild(assigneelabel);
  assigneeGroup.appendChild(assigneeselect);

  const dueDateGroup = createFormGroup("완료일", "task-due-date", "date");

  const priorityGroup = document.createElement("div");
  priorityGroup.classList.add("group");

  const prioritylabel = document.createElement("label");
  prioritylabel.setAttribute("for", "task-priority");
  prioritylabel.textContent = "우선순위";

  const priorityselect = document.createElement("select");
  priorityselect.classList.add("select-input");
  priorityselect.id = "task-priority";

  const priorities = ["HIGH", "MEDIUM", "LOW"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.textContent = priority;
    if (priority === "MEDIUM") {
      option.selected = true; // 기본 선택값 설정
    }
    priorityselect.appendChild(option);
  });

  priorityGroup.appendChild(prioritylabel);
  priorityGroup.appendChild(priorityselect);

  const contentGroup = createFormGroup(
    "내용",
    "task-content",
    "textarea",
    "내용"
  );
  // const fileGroup = createFormGroup("파일 선택", "task-file", "file");

  // // 파일 선택 버튼 레이블 생성
  // const fileInputLabel = document.createElement("label");
  // fileInputLabel.setAttribute("for", "task-file");
  // fileInputLabel.classList.add("file-input-wrapper");

  // const fileInputButton = document.createElement("span");
  // fileInputButton.classList.add("file-input-button");
  // fileInputButton.textContent = "파일 선택";

  // const fileInput = fileGroup.querySelector("input");
  // fileInput.addEventListener("change", displayFileName);

  // const fileNameSpan = document.createElement("span");
  // fileNameSpan.id = "file-name";
  // fileNameSpan.textContent = "파일 추가하기";

  // fileInputLabel.appendChild(fileInputButton);
  // fileInputLabel.appendChild(fileInput);
  // fileInputLabel.appendChild(fileNameSpan);

  // 등록하기 버튼 생성
  const submitBtn = document.createElement("button");
  submitBtn.id = "submit-btn";
  submitBtn.textContent = "등록 하기";
  submitBtn.onclick = closeModal;

  submitBtn.addEventListener("click", function () {
    const title = document.getElementById("task-title").value;
    const assignee = document.getElementById("task-assignee").value;
    const dueDate = document.getElementById("task-due-date").value;
    const priority = document.getElementById("task-priority").value;
    const content = document.getElementById("task-content").value;

    createTaskCard(
      document.getElementById(value.cardColumnId),
      title,
      assignee,
      dueDate,
      priority,
      content
    );
  });

  // 수정하기 버튼 생성
  const editBtn = document.createElement("button");
  editBtn.id = "edit-btn";
  editBtn.style.display = "none";
  editBtn.textContent = "수정 하기";
  editBtn.onclick = closeModal;

  editBtn.addEventListener("click", function () {
    card.querySelector("strong").textContent =
      document.getElementById("task-title").value;
    card.querySelector("assignee").textContent =
      document.getElementById("task-assignee").value;
    card.querySelector(".due-date").textContent =
      document.getElementById("task-due-date").value;
    card.querySelector(".priority").textContent =
      document.getElementById("task-priority").value;
    // card.closest(".column").id =
    // document.getElementById("task-status").value;
    card.querySelector(".content").textContent =
      document.getElementById("task-content").value;
  });

  // 자식 요소들을 추가
  form.appendChild(titleGroup);
  form.appendChild(assigneeGroup);
  form.appendChild(dueDateGroup);
  form.appendChild(priorityGroup);
  form.appendChild(contentGroup);
  // form.appendChild(fileGroup);
  form.appendChild(submitBtn);
  form.appendChild(editBtn);

  submitContainer.appendChild(closeBtn);
  submitContainer.appendChild(addTaskHeader);
  submitContainer.appendChild(editTaskHeader);
  submitContainer.appendChild(form);

  document.getElementById("modal-container").appendChild(submitContainer);
}

function createTaskModal() {
  const container = document.createElement("div");
  container.id = "task-container";

  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = closeModal;
  container.appendChild(closeButton);

  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column-header");
  columnHeader.textContent = "TASK";
  container.appendChild(columnHeader);

  const createGroup = (label) => {
    const group = document.createElement("div");
    group.classList.add("group");

    const labelElement = document.createElement("label");
    labelElement.textContent = label;

    const labelContent = document.createElement("div");
    labelContent.classList.add("label");

    group.appendChild(labelElement);
    group.appendChild(labelContent);

    container.appendChild(group);
  };

  createGroup("제목");
  createGroup("당담자");
  createGroup("완료일");
  createGroup("우선순위");
  createGroup("상태");
  createGroup("내용");

  document.getElementById("modal-container").appendChild(container);
}