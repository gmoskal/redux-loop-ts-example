interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any
}
interface TypedAction<A = string> {
    type: A
}
interface TypePayloadAction<A, P> extends TypedAction<A> {
    payload: P
}

interface Dispatch<S> {
    <A extends TypedAction<string>>(action: A): A
}

type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S, extraArgument: E) => R

interface ThunkActionCreators<S> {
    [key: string]: ThunkActionCreator<S>
}

type ThunkActionCreator<S> = (...args: any[]) => ThunkAction<void, S, {}>

type Reducer<T, A extends TypedAction = TypedAction> = (state: T, action: A) => T
type ReducerOf<T> = Casted<T, Reducer<any>>
type Casted<T, S> = { [P in keyof T]: S }

type TMap<TKey extends string, TValue> = { [K in TKey]: TValue }
type SMap<TValue> = TMap<string, TValue>
