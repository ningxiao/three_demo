const cacheAsync = (promiseApi, symbol) => {
    const cache = new Map();
    return async (params) => {
        return new Promise((resolve, reject) => {
            const key = symbol || params;
            const config = cache.get(key) || {
                res: null,
                exector: [{ resolve, reject }]
            };
            const { exector } = config;
            if (cache.has(key)) {
                if (config.res) { // 命中缓存
                    return resolve(config.res);
                }
                exector.push({ resolve, reject });
            } else {
                cache.set(key, config);
            }
            if (exector.length === 1) { // 处理并发 拿第一个请求
                const next = async () => {
                    try {
                        if (!exector.length) return;
                        const res = await promiseApi(params);
                        while (exector.length) {  // 如果成功了，那么直接resolve掉剩余同样的请求
                            exector.shift().resolve(res);
                        }
                        config.res = res;
                    } catch (error) { // 如果失败了 那么这个promise的则为reject
                        console.log('请求失败');
                        exector.shift().reject(error);
                        next();
                    }
                };
                next();
            }
        });
    };
};
const fetchTest = cacheAsync(async (...ages) => {
    const httpApi = await fetch(`http://127.0.0.1:3000/test?uid=${ages[0]}`);
    const data = await httpApi.json();
    console.log(data);
    return data;
}, "uid2");
for (let i = 0; i < 10; i++) {
    fetchTest(2).then((res) => {
        console.log('请求成功', res);
    }).catch(() => {
        console.log('请求失败');
    });
}
window['fetchTest'] = fetchTest;
