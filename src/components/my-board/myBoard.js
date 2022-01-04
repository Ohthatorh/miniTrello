import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../../cfg/maps'
import styles from './myBoard.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

function Item({ todo, index, list, idboard, props }) {
  function swapActive(target) {
    if (target.parentNode.classList.contains(styles.active)) {
      target.parentNode.classList.remove(styles.active)
      props.swapActive(idboard, list.id, todo.id, true)
    } else {
      target.parentNode.classList.add(styles.active)
      props.swapActive(idboard, list.id, todo.id, false)
    }
  }
  return (
    <Draggable draggableId={`${String(todo.id)}-item`} index={index}>
      {provided => (
        <li
          className={`${styles.boardWrapListItemTodosItem} 
                    ${(todo.active) ? styles.active : undefined}`}
          key={index}
          style={provided.draggableProps.style}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className={styles.boardWrapListItemTodosItemText}>
            {todo.todo}
          </p>
          <button className={styles.boardWrapListItemTodosItemBtn} onClick={(event) => swapActive(event.target)}>
            &#10004;
          </button>
        </li>
      )}
    </Draggable>
  )
}

function List({ board, list, index, props }) {
  function addTodoItem(...args) {
    const [event, idList] = args
    if (event.key === 'Enter') {
      if (event.target.value !== '') {
        props.createTodo(board.id, idList, event.target.value)
        event.target.value = ''
        event.target.style.outline = '1px solid white'
      } else {
        event.target.style.outline = '1px solid red'
      }
    }
  }
  return (
    <li className={styles.boardWrapListItem} key={index}>
      <p className={styles.boardWrapListItemTitle}>
        {list.title}
      </p>
      <div className={styles.boardWrapListItemTodos}>
        <input className={styles.boardWrapListItemInput} type='text' onKeyUp={(event) => addTodoItem(event, list.id)} />
        <Droppable droppableId={`${String(list.id)}-list`} index={index}>
          {provided => (
            <ul
              className={styles.boardWrapListItemTodosList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {
                list.todos.map((todo, index) => {
                  return (
                    <Item
                      key={todo.id}
                      todo={todo}
                      list={list}
                      index={index}
                      idboard={board.id}
                      props={props}
                    />
                  )
                })
              }
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </li>
  )
}

class MyBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idBoard: Number(window.location.search.split('=').pop()),
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result) {
    document.querySelector(`.${styles.deleteItem}`).style.visibility = 'hidden'
    if (!result.destination) {
      return
    }
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    }
    const payloadId = Number(result.draggableId.split('-')[0])
    const dragFromId = Number(result.source.droppableId.split('-')[0])
    const dragToId = Number(result.destination.droppableId.split('-')[0])
    const thisBoard = this.props.boards.filter(board => board.id === this.state.idBoard)[0]
    const thisList = thisBoard.lists.filter(list => list.id === dragFromId)[0].todos
    const payload = thisList.filter(todo => todo.id === payloadId)[0]
    if (result.destination.droppableId === 'delete-item') {
      this.props.deleteTodoItem(this.state.idBoard, dragFromId, payloadId)
      return
    }
    if (dragFromId === dragToId) {
      const thisListSorted = reorder(
        thisList,
        result.source.index,
        result.destination.index
      )
      this.props.reorderList(this.state.idBoard, dragToId, thisListSorted)
    } else {
      this.props.dragTodo(this.state.idBoard, payload, result.destination.index, result.source.index, dragFromId, dragToId)
    }
  }

  onDragStart() {
    document.querySelector(`.${styles.deleteItem}`).style.visibility = 'visible'
  }

  addList(target) {
    target.children[1].style.display = 'none'
    const formAdd = `
            <div class=${styles.boardWrapAddWrap}>
                <button class=${styles.close}>&#10006;</button>
                <input type="text" class=${styles.boardWrapAddWrapInput} placeholder='Название списка'/>
            </div>
        `
    target.insertAdjacentHTML('beforeend', formAdd)
    const inputAddEl = document.querySelector(`.${styles.boardWrapAddWrapInput}`)
    inputAddEl.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        if (inputAddEl.value.length !== 0) {
          const title = inputAddEl.value
          this.props.createList(this.state.idBoard, title)
          target.children[2].remove()
          target.children[1].style.display = 'block'
        } else {
          inputAddEl.style.outline = '1px solid red'
        }
      }
    })
    const closeButton = document.querySelector(`.${styles.close}`)
    closeButton.addEventListener('click', () => {
      closeButton.parentNode.remove()
      target.children[1].style.display = 'block'
    })
  }

  deleteBoard() {
    const modal = `
            <div class=${styles.modalOverlay}></div>
            <div class=${styles.modal}>
                <div class=${styles.modalDelete}>
                    <p class=${styles.modalDeleteText}>
                        Вы действительно хотите удалить доску?
                    </p>
                    <button type="button" class=${styles.modalDeleteCancelButton}>
                        Отмена
                    </button>
                    <button type="button" class=${styles.modalDeleteConfirmButton}>
                        Удалить
                    </button>
                </div>
            </div>
        `
    document.body.insertAdjacentHTML('beforeend', modal)
    document.querySelector(`.${styles.modalDeleteCancelButton}`).addEventListener('click', (e) => {
      e.preventDefault()
      document.querySelector(`.${styles.modal}`).remove()
      document.querySelector(`.${styles.modalOverlay}`).remove()
    })
    document.querySelector(`.${styles.modalDeleteConfirmButton}`).addEventListener('click', (e) => {
      e.preventDefault()
      document.querySelector(`.${styles.modal}`).remove()
      document.querySelector(`.${styles.modalOverlay}`).remove()
      this.props.deleteBoardItem(this.state.idBoard)
      this.props.history.back()
    })
  }

  render() {
    return (
      <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
        <section className={styles.boardWrap}>
          <div className={styles.boardWrapButtonGroup}>
            <button className={styles.boardWrapHomeButton} onClick={() => this.props.history.back()}>
              &#8592; Вернуться к списку досок
            </button>
            <button className={styles.boardWrapDeleteButton} onClick={() => this.deleteBoard()}>
              Удалить доску
            </button>
          </div>
          <p className={styles.boardWrapTitle}>
            {this.props.boards.map(board => {
              if (board.id === this.state.idBoard) return board.title
            })}
          </p>
          <div className={styles.boardWrapLists}>
            <ul className={styles.boardWrapList}>
              {
                this.props.boards.map(board => {
                  if (board.id === this.state.idBoard) return (
                    board.lists.map((list, index) => {
                      return (
                        <List
                          board={board}
                          list={list}
                          index={index}
                          props={this.props}
                          addTodoItem={this.addTodoItem}
                          key={index}
                        />
                      )
                    })
                  )
                })
              }
            </ul>
            <button className={styles.boardWrapListsAdd} onClick={(e) => this.addList(e.target.parentNode)}>
              Добавить список
            </button>
          </div>
          <Droppable droppableId={`delete-item`} index={999}>
            {provided => (
              <div
                className={styles.deleteItem}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
      </DragDropContext>
    )
  }
}

MyBoard = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyBoard)

export default MyBoard