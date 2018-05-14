import { loop, Cmd, LoopReducer } from "redux-loop"
import { createAction } from "../utils"
import * as api from "../api"

const reset = "reset"
const increment = "increment"
const load = "load"
const save = "save"

export const actions = {
    [reset]: () => createAction(reset),
    [increment]: () => createAction(increment),
    [load]: () => createAction(load),
    [save]: () => createAction(save)
}

export type State = {
    counter: number
    isSaving?: boolean
    isLoading?: boolean
    error: Error | null
}

export const initialState = { counter: 0, error: null }

const loadSuccess = "loadSuccess"
const loadError = "loadError"
const saveSuccess = "saveSuccess"
const saveError = "saveError"

export const internalActions = {
    [loadSuccess]: (value: number) => createAction(loadSuccess, value),
    [loadError]: (error: Error) => createAction(loadError, error),

    [saveSuccess]: () => createAction(saveSuccess),
    [saveError]: (error: Error) => createAction(saveError, error)
}

const allActions = { ...internalActions, ...actions }
type AllActions = ReturnType<typeof allActions[keyof typeof allActions]>

const loadCmd = Cmd.run(api.load, {
    successActionCreator: allActions.loadSuccess,
    failActionCreator: allActions.loadError
})

const saveCmd = (value: number) =>
    Cmd.run(api.save, {
        successActionCreator: allActions.saveSuccess,
        failActionCreator: allActions.saveError,
        args: [value]
    })

export const reducer: LoopReducer<State, AllActions> = (state = initialState, action: AllActions) => {
    switch (action.type) {
        case increment:
            return { ...state, counter: state.counter + 1 }
        case reset:
            return { ...state, counter: 0 }
        case load:
            return loop({ ...state, isLoading: true }, loadCmd)
        case loadSuccess:
            return { ...state, isLoading: false, counter: action.payload, error: null }
        case loadError:
            return { ...state, error: action.payload, isLoading: false }
        case save:
            return loop({ ...state, isSaving: true }, saveCmd(state.counter))
        case saveSuccess:
            return { ...state, isSaving: false, error: null }
        case saveError:
            return { ...state, error: action.payload, isSaving: false }
        default:
            return state
    }
}
