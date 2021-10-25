# BP Git Template

> BP 团队前端项目模板仓库 [使用文档](https://km.sankuai.com/page/951085878)

## 仓库获取

> 推荐使用 [datafe-project-creator](https://km.sankuai.com/page/950895054) [仓库地址](http://dev.sankuai.com/code/repo-detail/~yuanpengfei03/datafe-project-creator/file/list)

```shell
npm i -g datafe-project-creator
```

> 然后进入某个父级目录下，执行 datafe-project-creator 命令，根据提示填写项目信息即可

## 项目配置

### 安装依赖

```
npm install
```

### 开发环境执行编译和热加载命令

```
npm run start
```

### 正式环境编译打包命令

```
npm run build
```

### 开启 ones-link 提交检查

> 在 commitlint.config.js 内，配置了 ones-link 的插件规则，用来检查每次代码提交的 message 是否符合标准，可根据实际情况修改配置【0：off,1:warn,2:error】; 默认是 0：off

```json
'ones-link': [0, 'always'],

// ------------------------------>

{
    "plugins": [
        {
            "rules": {
                "ones-link": ({ subject }) => {
                    return [
                        /^(ones:)((http|https)(:\/\/)(ones\.sankuai\.com\/).).*/g.test(subject),
                        `请在提交标题上关联Ones链接 (格式：ones:{link}+空格+标题)`
                    ];
                }
            }
        }
    ]
}
```

### 开发完后提交代码

> 此模板项目内集成了 husky + lint-staged + commitlint + git-cz 等和代码提交相关的检查和校验流程，为了确保代码提交流程的一致性，推荐使用下面的命令。

```
// git add --all && git-cz
npm run commit:all

// git-cz
npm run commit
```

### 代码查重

> 项目内集成了 [jscpd](https://github.com/kucherenko/jscpd),可以帮助开发者在本地实现代码的查重，并以多种报告的形式视觉化呈现给开发者

```
// 执行以下命令即可查重
npm run jscpd
```

### 执行测试

```
npm run test
```

### 执行 lint 和修复

```
npm run lint
```

### 代码重复率检测

```
// .tmp目录下生成检测详情（本地打开report/html/index.html)
npm run jscpd
```

![image](https://s3plus.meituan.net/v1/mss_0a7f4c7b6e8342d9985d10a078f28f6f/static/DX-20210712%402x.png)
![image](https://s3plus.meituan.net/v1/mss_0a7f4c7b6e8342d9985d10a078f28f6f/static/DX-202107121%402x.png)

### 项目 coding 分析（注释、空白行、代码）

```
// 按文件编码行数汇总
npm run coding:byfile
```

![image](https://s3plus.meituan.net/v1/mss_0a7f4c7b6e8342d9985d10a078f28f6f/static/DX-202107123%402x.png)

```
// 自定义需求执行SQL（默认执行.tmp/query_with_totals.sql 查找编码行数大于40的）分析
npm run coding:quire
```

![image](https://s3plus.meituan.net/v1/mss_0a7f4c7b6e8342d9985d10a078f28f6f/static/DX-202107124%402x.png)

### 运行单元测试

```
npm run test:unit
```

### 第三方库配置

> 移步[文档](https://km.sankuai.com/page/969782258)

### 自定义配置

See [Configuration Reference](https://cli.vuejs.org/config/).
