const flakify = <T>(cb: () => T) =>
    new Promise<T>((resolve, reject) =>
        setTimeout(() => {
            try {
                if (Math.random() < 0.25) throw new Error("Failed arbitrarily")
                else resolve(cb())
            } catch (err) {
                reject(err)
            }
        }, 200 + Math.random() * 2000)
    )

const KEY = "__counter"

const saveSync = (counter: number) => localStorage.setItem(KEY, counter.toString())
const save = (counter: number) => flakify(() => saveSync(counter))

const loadSync = () => parseInt(localStorage.getItem(KEY) || "0", 10) || 0
const load = () => flakify(loadSync)

export const api = { load, save }
