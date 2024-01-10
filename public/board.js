import { createColumn } from './column.js';
import { value } from './value.js';

export function initializeBoard() {
  initailizeBoardTitle();
  initailizeBoardBody();
  createInviteUserListModal(); // 보드 멤버 초대 모달 생성
  showInviteUserListModal(); //보드 멤버 초대 모달 활성화
  hideInviteUserListModal(); // 보드 멤버 초대 모달 비활성화
  createBoardMemberListModal(); // 보드 멤버 조회 모달 생성
  showBoardMemberListModal(); //보드 멤버 조회 모달 활성화
  hideBoardMemberListModal(); // 보드 멤버 조회 모달 비활성화
}

// export function moveAddColumButton() {
//   // const button = document.getElementById("add-column-btn");
//   // document.getElementById("board").appendChild(button);
// }

let currentBoardId;
let currentBoardMemberRole;


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

export async function loadboard(boardId, role) {
  document.getElementById('main-container').style.display = 'flex';
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
      alert(error.response.data.message);
    });
  document.getElementById('board-title').innerText = value.boardName;

  const inviteUserBtn = document.getElementById('invite-user-list-search');

  if (role === 0) inviteUserBtn.style.display = 'block';
  if (role !== 0) inviteUserBtn.style.display = 'none';
}

