// 统一的接口返回格式
export interface IResponse<T> {
  data: T;
  success: boolean;
  errorMsg?: string;
  errorCode: string;
}
