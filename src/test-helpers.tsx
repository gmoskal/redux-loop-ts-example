import * as React from "react"
import * as shallowRenderer from "react-test-renderer/shallow"
import { State, initialState, reducer } from "./reducers/index"
import { Provider } from "react-redux"
import * as deepRenderer from "react-test-renderer"
import { createStore, compose } from "redux"
import { install, StoreCreator } from "redux-loop"

const enhancedCreateStore = createStore as StoreCreator

const enhancer = compose(install())
const store = enhancedCreateStore(reducer, initialState, enhancer)

export const renderComponentShallow = (component: React.ReactElement<any>) =>
    shallowRenderer.createRenderer().render(component)

export const renderComponent = (component: React.ReactElement<any>, _state: State = initialState) =>
    deepRenderer.create(<Provider store={store}>{component}</Provider>)
