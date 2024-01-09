import { createColumn } from './column.js';
import { value } from './value.js';

export function initializeBoard() {
  initailizeBoardTitle();
  initailizeBoardBody();
}

// export function moveAddColumButton() {
//   // const button = document.getElementById("add-column-btn");
//   // document.getElementById("board").appendChild(button);
// }

function initailizeBoardTitle() {
  const boardname = document.getElementById('board-name');

  const clickableDiv = document.createElement('a');
  clickableDiv.innerText = value.boardName;
  clickableDiv.id = 'board-title';
  clickableDiv.classList.add('clickable-item');

  // 클릭 이벤트 리스너 추가
  clickableDiv.addEventListener('click', function (e) {
    // 클릭 시 수정 가능한 입력 상자로 변경
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = clickableDiv.innerText;

    // 입력 상자 상태 변경
    // 제목이 ''이 아닌 값으로 변경되었을 때에만 보드 정보 수정
    inputElement.addEventListener('keydown', function (event) {
      // 엔터 키를 누르면 변경된 내용을 적용하고 입력 상자 제거
      if (event.key === 'Enter') {
        if (inputElement.value !== '' && inputElement.value !== value.boardName) {
          updateBoard(value.boardId, inputElement.value); // 보드 정보 수정
          value.boardName = inputElement.value; // title 값 갱신
          clickableDiv.innerText = inputElement.value; // clickableDiv.innerText 값 갱신
          event.target.remove();
        }
        // 보드 제목을 변경하지 않았을 경우
        if (inputElement.value === '' || inputElement.value === value.boardName) {
          clickableDiv.innerText = value.boardName;
          event.target.remove();
        }
      }
    });

    inputElement.addEventListener('blur', function (event) {
      // 입력 상자에서 포커스가 벗어날 때, 변경된 내용을 적용하고 입력 상자 제거
      if (inputElement.value !== '' && inputElement.value !== value.boardName) {
        updateBoard(value.boardId, inputElement.value); // 보드 정보 수정
        value.boardName = inputElement.value; // title 값 갱신
        clickableDiv.innerText = inputElement.value; // clickableDiv.innerText 값 갱신
        event.target.remove();
      }
      // 보드 제목을 변경하지 않았을 경우
      if (inputElement.value === '' || inputElement.value === value.boardName) {
        clickableDiv.innerText = value.boardName;
        event.target.remove();
      }
    });

    // 기존 텍스트 숨김
    clickableDiv.innerText = '';

    // 입력 상자 추가
    clickableDiv.appendChild(inputElement);
    inputElement.focus();
  });

  // 부모 요소에 클릭 가능한 div 추가
  boardname.appendChild(clickableDiv);
}

function initailizeBoardBody() {
  const main = document.getElementById('main');

  const board = document.createElement('div');
  board.classList.add('board');
  board.id = 'board';
  main.appendChild(board);

  const addColumnButton = document.createElement('button');
  addColumnButton.id = 'add-column-btn';
  addColumnButton.innerHTML = `<span class="material-symbols-outlined">
  add_circle
  </span>`;
  addColumnButton.addEventListener('click', function () {
    const boardContainer = document.getElementById('board');
    const columns = boardContainer.querySelectorAll('.column');
    createColumn(columns.length, columns.length);
  });
  main.appendChild(addColumnButton);

  board.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  board.addEventListener('drop', function (e) {
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
    const draggableElements = [...board.querySelectorAll('.column:not(.dragging)')];

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
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }
}

export async function loadboard(boardId) {
  value.boardId = boardId;
  const accessToken = await localStorage.getItem('access_token');
  await axios
    .get(`/board/${value.boardId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      const board = response.data.board;
      value.boardName = board.title;
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
  document.getElementById('board-title').innerText = value.boardName;
}

// 보드 목록 조회
export async function loadBoardList() {
  const boardList = document.getElementById('board-list');
  const accessToken = await localStorage.getItem('access_token');
  boardList.innerHTML = ``;
  // const text = document.createElement("p");
  // text.innerText = `내 보드 목록`;
  // boardList.appendChild(text);

  // 보드 목록 조회 API
  await axios
    .get('/board', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      const boards = response.data.boards;
      boards.forEach((element) => {
        drawBoard(element.id, element.title);
      });
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });

  await drawPlusBoard(); // 보드 추가 버튼 그리기
}

async function createBoard() {
  const accessToken = await localStorage.getItem('access_token');
  // 보드 정보 저장 API
  await axios
    .post(
      '/board',
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    .then((response) => {
      const board = response.data.board;
      const boardId = board.id;
      const title = board.title;

      drawBoard(boardId, title); // 새로 생성된 보드 그리기
      drawPlusBoard('create'); // 보드 추가 버튼 그리기
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
}

// 보드 생성 버튼 그리기
async function drawPlusBoard(status) {
  const boardList = document.getElementById('board-list');
  const prePlusBtn = document.getElementById('board-plus');

  // 보드를 저장했을 경우 플러스 버튼 삭제 후 재생성
  if (status === 'create') prePlusBtn.remove();

  const plus = document.createElement('a');
  plus.id = 'board-plus';
  plus.innerHTML = `<span class="material-symbols-outlined">
    add_circle
    <span>`;
  boardList.appendChild(plus);

  // 보드 추가 버튼 클릭
  plus.addEventListener('click', () => {
    createBoard(); // 보드 정보 저장
  });
}

async function updateBoard(boardId, title) {
  const accessToken = await localStorage.getItem('access_token');
  // 보드 정보 보기 api
  await axios
    .patch(
      `/board/${boardId}`,
      { title },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    )
    .then((response) => {
      console.log('response: ', response);
      loadBoardList();
    })
    .catch((error) => {
      console.log('error: ', error);
      alert(error.response.data.message);
    });
}

// 보드 그리기
async function drawBoard(boardId, title) {
  const boardList = document.getElementById('board-list');

  const clickableDiv = document.createElement('a');
  clickableDiv.innerText = title;
  clickableDiv.classList.add('clickable-item');
  clickableDiv.style.display = 'flex';

  // 클릭 이벤트 리스너 추가
  clickableDiv.addEventListener('click', function (e) {
    loadboard(boardId);
  });

  const trashButton = document.createElement('div');
  trashButton.innerHTML = `<span class="board-trash-button">
  <span class="material-symbols-outlined">delete</span>
  </span>`;
  clickableDiv.appendChild(trashButton);

  trashButton.addEventListener('click', function () {
    if (confirm('보드를 삭제하시겠습니까?')) {
      // 사용자가 '확인'을 클릭한 경우
      // 보드 정보 삭제 API
      const accessToken = localStorage.getItem('access_token');

      axios.delete(`/board/${boardId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
        .then(response => {
          console.log('response: ', response);
          alert("삭제가 완료되었습니다.");
          location.reload();
        })
        .catch(error => {
          console.log('error: ', error);
          alert(error.response.data.message);
        });
      // loadBoardList();
    }
  });

  // 부모 요소에 클릭 가능한 div 추가
  boardList.appendChild(clickableDiv);
}
