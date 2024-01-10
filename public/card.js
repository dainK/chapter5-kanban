import { moveAddCardButton } from "./column.js";
import { value } from "./value.js";


export function initializeCard() {
  drawAddTaskModal();
  drawVeiwTaskModal();

  hideAddTaskModal();
  // hideEditTaskModal();
  hideVeiwTaskModal();
}


export function showAddTaskModal(columnId) {
  value.cardColumnId = columnId;
  document.getElementById("modal-container").style.display = "flex";

  //reset
  document.getElementById("task-title").value = "";
  document.getElementById("task-assignee").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-priority").value = "1";
  document.getElementById("task-content").value = "";

  document.getElementById("submit-btn").style.display = "block";
  document.getElementById("edit-btn").style.display = "none";

  document.getElementById("add-task").style.display = "block";
  document.getElementById("edit-task").style.display = "none";

  document.getElementById("submit-container").style.display = "block";
}

// 카드 생성 모달 비활성화
function hideAddTaskModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("submit-container").style.display = "none";
}

// 카드 편집 모달 비활성화
function showEditTaskModal() {
  document.getElementById("modal-container").style.display = "flex";

  document.getElementById("add-task").style.display = "none";
  document.getElementById("edit-task").style.display = "block";
  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("edit-btn").style.display = "block";

  document.getElementById("submit-container").style.display = "block";
}

// 카드 조회 모달 활성화
function showVeiwTaskModal() {
  document.getElementById("modal-container").style.display = "flex";
  document.getElementById("task-container").style.display = "block";
}

// 카드 조회 모달 비활성화
function hideVeiwTaskModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("task-container").style.display = "none";
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

// 카드 추가 모달 그리기
function drawAddTaskModal() {
  const submitContainer = document.createElement("div");
  submitContainer.id = "submit-container";

  // close-btn 생성
  const closeBtn = document.createElement("span");
  closeBtn.id = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = hideAddTaskModal;

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
  priorities.forEach((priority, index) => {
    const option = document.createElement("option");
    option.value = index;
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

  submitBtn.addEventListener("click", function () {
    const columnId = document.getElementById(value.cardColumnId).id;
    const title = document.getElementById("task-title").value;
    const assignee = document.getElementById("task-assignee").value;
    const dueDate = document.getElementById("task-due-date").value;
    const priority = document.getElementById("task-priority").value;
    const content = document.getElementById("task-content").value;

    // 카드 저장 API
    const accessToken = localStorage.getItem('access_token');
    axios
      .post(`/card/${columnId}`,
        { title, content, deadLine: dueDate, priority },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((response) => {
        createTaskCard(
          columnId,
          title,
          assignee,
          dueDate,
          priority,
          content
        );
        hideAddTaskModal();
      })
      .catch((error) => {
        console.log('error: ', error);
        alert(error.response.data.message);
      });
  });

  // 수정하기 버튼 생성
  const editBtn = document.createElement("button");
  editBtn.id = "edit-btn";
  editBtn.style.display = "none";
  editBtn.textContent = "수정 하기";
  editBtn.onclick = hideAddTaskModal;

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

// 카드 조회 모달 그리기
export function drawVeiwTaskModal() {
  const container = document.createElement("div");
  container.id = "task-container";

  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = hideVeiwTaskModal;
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
// 새 태스크 카드를 생성하는 함수
export async function createTaskCard(
  column,
  title,
  assignee,
  dueDate,
  priority,
  content
) {
  const currentColumn = document.getElementById(column);

  const card = document.createElement("div");
  card.classList.add("card");
  card.draggable = true;

  const strongElement = document.createElement("strong");
  strongElement.textContent = title || "제목없음";
  card.appendChild(strongElement);
  card.appendChild(document.createElement("br"));

  const assigneeElement = document.createElement("assignee");
  assigneeElement.textContent = assignee || "담당자없음";
  card.appendChild(assigneeElement);
  card.appendChild(document.createElement("br"));

  const dueDateElement = document.createElement("span");
  dueDateElement.classList.add("due-date");
  dueDateElement.textContent = dueDate || "날짜없음";
  card.appendChild(dueDateElement);
  card.appendChild(document.createElement("br"));

  const priorityElement = document.createElement("span");
  priorityElement.classList.add("priority");
  priorityElement.textContent = priority;
  card.appendChild(priorityElement);
  card.appendChild(document.createElement("br"));

  const contentElement = document.createElement("span");
  contentElement.classList.add("content");
  contentElement.textContent = content;
  card.appendChild(contentElement);
  card.appendChild(document.createElement("br"));

  const buttonbox = document.createElement("div");
  buttonbox.classList.add("button-box");
  card.appendChild(buttonbox);

  const editButton = document.createElement("button");
  editButton.classList.add("edit-btn");
  editButton.textContent = "수정";
  buttonbox.appendChild(editButton);

  editButton.addEventListener("click", function () {

    showEditTaskModal();

    const cardData = {
      title: card.querySelector("strong").textContent,
      assignee: card.querySelector("assignee").textContent,
      dueDate: card.querySelector(".due-date").textContent,
      priority: card.querySelector(".priority").textContent,
      status: card.closest(".column").id,
      content: card.querySelector(".content").textContent,
    };

    // 여기서 cardData를 활용하여 원하는 작업 수행
    console.log(cardData);

    document.getElementById("task-title").value = cardData.title;
    document.getElementById("task-assignee").value = cardData.assignee;
    cardData.dueDate !== "날짜없음";
    document.getElementById("task-due-date").value = cardData.dueDate;
    document.getElementById("task-priority").value = cardData.priority;
    // document.getElementById("task-status").value = cardData.status;
    document.getElementById("task-content").value = cardData.content;
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("edit-btn").style.display = "block";
    document.getElementById("add-task").style.display = "none";
    document.getElementById("edit-task").style.display = "block";

  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "삭제";
  buttonbox.appendChild(deleteButton);

  deleteButton.addEventListener("click", function (e) {
    e.target.parentNode.parentNode.remove();
  });

  // 드래그 앤 드롭을
  card.addEventListener("dragstart", function () {
    value.draggedcardItem = card;
    card.classList.add("dragging");
    setTimeout(() => (card.style.display = "none"), 0);
  });

  card.addEventListener("dragend", function () {
    setTimeout(() => {
      card.style.display = "block";
      card.classList.remove("dragging");
      value.draggedcardItem = null;
    }, 0);
  });

  card.addEventListener("click", function (e) {
    if (
      !e.target.classList.contains("edit-btn") &&
      !e.target.classList.contains("delete-btn")
    ) {
      showVeiwTaskModal();
    }
  });

  currentColumn.appendChild(card);
  moveAddCardButton(currentColumn);

  // return card;
}
