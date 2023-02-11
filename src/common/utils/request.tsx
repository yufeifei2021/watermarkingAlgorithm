import { IResponse } from '@/types';
import { notification } from '@aloudata/aloudata-design';
import axios, { AxiosResponse, Method } from 'axios';
import _ from 'lodash';
import qs from 'query-string';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const workspaceInfo = {
  // TODO: 将workspaceId放入header参数中发给服务端
  'Workspace-Id': '',
  // 'Workspace-Id': ''
};

const baseUrl = process.env.baseUrl || '';

const queryObj: { [key: string]: number } = {};

let showTimeoutModal = false; // 是否弹出登录超时的弹框

function ajax<T>(url: string, opt: IRequestOpt): Promise<T> {
  return new Promise((resolve, reject) => {
    const { method = 'GET', headers, silent = false } = opt;
    // 处理文件上传的header
    let newHeader;
    if (method.toUpperCase() === 'GET') {
      newHeader = workspaceInfo;
    } else if (headers) {
      newHeader = { ...headers, ...workspaceInfo };
    } else {
      newHeader = { ...defaultHeaders, ...workspaceInfo };
    }
    axios({
      url: `${baseUrl}${url}`,
      headers: newHeader,
      method: opt.method,
      // data: removeUndefinedDeeplyForObject(opt.data || {}),
      data: opt.data || {},
    }).then(
      (res: AxiosResponse<IResponse<T>>) => {
        const { data: resBody } = res;
        const { success, errorMsg, data, errorCode } = resBody;

        const SESSION_TIME_OUT = 'CIP01001'; // 登录超时的错误码

        // 处理登录超时
        if (errorCode === SESSION_TIME_OUT) {
          if (!showTimeoutModal) {
            showTimeoutModal = true;
            // TODO: 弹出登录超时的弹框
          }
          return;
        }

        if (!success) {
          if (!silent) {
            // 静默错误模式下，不显示错误信息
            notification.error({
              message: '请求失败',
              description: errorMsg || '系统错误',
              style: {
                maxHeight: 500,
                overflow: 'auto',
              },
            });
            console.error(res);
          }
          reject(resBody);
          return;
        }
        resolve(data);
      },
      (err) => {
        if (!silent) {
          notification.error({
            message: '请求异常',
          });
        }
        reject(err);
      },
    );
  });
}

export function post<T>(
  url: string,
  data: TReqData = {},
  opt: Partial<IRequestOpt> = {},
): Promise<T> {
  return ajax(url, {
    ...opt,
    data,
    method: 'POST',
  });
}

export function put<T>(
  url: string,
  data: TReqData = {},
  opt: Partial<IRequestOpt> = {},
): Promise<T> {
  return ajax(url, {
    ...opt,
    data,
    method: 'PUT',
  });
}

export function ajaxDelete<T>(
  url: string,
  data: TReqData = {},
  opt: Partial<IRequestOpt> = {},
): Promise<T> {
  return ajax(url, {
    ...opt,
    data,
    method: 'DELETE',
  });
}

export function get<T>(
  url: string,
  data: TReqData = {},
  opt: Partial<IRequestOpt> = {},
): Promise<T> {
  let finalUrl = url;
  if (url.includes('?')) {
    throw new Error('参数请在data中传入');
  }
  const { type, queryKey } = opt;
  // 对于所有的代码添加workspaceId
  const newData = data || {};

  if (newData && _.size(newData)) {
    const reqData = parseReqData(newData);
    finalUrl = `${url}?${qs.stringify(reqData)}`;
  }

  if (!type) {
    return ajax(finalUrl, { ...opt, method: 'GET' });
  }

  if (!queryKey) {
    throw new Error(`请求${url}获取latest数据时，未传入queryKey`);
  }

  const currentQueryId = new Date().getTime();
  queryObj[queryKey] = currentQueryId;
  return new Promise((resolve, reject) => {
    ajax(finalUrl, { ...opt, method: 'GET' })
      .then((resultData) => {
        if (currentQueryId !== queryObj[queryKey]) {
          return;
        }
        resolve(resultData as T);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

type TReqData = object;

export interface IRequestOpt {
  method: Method;
  data?: object;
  headers?: { [key: string]: string };
  type?: TRequestTypes;
  queryKey?: string;
  silent?: boolean; // 接受到错误信息后不展示
}

type TRequestTypes = 'latest';

/**
 * 为符合前后端请求结构需要，将请求数据中驼峰写法的key转成下划线分隔的key
 * examples:
 * { datasetGuid: 'xxxx' } -> { 'dataset_guid': 'xxxx' }
 */
export function parseReqData(reqData: object): object {
  const res: { [key: string]: unknown } = {};
  const reqDataWithoutUndefined = removeUndefinedDeeplyForObject(reqData);
  _.forIn(reqDataWithoutUndefined, (val, key) => {
    const newKey = key.replace(/[A-Z]/g, (char) => {
      return `_${char.toLocaleLowerCase()}`;
    });
    res[newKey] = val;
  });
  return res;
}

/**
 * 去除值为undefined的key，深度遍历
 * @param data object数据
 * @returns object数据
 */
export function removeUndefinedDeeplyForObject(data: object): object {
  const res: { [key: string]: unknown } = {};
  _.forIn(data, (val, key) => {
    if (val === undefined) {
      return;
    }
    if (typeof val === 'object' && val !== null) {
      res[key] = removeUndefinedDeeplyForObject(val);
    } else {
      res[key] = val;
    }
  });
  return res;
}
