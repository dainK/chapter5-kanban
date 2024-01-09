import { createColumn } from './column.js';
import { value } from './value.js';

export function initializeBoard() {
  initailizeBoardTitle();
  initailizeBoardBody();
  createInviteUserListModal(); // 보드 멤버 초대 모달 생성
  showInviteUserListModal(); //보드 멤버 초대 모달 활성화
  hideInviteUserListModal(); // 보드 멤버 초대 모달 비활성화
}

// export function moveAddColumButton() {
//   // const button = document.getElementById("add-column-btn");
//   // document.getElementById("board").appendChild(button);
// }

let currentBoardId;

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
    currentBoardId = boardId;
    console.log('boardId: ', boardId);
    console.log('currentBoardId: ', currentBoardId);
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

// 보드 멤버 초대 모달 활성화
function showInviteUserListModal() {
  const inviteUserListSearchBtn = document.getElementById("invite-user-list-search");
  inviteUserListSearchBtn.addEventListener('click', function () {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("invite-user-list-container").style.display = "block";
  });
}

// 보드 멤버 초대 모달 활성화
// export function showInviteUserListModal() {

// }

// 보드 멤버 초대 모달 비활성화
function hideInviteUserListModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("invite-user-list-container").style.display = "none";
}


// 1. 검색 모달 만들기
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

// 보드 유저 초대 검색 모달 생성
function createInviteUserListModal() {
  // 모달 컨테이너 생성
  const modalContainer = document.createElement("div");
  modalContainer.id = "invite-user-list-container";
  modalContainer.classList.add("modal-container");
  document.getElementById("modal-container").appendChild(modalContainer);

  // 닫기 버튼 생성
  const closeButton = document.createElement("span");
  closeButton.id = "close-btn";
  closeButton.textContent = "×";
  closeButton.onclick = hideInviteUserListModal; // closeModal 함수를 클릭 이벤트에 연결
  modalContainer.appendChild(closeButton);

  // 모달 헤더 생성
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("column-header");
  modalHeader.textContent = "사용자 목록 조회";
  modalContainer.appendChild(modalHeader);

  // 로그인 폼 생성
  const inviteUserListForm = document.createElement("div");
  inviteUserListForm.classList.add("form");
  modalContainer.appendChild(inviteUserListForm);

  // 사용자 검색 폼
  const inviteUserListSearchGroup = createFormGroup("", "invite-user-search-input", "text", "사용자 이름 또는 이메일로 검색");
  inviteUserListForm.appendChild(inviteUserListSearchGroup);

  // 사용자 목록 Ul
  const inviteUserListUl = document.createElement("ul");
  inviteUserListUl.id = "invite-user-search-results";
  modalContainer.appendChild(inviteUserListUl);

  const userKeyword = document.getElementById('invite-user-search-input');
  userKeyword.addEventListener("input", (event) => {
    if (userKeyword.value === "") {
      // user 목록 조회 API
      const accessToken = localStorage.getItem('access_token');
      axios.get(`/user/${currentBoardId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
        .then(response => {
          const users = response.data.users;
          drawInviteUserList(users); // 사용자 조회 결과 그리기기
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (userKeyword.value !== "") {
      console.log("검색어 있음");
      // user 목록 검색 API
      const accessToken = localStorage.getItem('access_token');
      axios.get(`/user/list/${currentBoardId}/${userKeyword.value}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
        .then(response => {
          const users = response.data.users;
          drawInviteUserList(users); // 사용자 조회 결과 그리기기
        })
        .catch(error => {
          console.error(error);
        });
    }
  });
}

async function drawInviteUserList(users) {
  // 리스트 만들기!!!!!
  const inviteUserSearchResults = document.getElementById('invite-user-search-results');

  // 검색 결과 목록 초기화
  inviteUserSearchResults.innerHTML = '';

  // 검색어와 일치하는 사람을 찾아서 결과 목록에 추가
  if (users) {
    users.forEach(user => {
      const listItem = document.createElement('li');
      listItem.classList.add('searchResultUser');
      listItem.textContent = `이메일 : ${user.email} 이름 : ${user.name}`;

      // 초대 버튼 생성
      const inviteButton = document.createElement('button');
      inviteButton.textContent = '초대';
      inviteButton.classList.add('inviteButton');

      // 버튼에 이벤트 리스너 추가 (예: 사용자 초대 함수)
      inviteButton.addEventListener('click', (event) => {
        // 보드 멤버 추가 API
        const accessToken = localStorage.getItem('access_token');
        axios.post(`/board-member/${currentBoardId}`,
          { user_id: user.id },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
          .then(response => {
            console.log('response: ', response);
            alert("멤버 초대가 완료되었습니다.");
            listItem.remove();
          })
          .catch(error => {
            console.error(error);
          });
      });
      // 리스트 아이템에 버튼 추가
      listItem.appendChild(inviteButton);

      // 결과 목록에 리스트 아이템 추가
      inviteUserSearchResults.appendChild(listItem);
    });
  }
}