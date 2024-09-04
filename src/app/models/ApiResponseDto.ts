export class ApiResponse<T> {
    success: boolean | any;
    statusCode: number | any;
    message: string | any;
    data?: T;
    errors?: any;
}