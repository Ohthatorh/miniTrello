function addBoard(board) {
  return {
    type: 'ADD_BOARD',
    board
  }
}

function addList(list) {
  return {
    type: 'ADD_LIST',
    list
  }
}

function addTodo(todo) {
  return {
    type: 'ADD_TODO',
    todo
  }
}

function changeActive(todo) {
  return {
    type: 'SWAP_ACTIVE',
    todo
  }
}

function transferTodo(...args) {
  const [boardId, payload, indexTo, indexFrom, dragFromId, dragToId] = args
  return {
    type: 'TRANSFER_TODO',
    boardId,
    payload,
    indexTo,
    indexFrom,
    dragFromId,
    dragToId,
  }
}

function reorder(...args) {
  const [boardId, listId, list] = args
  return {
    type: 'REORDER_LIST',
    boardId,
    listId,
    list
  }
}

function deleteTodo(...args) {
  const [boardId, listId, todoId] = args
  return {
    type: 'DELETE_TODO',
    boardId,
    listId,
    todoId
  }
}

function deleteBoard(boardId) {
  return {
    type: 'DELETE_BOARD',
    boardId,
  }
}

export const createBoard = title => dispatch => {
  const board = {
    id: Math.floor(Math.random() * 900) + 100,
    title,
    lists: []
  }
  return dispatch(addBoard(board))
}

export const createList = (...args) => dispatch => {
  const [id, title] = args
  const list = {
    id,
    listId: Math.floor(Math.random() * 900) + 100,
    title
  }
  return dispatch(addList(list))
}

export const createTodo = (...args) => dispatch => {
  const [id, listId, name] = args
  const todo = {
    id,
    todoId: Math.floor(Math.random() * 900) + 100,
    listId,
    name
  }
  return dispatch(addTodo(todo))
}

export const swapActive = (...args) => dispatch => {
  const [id, listId, todoId, active] = args
  const changedTodo = {
    id,
    listId,
    todoId,
    active: (active) ? false : true
  }
  return dispatch(changeActive(changedTodo))
}

export const dragTodo = (...args) => dispatch => {
  const [boardId, payload, indexTo, indexFrom, dragFromId, dragToId] = args
  return dispatch(transferTodo(boardId, payload, indexTo, indexFrom, dragFromId, dragToId))
}

export const reorderList = (...args) => dispatch => {
  const [boardId, listId, list] = args
  return dispatch(reorder(boardId, listId, list))
}

export const deleteTodoItem = (...args) => dispatch => {
  const [boardId, listId, todoId] = args
  return dispatch(deleteTodo(boardId, listId, todoId))
}

export const deleteBoardItem = (boardId) => dispatch => {
  return dispatch(deleteBoard(boardId))
}