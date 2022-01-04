export const trelloApp = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BOARD':
      return [...state, action.board]
    case 'ADD_LIST':
      return state.map(el => el.id == action.list.id ? {
        ...el,
        lists: [...el.lists, {
          id: action.list.listId,
          title: action.list.title,
          todos: []
        }]
      } : el)
    case 'ADD_TODO':
      return state.map(el => el.id == action.todo.id ? {
        ...el,
        lists: el.lists.map(list => list.id == action.todo.listId ? {
          ...list,
          todos: [...list.todos, {
            id: action.todo.todoId,
            todo: action.todo.name,
            active: false,
          }]
        } : list)
      } : el)
    case 'SWAP_ACTIVE':
      return state.map(el => el.id == action.todo.id ? {
        ...el,
        lists: el.lists.map(list => list.id == action.todo.listId ? {
          ...list,
          todos: list.todos.map(todo => todo.id == action.todo.todoId ? {
            ...todo,
            active: action.todo.active,
          } : todo)
        } : list)
      } : el)
    case 'TRANSFER_TODO':
      state.map(board => {
        if (board.id === action.boardId) {
          board.lists.map(list => {
            if (list.id === action.dragToId) {
              list.todos.splice(action.indexTo, 0, action.payload)
            }
            if (list.id === action.dragFromId) {
              list.todos.splice(action.indexFrom, 1)
            }
          })
        }
      })
      return state
    case 'REORDER_LIST':
      return state.map(el => el.id == action.boardId ? {
        ...el,
        lists: el.lists.map(list => list.id == action.listId ? {
          ...list,
          todos: action.list
        } : list)
      } : el)
    case 'DELETE_TODO':
      return state.map(board => board.id === action.boardId ? {
        ...board,
        lists: board.lists.map(list => list.id == action.listId ? {
          ...list,
          todos: list.todos.filter(todo => todo.id !== action.todoId)
        } : list)
      } : board)
    case 'DELETE_BOARD': {
      return state.filter(board => board.id !== action.boardId)
    }
    default:
      return state
  }
}