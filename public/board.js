import { createColumn } from "./column.js";
import { value } from "./value.js";


export function initializeBoard() {
  const main = document.getElementById("main");

  const board = document.createElement("div");
  board.classList.add("board");
  board.id ='board';
  // document.body.appendChild(board);
  main.appendChild(board);

  const addColumnButton = document.createElement("button");
  addColumnButton.id = "add-column-btn";
  // addColumnButton.className = "add-column-btn";
  addColumnButton.innerHTML = `<span class="material-symbols-outlined">
  add_circle
  </span>`;
  addColumnButton.addEventListener("click", function () {
    const boardContainer = document.getElementById("board");
    const columns = boardContainer.querySelectorAll(".column");
    createColumn(columns.length, columns.length);
  });
  // board.appendChild(addColumnButton);
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
