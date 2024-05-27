import axios from 'axios';
import { message } from 'ant-design-vue';
import qs from 'qs';

let service = axios.create({
  baseURL: 'report',
  timeout: 5000 // 请求超时时间
});

//请求
service.interceptors.request.use(config => {
  if (config.method == 'post') {
    config.data = qs.stringify(config.data);
    // console.log('config.data',config.data);
  }
  return config;
});

//响应
service.interceptors.response.use(response => {
  const data = response;
  if (data.status === 200) {
    return Promise.resolve(response.data);
  } else {
    message.error(response.data.message || '');
    return Promise.reject(response); 
  }
});

let request = {};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

request.get = function(url, params = null) {
  return new Promise((resolve, reject) => {
    // console.log(url);
    service
      .get(url, { params })
      .then(res => {
        console.log('request1',res);
        if (res.code != 200) {
          reject('接口请求错误');
          message.error(res.message || '接口请求错误');
        } else {
          resolve(res);
        }
      })
      .catch(e => {
        reject('request1 reject',e);
      });
  });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

request.post = function(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then(res => {
        if (res.code != 200) {
          reject('接口请求错误');
          message.error(res.message || '接口请求错误');
        } else {
          resolve(res);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

request.put = function(url, params) {
  return new Promise((resolve, reject) => {
    service
      .put(url, params)
      .then(res => {
        if (res.code != 200) {
          reject('接口请求错误');
          message.error(res.message || '接口请求错误');
        } else {
          resolve(res);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

request.delete = function(url, params) {
  return new Promise((resolve, reject) => {
    service
      .delete(url, {params})
      .then(res => {
        if (res.code != 200) {
          reject('接口请求错误');
          message.error(res.message || '接口请求错误');
        } else {
          resolve(res);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
};

export { service, request };
