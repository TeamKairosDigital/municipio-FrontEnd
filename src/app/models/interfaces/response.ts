export interface Response<T> {
    statuscode: number;
    message: string;
    susccess: boolean;
    data: T;
}