// 보드 목록 조회
export async function loadBoardList() {
  const boardList = document.getElementById('board-list');
  const accessToken = await localStorage.getItem('access_token');
  boardList.innerHTML = ``;

  // 보드 목록 조회 API
  await axios
    .get('/board', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      const boards = response.data.boards;
      boards.forEach((element) => {
        drawBoard(element.id, element.title, element.boardMember[0].role);
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
      const role = board.boardMember[0].role;

      drawBoard(boardId, title, role); // 새로 생성된 보드 그리기
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
async function drawBoard(boardId, title, role) {
  const boardList = document.getElementById('board-list');

  const clickableDiv = document.createElement('a');
  clickableDiv.innerText = title;
  clickableDiv.classList.add('clickable-item');
  clickableDiv.style.display = 'flex';

  // 클릭 이벤트 리스너 추가
  clickableDiv.addEventListener('click', function (e) {
    loadboard(boardId, role);
    currentBoardId = boardId;
    currentBoardMemberRole = role;
  });

  const trashButton = document.createElement('div');
  trashButton.innerHTML = `<span class="board-trash-button">
  <span class="material-symbols-outlined">delete</span>
  </span>`;

  // 사용자가 보드 Admin인 경우
  if (role === 0) clickableDiv.appendChild(trashButton);

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


//////////////////////////////////////// 보드 멤버 초대
// 보드 멤버 초대 모달 활성화
function showInviteUserListModal() {
  const inviteUserListSearchBtn = document.getElementById("invite-user-list-search");
  inviteUserListSearchBtn.addEventListener('click', function () {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("invite-user-list-container").style.display = "block";

    // 검색 입력란 초기화
    document.getElementById("invite-user-search-input").value = "";

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
  });
}

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
  inviteUserListUl.classList.add('board-ul');
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
      listItem.classList.add('board-li');
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

/////////////////////////////////////////////////////// 보드 멤버
// 보드 멤버 초대 모달 활성화
function showBoardMemberListModal() {
  const boardMemberListSearchBtn = document.getElementById("board-member-list-search");
  boardMemberListSearchBtn.addEventListener('click', function () {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("board-member-list-container").style.display = "block";

    // 검색 입력란 초기화
    document.getElementById("board-member-search-input").value = "";

    // member 목록 조회 API
    const accessToken = localStorage.getItem('access_token');
    axios.get(`/board-member/${currentBoardId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then(response => {
        console.log('response: ', response);
        const boardMembers = response.data.boardMembers;
        drawBoardMemberList(boardMembers); // 사용자 조회 결과 그리기기
      })
      .catch(error => {
        console.error(error);
      });
  });
}

// 보드 멤버 초대 모달 비활성화
function hideBoardMemberListModal() {
  document.getElementById("modal-container").style.display = "none";
  document.getElementById("board-member-list-container").style.display = "none";
}

// 보드 유저 초대 검색 모달 생성
function createBoardMemberListModal() {
  // 모달 컨테이너 생성
  const modalContainer = document.createElement("div");
  modalContainer.id = "board-member-list-container";
  modalContainer.classList.add("modal-container");
  document.getElementById("modal-container").appendChild(modalContainer);

  // 닫기 버튼 생성
  const closeButton = document.createElement("span");
  closeButton.id = "close-board-btn";
  closeButton.textContent = "×";
  closeButton.onclick = hideBoardMemberListModal; // closeModal 함수를 클릭 이벤트에 연결
  modalContainer.appendChild(closeButton);

  // 모달 헤더 생성
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("column-header");
  modalHeader.textContent = "보드 멤버 목록";
  modalContainer.appendChild(modalHeader);

  // 로그인 폼 생성
  const boardMemberListForm = document.createElement("div");
  boardMemberListForm.classList.add("form");
  modalContainer.appendChild(boardMemberListForm);

  // 사용자 검색 폼
  const boardMemberListSearchGroup = createFormGroup("", "board-member-search-input", "text", "사용자 이름 또는 이메일로 검색");
  boardMemberListForm.appendChild(boardMemberListSearchGroup);

  // 사용자 목록 Ul
  const boardMemberListUl = document.createElement("ul");
  boardMemberListUl.id = "board-member-search-results";
  boardMemberListUl.classList.add('board-ul');
  modalContainer.appendChild(boardMemberListUl);

  const memberKeyword = document.getElementById('board-member-search-input');
  memberKeyword.addEventListener("input", (event) => {
    if (memberKeyword.value === "") {
      // member 목록 조회 API
      const accessToken = localStorage.getItem('access_token');
      axios.get(`/board-member/${currentBoardId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
        .then(response => {
          console.log('response: ', response);
          const boardMembers = response.data.boardMembers;
          drawBoardMemberList(boardMembers); // 사용자 조회 결과 그리기기
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (memberKeyword.value !== "") {
      // member 목록 검색 API
      const accessToken = localStorage.getItem('access_token');
      axios.get(`/board-member/${currentBoardId}/${memberKeyword.value}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
        .then(response => {
          console.log('response: ', response);
          const boardMembers = response.data.boardMembers;
          drawBoardMemberList(boardMembers); // 사용자 조회 결과 그리기기
        })
        .catch(error => {
          console.error(error);
        });
    }
  });
}

async function drawBoardMemberList(boardMembers) {
  // 리스트 만들기!!!!!
  const boardMemberSearchResults = document.getElementById('board-member-search-results');

  // 검색 결과 목록 초기화
  boardMemberSearchResults.innerHTML = '';

  // 검색어와 일치하는 사람을 찾아서 결과 목록에 추가
  if (boardMembers) {
    boardMembers.forEach(boardMember => {
      console.log('boardMember: ', boardMember);
      const listItem = document.createElement('li');
      listItem.classList.add('searchResultUser');
      listItem.classList.add('board-li');
      listItem.textContent = `이메일 : ${boardMember.email} 이름 : ${boardMember.name}`;

      // 콤보박스 생성
      const roleComboBox = document.createElement('select');
      roleComboBox.classList.add('roleComboBox');

      // role 옵션 추가
      // admin은 만지지 못 하도록 설정 필요
      const adminOption = document.createElement('option');
      adminOption.value = '0';
      adminOption.textContent = 'admin';
      adminOption.disabled = true;
      adminOption.style.display = 'none';
      roleComboBox.appendChild(adminOption);

      const editorOption = document.createElement('option');
      editorOption.value = '1';
      editorOption.textContent = 'editor';
      roleComboBox.appendChild(editorOption);

      const viewerOption = document.createElement('option');
      viewerOption.value = '2';
      viewerOption.textContent = 'viewer';
      roleComboBox.appendChild(viewerOption);

      // 콤보박스에 값 설정
      roleComboBox.value = boardMember.boardMember[0].role;

      // 보드 멤버의 role가 admin일 경우/로그인 한 사용자의 role가 0 또는 1이 아닐 경우 role 콤보박스 비활성화
      if (boardMember.boardMember[0].role === 0 || currentBoardMemberRole !== 0 && currentBoardMemberRole !== 1) roleComboBox.disabled = true;

      // 콤보박스에 이벤트 리스너 추가
      roleComboBox.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        const accessToken = localStorage.getItem('access_token');
        axios.patch(`/board-member/${currentBoardId}/${boardMember.id}`,
          { role: selectedRole },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
          .then(response => {
            console.log('response: ', response);
            alert("권한 수정이 완료되었습니다.");
          })
          .catch(error => {
            console.error(error);
            alert(error.response.data.message);
            roleComboBox.value = 0;
          });
      });

      // 리스트 아이템에 콤보박스 추가
      listItem.appendChild(roleComboBox);

      // 삭제 버튼
      const trashButton = document.createElement('div');
      trashButton.innerHTML = `<span class="board-trash-button">
        <span class="material-symbols-outlined">delete</span>
        </span>`;
      if (boardMember.boardMember[0].role !== 0 && currentBoardMemberRole === 0 || currentBoardMemberRole === 1) listItem.appendChild(trashButton);

      trashButton.addEventListener('click', function () {
        if (confirm('보드 멤버를 삭제하시겠습니까?')) {
          // 사용자가 '확인'을 클릭한 경우
          // 보드 정보 삭제 API
          const accessToken = localStorage.getItem('access_token');
          axios.delete(`/board-member/${currentBoardId}/${boardMember.id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          )
            .then(response => {
              console.log('response: ', response);
              alert("삭제가 완료되었습니다.");
            })
            .catch(error => {
              console.log('error: ', error);
              alert(error.response.data.message);
            });
          listItem.remove();
        }
      });

      // 결과 목록에 리스트 아이템 추가
      boardMemberSearchResults.appendChild(listItem);
    });
  }
}