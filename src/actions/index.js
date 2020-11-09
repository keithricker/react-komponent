export const increment = () => {
    return {
        type: 'INCREMENT'
    }
}
export const decrement = () => {
    return {
        type: 'DECREMENT'
    }
}
export const add = (knew) => {
    return {
        type: 'ADD',
        payload: knew
    }
}