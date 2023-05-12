import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
interface AxiosCacheRequestConfig extends AxiosRequestConfig {
    cache?: boolean;
    handleFunc?: (config: unknown) => unknown;
}
type TErrorInfo = {
    url: string;
    traceid?: string;
    message: string;
    [k: string]: string | undefined;
};
type UserInfoVo = {
    uid: string;
    name: string;
    age?: number;
}
type UserInfoParams = {
    uid: number;
}
type ResultVO = {
    data: null | UserInfoVo;
    error: null | {
        message: string;
    };
};
const cacheMap: Map<string, AxiosResponse> = new Map();
const getAxiosConfig = (opts: AxiosCacheRequestConfig) => {
    return Object.assign(
        opts,
        {
            baseURL: 'http://localhost:3000/mocks',
            timeout: 20000,
            headers: {
                ['Cache-Control']: 'no-cache',
                ['Content-Type']: 'application/json',
                ['x-requested-with']: 'XMLHttpRequest',
            },
            validateStatus() {
                return true;
            }, responseType: 'json',
        }
    );
};
const axiosInstance = (() => {
    const addError = (params: TErrorInfo) => {
        console.warn({
            name: 'axios',
            msg: params.message,
        },
            {
                level: 'warn',
                category: 'axiosError',
            });
    };
    const instance = axios.create(
        getAxiosConfig(
            {
                adapter: (config) => {
                    const { url, method, cache, params, handleFunc } = config as AxiosCacheRequestConfig;
                    const key = `${method}${url}${params.uid}`;
                    if (cache && cacheMap.has(key)) {
                        return new Promise((resolve) => {
                            // 调用响应函数
                            resolve(
                                cacheMap.get(key)
                            );
                        });
                    }
                    return axios(
                        getAxiosConfig(
                            {
                                cache,
                                handleFunc,
                                url: config.url,
                                params: config.params,
                                method: config.method,
                            }
                        )
                    );
                },
            }
        )
    );
    // 错误信息收集上报拦截器
    instance.interceptors.response.use(
        (res: AxiosResponse) => {
            const { url, method, params, cache, handleFunc } = res.config as AxiosCacheRequestConfig;
            const key = `${method}${url}${params.uid}`;
            if (!cacheMap.has(key) && handleFunc) {
                res.data.data = handleFunc(res.data.data);
            }
            if (cache) {
                cacheMap.set(key, res);
            }
            return res;
        },
        error => {
            addError({
                url: error.config?.url,
                message: error.message,
                method: error.config?.method,
                error: JSON.stringify(error),
            });
            return Promise.reject(error);
        },
    );
    return instance;
})();
const getMockData = (params: UserInfoParams, config?: AxiosRequestConfig) => {
    const url = `data.json`;
    return axiosInstance
        .get(url, {
            params: {
                uid: params.uid
            }, ...config
        })
        .then((res: AxiosResponse<ResultVO>) => res.data);
};
class Test01 {
    test(a: number, b: number) {
        return a > b;
    }
    async add(a: number, b: number) {
        const { data, error } = await getMockData({ uid: 245 }, {
            cache: true,
            handleFunc: (data: UserInfoVo) => {
                return {
                    ...data,
                    age: 35
                };
            }
        } as AxiosRequestConfig);
        if (error === null) {
            console.log(data, this.test(a, b));
        }
        return a + b;
    }
}
class Test02 {
    test(a: number, b: number) {
        return a > b;
    }
    async add(a: number, b: number) {
        const { data, error } = await getMockData({ uid: 145 }, {
            cache: true,
            handleFunc: (data: UserInfoVo) => {
                data.age = 60;
                return data;
            }
        } as AxiosRequestConfig);
        if (error === null) {
            console.log(data, this.test(a, b));
        }
        return a + b;
    }
}
class Test03 {
    test(a: number, b: number) {
        return a > b;
    }
    async add(a: number, b: number) {
        const { data, error } = await getMockData({ uid: 175 });
        if (error === null) {
            console.log(data, this.test(a, b));
        }
        return a + b;
    }
}
new Test01().add(2, 5);
new Test02().add(2, 5);
new Test03().add(2, 5);
setTimeout(() => {
    const test01 = new Test01();
    const test02 = new Test02();
    const test03 = new Test03();
    [1, 2, 3, 4, 5, 6].forEach((vo, index) => {
        test01.add(vo, index);
        test02.add(vo, index);
        test03.add(vo, index);
    });
    console.log(cacheMap);
}, 3000);

