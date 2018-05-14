import * as React from "react"
import { connect, Dispatch } from "react-redux"
import { bindActionCreators } from "redux"
import { State, actions } from "../reducers/"

type Props = State & typeof actions

export const Counter: React.SFC<Props> = ({ counter, increment, save, load, reset, isSaving, isLoading, error }) => (
    <div>
        <h1>{isLoading ? "..." : counter}</h1>
        <button disabled={isLoading} onClick={load}>
            {isLoading ? "loading..." : "load"}
        </button>
        <button onClick={increment}>increment</button>
        <button disabled={isSaving} onClick={save}>
            {isSaving ? "saving..." : "save"}
        </button>
        <br />
        <button onClick={reset}>reset</button>
        <h1 className="error">{error ? error.message : null}</h1>
    </div>
)

const mapStateToProps = (state: State): State => state
const mapDispatchToProps = (dispatch: Dispatch<State>): typeof actions => bindActionCreators(actions, dispatch)

export const CounterContainer = connect<State, typeof actions>(mapStateToProps, mapDispatchToProps)(Counter)
