export enum ROLE {
    ADMIN = 'ADMIN', 
    NORMAL = 'NORMAL'
}

export type SignupInputDTO = {
    name: string,
    email: string,
    password: string,
    role: ROLE
}