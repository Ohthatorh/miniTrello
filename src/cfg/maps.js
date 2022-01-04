import { 
  createBoard, 
  createList, 
  createTodo, 
  dragTodo, 
  swapActive, 
  reorderList, 
  deleteTodoItem, 
  deleteBoardItem 
} from '../actions/actions'

export const mapStateToProps = (state) => {
  return {
    boards: state
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    createBoard: board => dispatch(createBoard(board)),
    createList: (id, title) => dispatch(createList(id, title)),
    createTodo: (id, listId, name) => dispatch(createTodo(id, listId, name)),
    swapActive: (id, listId, todoId, active) => dispatch(swapActive(id, listId, todoId, active)),
    dragTodo: (boardId, payload, indexTo, indexFrom, destinationId, fromId) => dispatch(dragTodo(boardId, payload, indexTo, indexFrom, destinationId, fromId)),
    reorderList: (boardId, listId, list) => dispatch(reorderList(boardId, listId, list)),
    deleteTodoItem: (todoId, boardId, listId) => dispatch(deleteTodoItem(todoId, boardId, listId)),
    deleteBoardItem: (boardId) => dispatch(deleteBoardItem(boardId))
  }
}