import { jwtDecode} from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
    try
    {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;   
    }
    catch(error)
    {
        console.error("error decoding token",error)
        return true
    }
   
};

export const getAccessToken = (): string => {
    const token=localStorage.getItem('accessToken');
    if(!token)
    {
        throw new Error('token not found')
    }

    const decodedToken:{userId:string}=jwtDecode(token)
        return decodedToken.userId
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

