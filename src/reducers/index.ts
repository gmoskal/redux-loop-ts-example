import { LoopReducer, Cmd, loop } from "redux-loop"
import { api } from "../api"

export function createAction<A extends string>(type: A): TypedAction<A>
export function createAction<A extends string, P>(type: A, payload: P): TypePayloadAction<A, P>
export function createAction(type: any, payload?: any) {
    return payload !== undefined ? { type, payload } : { type }
}

const reset = "reset"
const increment = "increment"
const load = "load"
const loadSuccess = "loadSuccess"
const loadError = "loadError"
const save = "save"
const saveSuccess = "saveSuccess"
const saveError = "saveError"

export const actions = {
    [reset]: () => createAction(reset),
    [increment]: () => createAction(increment),

    [load]: () => createAction(load),
    [loadSuccess]: (value: number) => createAction(loadSuccess, value),
    [loadError]: (error: Error) => createAction(loadError, error),

    [save]: (value: number) => createAction(save, value),
    [saveSuccess]: () => createAction(saveSuccess),
    [saveError]: (error: Error) => createAction(saveError, error)
}

export type Actions = ReturnType<typeof actions[keyof typeof actions]>

export type State = {
    counter: number
    isSaving?: boolean
    isLoading?: boolean
    error: Error | null
}

export const initialState: State = {
    counter: 0,
    error: null
}

export const run = (f: Function, success: keyof typeof actions, fail: keyof typeof actions, args?: any[]) =>
    Cmd.run<Actions>(f, {
        successActionCreator: actions[success],
        failActionCreator: actions[fail],
        args
    })

const loadCmd = run(api.load, loadSuccess, loadError)
const saveCmd = (value: number) => run(api.save, saveSuccess, saveError, [value])

export const reducer: LoopReducer<State, Actions> = (state = initialState, action: Actions) => {
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
            return loop({ ...state, isSaving: true }, saveCmd(action.payload))
        case saveSuccess:
            return { ...state, isSaving: false, error: null }
        case saveError:
            return { ...state, error: action.payload, isSaving: false }
        default:
            return state
    }
}
