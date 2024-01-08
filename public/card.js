import { moveAddCardButton } from "./column.js";
import { value } from "./value.js";

// 새 태스크 카드를 생성하는 함수
export function createTaskCard(
  column,
  title,
  assignee,
  dueDate,
  priority,
  content
) {
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
      showTaskModal();
    }
  });

  column.appendChild(card);
  moveAddCardButton(column);

  // return card;
}
