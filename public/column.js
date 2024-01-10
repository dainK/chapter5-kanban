// import { moveAddColumButton } from "./board.js";
import { showAddTaskModal, createTaskCard } from "./card.js";
import { value } from "./value.js";

// 칼럼 저장
export async function createColumn(boardId, columnId, columnTitle) {
  // 칼럼 정보 저장 API
  const accessToken = await localStorage.getItem('access_token');
  await axios
    .post(`/board-column/${boardId}`,
      { title: columnTitle },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    .then((response) => {
      console.log('response: ', response);
      // drawColumn(boardId, columnId, columnTitle);
      loadColumnList(boardId);
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
}

// 칼럼 목록 조회
export async function loadColumnList(boardId) {
  const board = document.getElementById('board');
  const accessToken = await localStorage.getItem('access_token');

  // 칼럼 목록 조회 API
  await axios
    .get(`/board-column/${boardId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      board.innerHTML = ``;
      const columns = response.data.columns;
      columns.forEach((column, index) => {
        // drawColumn(column.id, column.title, column.boardMember[0].role); // role은 일단 킵
        drawColumn(boardId, column.id, column.title, index); // 칼럼 그리기
        column.card.forEach((e) => {
          createTaskCard(e.board_column_id, e.title, '아영', e.dead_line, e.priority, e.content); // 카드 그리기
        });
      });
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
}

// 칼럼 정보 수정
export async function updateColumn(boardId, columnId, title, index) {
  console.log('index: ', index);
  // 칼럼 정보 보기 api
  const accessToken = await localStorage.getItem('access_token');
  await axios
    .patch(
      `/board-column/${boardId}/${columnId}`,
      { title, index },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    .then((response) => {
      console.log('response: ', response.data);
      console.log("수정 완료");
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
}

// 칼럼 그리기
export function drawColumn(boardId, columnId, columnTitle, index) {
  const board = document.getElementById('board');

  const column = document.createElement("div");
  column.id = columnId;
  column.classList.add("column");
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
      // 사용자가 '확인'을 클릭한 경우
      // 칼럼 정보 삭제 API
      const accessToken = localStorage.getItem('access_token');
      axios.delete(`/board-column/${boardId}/${columnId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
        .then(response => {
          column.remove();
        })
        .catch(error => {
          console.log('error: ', error);
          alert(error.response.data.message);
        });
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

    // 입력 상자 상태 변경
    // 제목이 ''이 아닌 값으로 변경되었을 때에만 칼럼 정보 수정
    // 엔터 누르면 blur 이벤트도 실행되어서 2번 업데이트 치는거 불편한데......
    inputElement.addEventListener('keydown', function (event) {
      // 엔터 키를 누르면 변경된 내용을 적용하고 입력 상자 제거
      if (event.key === 'Enter') {
        if (inputElement.value !== '' && inputElement.value !== columnTitle) {
          updateColumn(boardId, columnId, inputElement.value, index); // 칼럼 정보 수정
          columnHeader.textContent = inputElement.value; // title 값 갱신
          event.target.remove();
        }
        // 칼럼 제목을 변경하지 않았을 경우
        if (inputElement.value === '' || inputElement.value === value.columnTitle) {
          clickableDiv.innerText = columnTitle;
          event.target.remove();
        }
      }
    });

    inputElement.addEventListener('blur', function (event) {
      // 입력 상자에서 포커스가 벗어날 때, 변경된 내용을 적용하고 입력 상자 제거
      if (inputElement.value !== '' && inputElement.value !== columnTitle) {
        updateColumn(boardId, columnId, inputElement.value, index); // 칼럼 정보 수정
        columnHeader.textContent = inputElement.value; // title 값 갱신
        event.target.remove();
      }
      // 칼럼 제목을 변경하지 않았을 경우
      if (inputElement.value === '' || inputElement.value === columnTitle) {
        clickableDiv.innerText = columnTitle;
        event.target.remove();
      }
    });

    columnHeader.textContent = "";
    columnHeader.appendChild(inputElement);
    inputElement.focus();
  });

  columnHeaderBox.appendChild(columnHeader);
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
      console.log('afterElement: ', afterElement);
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

  // 칼럼 이동 완료
  column.addEventListener("dragend", function (e) {
    if (!value.draggedcardItem) {
      // 현재 column div의 index 찾기
      const columns = document.querySelectorAll('.column');
      index = Array.from(columns).indexOf(column);
      setTimeout(() => {
        updateColumn(boardId, columnId, columnTitle, index); // 칼럼 정보 수정
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
