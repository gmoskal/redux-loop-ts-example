import * as React from "react"
import { connect, Dispatch } from "react-redux"
import { bindActionCreators } from "redux"
import { State, actions, Actions } from "../reducers/"

interface DispatchProps {
    load: () => Actions
    save: (value: number) => Actions
    increment: () => Actions
}

type Props = State & DispatchProps

export const Counter: React.SFC<Props> = ({ counter, increment, save, load, isSaving, isLoading, error }) => (
    <div>
        <h1>{isLoading ? "..." : counter}</h1>
        <button disabled={isLoading} onClick={load}>
            {isLoading ? "loading..." : "load"}
        </button>
        <button onClick={increment}>increment</button>
        <button disabled={isSaving} onClick={() => save(counter)}>
            {isSaving ? "saving..." : "save"}
        </button>
        <h1 className="error">{error ? error.message : null}</h1>
    </div>
)

const mapStateToProps = (state: State): State => state
const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps =>
    bindActionCreators({ load: actions.load, save: actions.save, increment: actions.increment }, dispatch)

export const CounterContainer = connect<State, DispatchProps>(mapStateToProps, mapDispatchToProps)(Counter)
