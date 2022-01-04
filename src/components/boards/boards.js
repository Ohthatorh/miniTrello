import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { mapDispatchToProps, mapStateToProps } from '../../cfg/maps'
import styles from './boards.css'

class Boards extends React.Component {
  newBoard() {
    if (document.querySelector(`.${styles.modal}`)) return
    const modalHtml = `
            <div class=${styles.modalOverlay}></div>
            <div class=${styles.modal}>
                <form class=${styles.modalAddForm}>
                    <p class=${styles.modalAddFormText}>
                        Наименование доски
                    </p>
                    <input class=${styles.modalAddFormInput} type="text" placeholder='Моя доска'/>
                    <button type="button" class=${styles.modalAddFormCancelButton}>
                        Отмена
                    </button>
                    <button type="button" class=${styles.modalAddFormSaveButton}>
                        Сохранить   
                    </button>
                </form>
            </div>
        `
    document.body.insertAdjacentHTML('beforeend', modalHtml)
    const cancelButton = document.querySelector(`.${styles.modalAddFormCancelButton}`)
    const saveButton = document.querySelector(`.${styles.modalAddFormSaveButton}`)
    const form = document.querySelector(`.${styles.modalAddForm}`)
    const modal = document.querySelector(`.${styles.modal}`)
    const modalOverlay = document.querySelector(`.${styles.modalOverlay}`)
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault()
      modal.remove()
      modalOverlay.remove()
    })
    saveButton.addEventListener('click', (e) => {
      e.preventDefault()
      const titleInput = document.querySelector(`.${styles.modalAddFormInput}`)
      if (titleInput.value.length) {
        this.props.createBoard(titleInput.value)
        modal.remove()
        modalOverlay.remove()
      } else {
        titleInput.style.outline = '1px solid red'
      }
    })
    form.addEventListener('submit', (e) => {
      e.preventDefault()
    })
  }
  componentDidMount() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape' && document.querySelector(`.${styles.modalAddForm}`)) {
        document.querySelector(`.${styles.modalAddFormCancelButton}`).click()
      }
      if (e.key === 'Enter' && document.querySelector(`.${styles.modalAddForm}`)) {
        document.querySelector(`.${styles.modalAddFormSaveButton}`).click()
      }
    })
  }
  render() {
    return (
      <section className={styles.boardsWrap}>
        <div className={styles.boardsWrapAddWrap}>
          <button className={styles.boardsWrapAddWrapButton} onClick={() => this.newBoard()}>
            Новая доска
          </button>
        </div>
        <div className={styles.boardsWrapList}>
          {(this.props.boards) ? this.props.boards.map(board => {
            return (
              <Link className={styles.boardsWrapListLink} key={board.id} id={board.id} to={{
                pathname: `/my_board/${board.id}`,
                search: `?id=${board.id}`,
              }}>
                <p>
                  {board.title}
                </p>
              </Link>
            )
          }) : undefined}
        </div>
      </section>
    )
  }
}

Boards = connect(
  mapStateToProps,
  mapDispatchToProps
)(Boards)

export default Boards