import { IGetUserInfoRes } from '@/services/user/types';
import { atom } from 'recoil';

export const userInfoAtom = atom<IGetUserInfoRes | null>({
  key: 'indexUserInfo',
  default: null,
});
