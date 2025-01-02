const axios = require('axios');
const { getProxySettings } = require('get-proxy-settings');
const fs = require('fs-extra');

// 导入指定文件
const getUserInfo = async () => {
  try {
    const data = await fs.promises.readFile('json/authToken.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // console.error('读取文件时发生错误:', error.message);
    return {};
    // throw error;
  }
};


//=============================================axios实例化================================================
// 代理请求走的路径
const proxy = axios.create({
  baseURL: '',
  timeout: 5000
});
// 代理且需要添加上授权信息的请求走的路径
const proxyToken = axios.create({
  baseURL: '',
  timeout: 5000
});
//==================================================axios 实例化的封装========================================
/**
 * 走代理的get请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function proxyGet(url, param) {
  // 创建 axios 实例，并设置全局代理
  try {
    const response = await proxy.get(url, {
      ...param,
      //proxy: { ...(await getProxySettings())?.https }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 走代理的post请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数
 * @returns throw error 或者是 响应体中的数据
 */
async function proxyPost(url, param, config) {
  // 创建 axios 实例，并设置全局代理
  try {
    const response = await proxy.post(url,
      { ...param },
      {
        ...config,
        //proxy: { ...(await getProxySettings())?.https },
        // headers: {
        //   ...(config.headers || {})
        // }
      });
    return response;
  } catch (error) {
    throw error;
  }
}


/**
 * 走代理的put请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数
 * @returns throw error 或者是 响应体中的数据
 */
async function proxyPut(url, param, config) {
  // 创建 axios 实例，并设置全局代理
  try {
    const response = await proxy.put(url, {
      ...param,
    }, {
      //proxy: { ...(await getProxySettings())?.https },
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
/**
 * 走代理的patch请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数
 * @returns throw error 或者是 响应体中的数据
 */
async function proxyPatch(url, param, config) {
  // 创建 axios 实例，并设置全局代理
  try {
    const response = await proxy.patch(url, {
      ...param,
    }, {
      //proxy: { ...(await getProxySettings())?.https },
      ...config,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
//======================= 授权内容======================================================
/**
 * 走代理并且封装token的请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function StreamlabsProxyGet(url, param) {
  try {
    const response = await proxyToken.get(url, {
      ...param,
      //proxy: { ...(await getProxySettings())?.https },
      headers: {
        ...(param.headers),  // 将传入的 headers 合并到默认 headers 中
        "Authorization": `Bearer ${(await getUserInfo()).access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 走代理并且封装token的请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function StreamlabsProxyPost(url, param, config) {
  try {
    const response = await proxyToken.post(url, {
      ...param,
    }, {
      ...config,
      //proxy: { ...(await getProxySettings())?.https },
      headers: {
        ...(config.headers),  // 将传入的 headers 合并到默认 headers 中
        "Authorization": `Bearer ${(await getUserInfo()).access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


/**
 * 走代理并且封装token的请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function StreamlabsProxyDelete(url, param) {
  try {
    const response = await proxyToken.delete(url, {
      ...param,
      //proxy: { ...(await getProxySettings())?.https },
      headers: {
        ...(param.headers),  // 将传入的 headers 合并到默认 headers 中
        "Authorization": `Bearer ${(await getUserInfo()).access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * 走代理并且封装token的请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function StreamlabsProxyPatch(url, param, config) {
  try {
    const response = await proxyToken.patch(url, {
      ...param,
    }, {
      //proxy: { ...(await getProxySettings())?.https },
      ...config,
      headers: {
        ...(config.headers),  // 将传入的 headers 合并到默认 headers 中
        "Authorization": `Bearer ${(await getUserInfo()).access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
/**
 * 走代理并且封装token的请求
 * @param {String} url 请求全路径 
 * @param {Object} param 参数{headers:{},data:{}}
 * @returns throw error 或者是 响应体中的数据
 */
async function StreamlabsProxyPut(url, param, config) {
  try {
    const response = await proxyToken.put(url, {
      ...param,
    }, {
      //proxy: { ...(await getProxySettings())?.https },
      ...config,
      headers: {
        ...(config.headers),  // 将传入的 headers 合并到默认 headers 中
        "Authorization": `Bearer ${(await getUserInfo()).access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

//======================================对axios请求的监听 

module.exports = {
  StreamlabsProxyGet,
  proxyGet,
  proxyPut,
  proxyPost,
  proxyPatch,
  getUserInfo,
  StreamlabsProxyPost,
  StreamlabsProxyDelete,
  StreamlabsProxyPatch,
  StreamlabsProxyPut
};