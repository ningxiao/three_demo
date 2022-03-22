const koa = require("koa");
const cros = require('@koa/cors');
const app = new koa();
const sleep = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds);
    });
};
app.use(cros());
app.use(async (ctx, next) => {
    if (ctx.url.includes('/test')) {
        const query = ctx.query;
        await sleep(200);
        const sum = Math.random();
        const uid = Reflect.get(query, 'uid') || 0;
        if (sum > 0.8) {
            ctx.body = { code: 200, data: { uid, sum } };
        } else {
            ctx.status = 404;
            ctx.body = '';
        }
        next();
    }
});
app.listen(3000, "127.0.0.1", () =>
    console.log("start listening on port 127.0.0.1:3000")
);
