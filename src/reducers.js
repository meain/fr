export const updateThreads = threads => {
    return {
        type: 'FIREBASE_THREAD_CHANGE',
        payload: threads,
    }
}

export const userChanged = user => {
    return {
        type: 'USER_CHANGED',
        payload: user,
    }
}
