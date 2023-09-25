/**
 * retrieve user data from local storage
 * @returns
 */
export function getUserFromLocalStorage() {
    const user = window.localStorage.getItem('user_info')
    return user ? JSON.parse(user) : null
}