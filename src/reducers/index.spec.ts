import { Cmd, loop, Loop } from "redux-loop"
import { api } from "../api"
import { reducer, State, actions, Actions } from "./index"

describe("reducer", () => {
    const initialState: State = { counter: 0, error: null }

    it("unknown action should return the initial state", () =>
        expect(reducer(undefined, { type: "fake" })).toEqual(initialState))

    it("incrementCounter() should increment counter by 1", () => {
        const current = reducer(undefined, actions.increment())
        expect(current).toEqual({ ...initialState, counter: 1 })
    })

    it("resetCounter() should return the initial state", () => {
        const current = reducer({ ...initialState, counter: 5 }, actions.reset())
        expect(current).toEqual({ ...initialState, counter: 0 })
    })

    describe("loadCount()", () => {
        it("returns an object which deeply equals the object returned by reducer", () => {
            const cmdRun = Cmd.run<Actions>(api.load, {
                successActionCreator: actions.loadSuccess,
                failActionCreator: actions.loadError
            })
            const [expectedState, expectedCommands] = loop({ ...initialState, isLoading: true }, cmdRun)
            const [currentState, currentCommands] = reducer(initialState, actions.load()) as Loop<State, Actions>
            expect(currentState).toEqual(expectedState)
            expect(expectedCommands).toEqual(currentCommands)
        })
    })

    describe("saveCount()", () => {
        it(" returns an object which deeply equals the object returned by reducer", () => {
            const cmdRun = Cmd.run<Actions>(api.save, {
                successActionCreator: actions.saveSuccess,
                failActionCreator: actions.saveError,
                args: [5]
            })
            const [expectedState, expectedCommands] = loop({ ...initialState, isSaving: true }, cmdRun)
            const [currentState, currentCommands] = reducer(initialState, actions.save(5)) as Loop<State, Actions>
            expect(currentState).toEqual(expectedState)
            expect(expectedCommands).toEqual(currentCommands)
        })
    })

    describe("actions", () => {
        it("should create incrementCounter action", () => expect(actions.increment()).toEqual({ type: "increment" }))

        it("should create loadCount action", () => expect(actions.load()).toEqual({ type: "load" }))

        it("should create loadCountError action", () => {
            const expectedAction = {
                type: "loadError",
                payload: new Error("some error")
            }
            expect(actions.loadError(new Error("some error"))).toEqual(expectedAction)
        })

        it("should create loadCountSuccess action", () => {
            const expectedAction = {
                type: "loadSuccess",
                payload: 3
            }
            expect(actions.loadSuccess(3)).toEqual(expectedAction)
        })

        it("should create saveCount action", () => {
            const expectedAction = {
                type: "save",
                payload: 3
            }
            expect(actions.save(3)).toEqual(expectedAction)
        })

        it("should create saveCountError action", () => {
            const expectedAction = {
                type: "saveError",
                payload: new Error("some Error")
            }
            expect(actions.saveError(new Error("some Error"))).toEqual(expectedAction)
        })

        it("should create saveCountSuccess action", () => {
            const expectedAction = {
                type: "saveSuccess"
            }
            expect(actions.saveSuccess()).toEqual(expectedAction)
        })
    })
})
