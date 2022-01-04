import React from 'react'
import ReactDOM from 'react-dom'
import {
  Route,
  BrowserRouter,
  Navigate,
  Routes,
} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { connect, Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { trelloApp } from './reducers/reducers'
import Boards from './components/boards/boards'
import MyBoard from './components/my-board/myBoard'
import { mapStateToProps, mapDispatchToProps } from './cfg/maps'
import './main.global.css'

const store = createStore(trelloApp, composeWithDevTools(applyMiddleware(thunk)))

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      history: createBrowserHistory(),
    }
  }
  render() {
    const { history } = this.state
    return (
      <Routes>
        <Route path='/boards' element={<Boards history={history} />} />
        <Route path='/my_board/:id' element={<MyBoard history={history} />} />
        <Route path='*' element={<Navigate to='/boards' history={history} />} />
      </Routes>
    )
  }
}

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.querySelector('.app')
)