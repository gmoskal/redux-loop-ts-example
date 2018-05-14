const flakify = <T>(cb: () => T) =>
    new Promise<T>((resolve, reject) =>
        setTimeout(() => {
            try {
                if (Math.random() < 0.25) throw new Error("Failed arbitrarily")
                resolve(cb())
            } catch (err) {
                reject(err)
            }
        }, 200 + Math.random() * 2000)
    )

const KEY = "__counter"

const saveSync = (counter: number) => localStorage.setItem(KEY, counter.toString())
export const save = (counter: number) => flakify(() => saveSync(counter))

const loadSync = () => parseInt(localStorage.getItem(KEY) || "0", 10) || 0
export const load = () => flakify(loadSync)
