export const AUTH_EVENT = 'auth-changed'

export const hasAuthToken = (): boolean => Boolean(localStorage.getItem('auth_token'))

export const setAuthToken = (token: string): void => {
	localStorage.setItem('auth_token', token)
	window.dispatchEvent(new Event(AUTH_EVENT))
}

export const clearAuthToken = (): void => {
	localStorage.removeItem('auth_token')
	window.dispatchEvent(new Event(AUTH_EVENT))
}


