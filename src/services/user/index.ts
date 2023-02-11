import { get } from '@/common/utils/request';
import { IGetUserInfoReq, IGetUserInfoRes } from './types';

/**
 * 获取用户信息
 */
export function getUserInfo(req: IGetUserInfoReq): Promise<IGetUserInfoRes> {
  return get('/user/info', req);
}
