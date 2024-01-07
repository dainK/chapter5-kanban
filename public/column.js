// import { moveAddColumButton } from "./board.js";
import { showAddTaskModal } from "./modal.js";
import {value } from "./value.js";

export function createColumn(columnId, columnTitle) {
  const column = document.createElement("div");
  column.classList.add("column");
  column.id = columnId;
  column.draggable = true;

  const columnHeaderBox = document.createElement("div");
  columnHeaderBox.classList.add("column-header-box");
  column.appendChild(columnHeaderBox);

  const trashButton = document.createElement("div");
  trashButton.innerHTML = `<span class="trash-button">
  <span class="material-symbols-outlined">delete</span>
  </span>`;
  column.appendChild(trashButton);

  trashButton.addEventListener("click", function () {
    if (confirm("이 열을 삭제하시겠습니까?")) {
      column.remove();
    }
  });

  const columnHeader = document.createElement("div");
  columnHeader.classList.add("column-header");
  columnHeader.textContent = columnTitle;
  columnHeader.addEventListener("click", function (e) {
    // 클릭 시 수정 가능한 입력 상자로 변경
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = columnHeader.textContent;

    inputElement.addEventListener("keydown", function (event) {
      // 엔터 키를 누르면 변경된 내용을 적용하고 입력 상자 제거
      if (event.key === "Enter") {
        columnHeader.textContent = inputElement.value;
        column.removeChild(inputElement);
      }
    });

    inputElement.addEventListener("blur", function () {
      // 입력 상자에서 포커스가 벗어날 때, 변경된 내용을 적용하고 입력 상자 제거
      columnHeader.textContent = inputElement.value;
      column.removeChild(inputElement);
    });

    columnHeader.textContent = "";
    columnHeader.appendChild(inputElement);
    inputElement.focus();
  });

  columnHeaderBox.appendChild(columnHeader);
  // column.appendChild(columnHeader);
  column.appendChild(document.createElement("br"));

  column.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  column.addEventListener("drop", function (e) {
    e.preventDefault();
    if (value.draggedcardItem) {
      let afterElement = getCardDragAfterElement(column, e.clientY);
      if (afterElement == null) {
        column.appendChild(value.draggedcardItem);
      } else {
        column.insertBefore(value.draggedcardItem, afterElement);
      }
      moveAddCardButton(column);
    } else if (value.draggedcolumnItem) {
      // 열에 대한 드래그 앤 드롭 처리 추가
      let afterElement = getColumnDragAfterElement(board, e.clientX);
      if (afterElement == null) {
        board.appendChild(value.draggedcolumnItem);
      } else {
        board.insertBefore(value.draggedcolumnItem, afterElement);
      }
    }
  });

  // 드래그 앤 드롭을
  column.addEventListener("dragstart", function (e) {
    if (!value.draggedcardItem) {
      // if (!e.target.classList.contains("card")) {
        value.draggedcolumnItem = column;
      column.classList.add("dragging");
      setTimeout(() => (column.style.display = "none"), 0);
    }
  });

  column.addEventListener("dragend", function (e) {
    if (!value.draggedcardItem) {
      // if (!e.target.classList.contains("card")) {
      setTimeout(() => {
        column.style.display = "block";
        column.classList.remove("dragging");
        value.draggedcolumnItem = null;
        moveAddCardButton(column);
      }, 0);
    }
  });

  const buttonbox = document.createElement("div");
  buttonbox.classList.add("column-button-box");

  const addButton = document.createElement("button");
  addButton.classList.add("add-btn");
  addButton.textContent = "추가";

  addButton.addEventListener("click", function () {
    showAddTaskModal(column.id);
  });

  buttonbox.appendChild(addButton);
  column.appendChild(buttonbox);

  document.getElementById("board").appendChild(column);
  // moveAddColumButton();
  return column;
}

export function moveAddCardButton(container) {
  const buttonbox = container.querySelector(".column-button-box");
  container.appendChild(buttonbox); // 버튼 상자를 가장 아래로 이동
}

// 드래그 후 요소 위치 결정
function getCardDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
