import { createStore, compose } from "redux"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { install, StoreCreator } from "redux-loop"
import { initialState, reducer } from "./reducers"

import { CounterContainer } from "./components/counter"

import "./index.css"

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__({ serialize: { options: true } })
    : null
const enhancer = reduxDevTools ? compose(install(), reduxDevTools) : compose(install())
const store = (createStore as StoreCreator)(reducer, initialState, enhancer)

ReactDOM.render(
    <Provider store={store}>
        <CounterContainer />
    </Provider>,
    document.getElementById("app")
)
