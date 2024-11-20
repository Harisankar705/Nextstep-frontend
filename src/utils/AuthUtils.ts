export const isTokenExpired = (token: string): boolean => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
};

export const removeAccessToken = (): void => {
    localStorage.removeItem('accessToken');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem('refreshToken', token);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem('refreshToken');
};
