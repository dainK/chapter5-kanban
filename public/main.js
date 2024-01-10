import { initializeBoard } from "./board.js";
import { initializeCard } from "./card.js";
import { initializeModals } from "./user.js";
import { initailizeSideBar } from "./sidebar.js";
import { initailizeNotification } from "./socket.js";

document.addEventListener("DOMContentLoaded", function () {
  initailizeSideBar();
  initializeBoard();
  initializeModals();
  initializeCard();
  initailizeNotification();
});

// loadTasks();
// // 서버에 태스크 데이터를 저장하는 함수
// function saveTasks() {
//   const tasks = [];
//   document.querySelectorAll('.column').forEach(column => {
//     const columnTasks = Array.from(column.querySelectorAll('.card')).map(card => ({
//       title: card.querySelector('strong').textContent,
//       dueDate: card.querySelector('.due-date').textContent,
//       priority: card.querySelector('.priority').textContent,
//       content: card.querySelector('.content').textContent,
//       status: column.id,
//     }));
//     tasks.push(...columnTasks);
//   });

//   axios.post('/api/tasks', { tasks: tasks })
//     .then(response => {
//       console.log('Tasks saved successfully');
//     })
//     .catch(error => {
//       console.error('Error saving tasks:', error);
//     });
// }

// // 서버에서 태스크 데이터를 가져오는 함수
// function loadTasks() {
//   axios.get('/api/tasks')
//     .then(response => {
//       const tasks = response.data;  // 서버에서 받아온 태스크 데이터
//       tasks.forEach(task => {
//         const card = createTaskCard(task.title, task.dueDate, task.priority, task.content);
//         document.getElementById(task.status).appendChild(card);
//       });
//       initializeDragDrop();
//     })
//     .catch(error => {
//       console.error('Error loading tasks:', error);
//     });
// }
