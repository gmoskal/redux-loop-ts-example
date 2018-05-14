import { Cmd, loop, Loop } from "redux-loop"
import * as api from "../api"
import { reducer, State, actions, internalActions } from "./index"

describe("counter state", () => {
    describe("actions", () => {
        it("should create reset action", () => expect(actions.reset()).toEqual({ type: "reset" }))
        it("should create increment action", () => expect(actions.increment()).toEqual({ type: "increment" }))
        it("should create load action", () => expect(actions.load()).toEqual({ type: "load" }))
        it("should create save action", () => expect(actions.save()).toEqual({ type: "save" }))
    })

    describe("internal actions", () => {
        it("should create loadError action", () => {
            const expectedAction = {
                type: "loadError",
                payload: new Error("some error")
            }
            expect(internalActions.loadError(new Error("some error"))).toEqual(expectedAction)
        })

        it("should create loadSuccess action", () => {
            const expectedAction = {
                type: "loadSuccess",
                payload: 3
            }
            expect(internalActions.loadSuccess(3)).toEqual(expectedAction)
        })

        it("should create saveError action", () => {
            const expectedAction = {
                type: "saveError",
                payload: new Error("some Error")
            }
            expect(internalActions.saveError(new Error("some Error"))).toEqual(expectedAction)
        })

        it("should create saveSuccess action", () =>
            expect(internalActions.saveSuccess()).toEqual({ type: "saveSuccess" }))
    })

    describe("reducer", () => {
        const initialState: State = { counter: 0, error: null }

        it("gives initial state when `no state` and `uknown action` are given", () =>
            expect(reducer(undefined, { type: "fake" })).toEqual(initialState))

        it("gives same state when `uknown action` is given", () =>
            expect(reducer({ counter: 2, error: null }, { type: "fake" })).toEqual({ counter: 2, error: null }))

        it("gives state with counter incremented by 1 when `increment action` is given", () => {
            const current = reducer(undefined, actions.increment())
            expect(current).toEqual({ ...initialState, counter: 1 })
        })

        it("gives initial state when `reset action` is given", () => {
            const current = reducer({ ...initialState, counter: 5 }, actions.reset())
            expect(current).toEqual({ ...initialState, counter: 0 })
        })

        it("gives valid state and commands when `l`oad action` is given", () => {
            const cmdRun = Cmd.run(api.load, {
                successActionCreator: internalActions.loadSuccess,
                failActionCreator: internalActions.loadError
            })
            const [expectedState, expectedCommands] = loop({ ...initialState, isLoading: true }, cmdRun)
            const [currentState, currentCommands] = reducer(initialState, actions.load()) as Loop<State, any>
            expect(currentState).toEqual(expectedState)
            expect(currentCommands).toEqual(expectedCommands)
        })

        it("gives valid state and commands when `save action` is given", () => {
            const state = { ...initialState, counter: 5 }
            const cmdRun = Cmd.run(api.save, {
                successActionCreator: internalActions.saveSuccess,
                failActionCreator: internalActions.saveError,
                args: [5]
            })
            const [expectedState, expectedCommands] = loop({ ...state, isSaving: true }, cmdRun)
            const [currentState, currentCommands] = reducer(state, actions.save()) as Loop<State, any>
            expect(currentState).toEqual(expectedState)
            expect(currentCommands).toEqual(expectedCommands)
        })
    })
})
