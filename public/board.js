import { createColumn } from "./column.js";
import { value } from "./value.js";

export function initializeBoard() {
  const main = document.getElementById("main");

  const board = document.createElement("div");
  board.classList.add("board");
  board.id = "board";
  main.appendChild(board);

  const addColumnButton = document.createElement("button");
  addColumnButton.id = "add-column-btn";
  addColumnButton.innerHTML = `<span class="material-symbols-outlined">
  add_circle
  </span>`;
  addColumnButton.addEventListener("click", function () {
    const boardContainer = document.getElementById("board");
    const columns = boardContainer.querySelectorAll(".column");
    createColumn(columns.length, columns.length);
  });
  main.appendChild(addColumnButton);

  board.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  board.addEventListener("drop", function (e) {
    e.preventDefault();
    if (value.draggedcolumnItem) {
      let afterElement = getColumnDragAfterElement(e);
      if (afterElement == null) {
        board.appendChild(value.draggedcolumnItem);
      } else {
        board.insertBefore(value.draggedcolumnItem, afterElement);
      }
      // moveAddColumButton();
    }
  });
  function getColumnDragAfterElement(e) {
    const draggableElements = [
      ...board.querySelectorAll(".column:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, column) => {
        const box = column.getBoundingClientRect();
        const offset = e.clientX - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: column };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

// export function moveAddColumButton() {
//   // const button = document.getElementById("add-column-btn");
//   // document.getElementById("board").appendChild(button);
// }

export function loadboard() {
  const boardname = document.getElementById("board-name");
  // 보드이름
}

export function loadBoardList() {
  const boardList = document.getElementById("board-list");
  boardList.innerHTML = ``;
  // const text = document.createElement("p");
  // text.innerText = `내 보드 목록`;
  // boardList.appendChild(text);
  const list = ["보드1", "보드2", "qhem3"];
  list.forEach((element) => {
    createBoard(element);
  });

  const plus = document.createElement("a");
  plus.innerHTML = `<span class="material-symbols-outlined">
  add_circle
  </span>`;
  boardList.appendChild(plus);
  plus.addEventListener("click",()=>{
    createBoard("새 보드");
    boardList.appendChild(plus);
  })
}

function createBoard(name) {
  const boardList = document.getElementById("board-list");
  
  const clickableDiv = document.createElement("a");
  clickableDiv.innerText = name;
  clickableDiv.classList.add("clickable-item");

  // 클릭 이벤트 리스너 추가
  clickableDiv.addEventListener("click", function (e) {
    // 클릭 시 수정 가능한 입력 상자로 변경
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = clickableDiv.innerText;

    inputElement.addEventListener("keydown", function (event) {
      // 엔터 키를 누르면 변경된 내용을 적용하고 입력 상자 제거
      if (event.key === "Enter") {
        clickableDiv.innerText = inputElement.value;
        // clickableDiv.removeChild(inputElement);
        // event.target.parentNode.removeChild(event.target);
        event.target.remove();
      }
    });

    inputElement.addEventListener("blur", function (event) {
      // 입력 상자에서 포커스가 벗어날 때, 변경된 내용을 적용하고 입력 상자 제거
      clickableDiv.innerText = inputElement.value;
      // clickableDiv.removeChild(inputElement);
      // event.target.parentNode.removeChild(event.target);
      event.target.remove();
    });

    // 기존 텍스트 숨김
    clickableDiv.innerText = "";

    // 입력 상자 추가
    clickableDiv.appendChild(inputElement);
    inputElement.focus();
  });

  // 부모 요소에 클릭 가능한 div 추가
  boardList.appendChild(clickableDiv);
}
