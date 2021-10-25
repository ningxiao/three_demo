const dataSource = {
    quanyingying: {
        mis: 'yingying',
        name: '盈盈',
        orgNamePath: '华为-xxx-数据产品组',
        url: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile11/d99caf12-0809-4284-884c-678a8cd3318f_200_200"
    }, shidan03: {
        mis: "dandan",
        name: "丹丹",
        url: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile12/ad020cf2-39a3-4619-a61a-9c5915fc3865",
        orgNamePath: "华为-xxx-Cross项目组"
    }, wanghaoran16: {
        mis: "ranran",
        name: "然然",
        url: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile14/f3f00f5c-b309-4b82-a51d-b0dd8f354e3d", uid: "1982183649",
        orgNamePath: "华为-xxx--营销运营组"
    }, xuxin09: {
        mis: "xinxin",
        name: "欣欣",
        url: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile5/3aa38215-f017-48a2-b103-c78887d77bd7_200_200", uid: "1804737187",
        orgNamePath: "华为-xxx-运营组"
    }, ningxiao: {
        mis: "ningning",
        name: "宁宁",
        url: "https://s3plus-img.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec/profile6/c07ee6f8-6190-48cd-a705-6065be21f5ff_200_200", uid: "1277277132",
        orgNamePath: "华为-xxx-BP分析研发组"
    }
};
interface UserInfo {
    mis: string;
    name: string;
    orgNamePath: string;
    uid: string;
    url: string;
    now?: number;
}
let db: IDBDatabase;
const openRequest = window.indexedDB.open('components', 2);
const tasks: Map<string, Set<(vo: UserInfo) => void>> = new Map();
openRequest.onerror = (ev) => {
    console.log('数据库打开报错', ev);
};
openRequest.onsuccess = () => {
    db = openRequest.result;
    const request = db.transaction('user', 'readwrite').objectStore('user').openCursor();
    request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
            Avatar.getInstance().set(cursor.key as string, cursor.value);
            cursor.continue();
        }
    };
};
openRequest.onupgradeneeded = () => {
    db = openRequest.result;
    if (!db.objectStoreNames.contains('user')) { // 如果没有 “books” 数据
        db.createObjectStore("user", { keyPath: "mis" });
    }
};
class Storage {
    private tid = 0;
    private max = 10;
    private count = 0;
    private cache: Map<string, UserInfo> = new Map();
    private worktasks(mis: string) {
        tasks.set(mis, new Set());
        setTimeout(() => {
            const info = JSON.parse(JSON.stringify(dataSource[mis]));
            const items = tasks.get(mis);
            Reflect.set(info, 'now', Date.now());
            this.set(mis, info);
            for (const item of items) {
                item(info);
            }
            tasks.delete(mis);
        }, 1000);
    }
    private has(mis: string) {
        return this.cache.has(mis);
    }
    private recycle() {
        if (this.count > this.max) {
            let mis;
            let now = Date.now();
            this.cache.forEach((info, key) => {
                if (now >= info.now) {
                    mis = key;
                    now = info.now;
                }
            });
            if (mis) {
                this.count--;
                this.cache.delete(mis); // 删除缓存
            }
        }
        clearTimeout(this.tid);
        this.tid = setTimeout(this.recycle.bind(this), 2000);
    }
    public get(mis: string, callback: (vo: UserInfo) => void) {
        if (this.has(mis)) {
            callback(this.cache.get(mis));
        } else {
            if (!tasks.has(mis)) {
                this.worktasks(mis);
            }
            tasks.get(mis).add(callback);
        }
    }
    public set(mis: string, info: UserInfo) {
        this.recycle();//判断缓存是否够用
        this.cache.set(mis, info);// 写缓存
        this.count++;
        if (db) { // 写入数据库
            const userStore = db.transaction('user', 'readwrite').objectStore('user');
            const addPersonRequest = userStore.add(info);
            addPersonRequest.onsuccess = () => {// 监听添加成功事件
                console.log(addPersonRequest.result); // 打印添加成功数据的 主键（id）
            };
            addPersonRequest.onerror = () => {                // 监听失败事件
                console.log(addPersonRequest.error);
            };
        }
    }
}
class Avatar {
    private mis: string;
    private dom: HTMLElement;
    private storage: Storage;
    static instance: Storage;
    static cssText = `
        .components-avatar {
            display       : flex;
            align-items   : center;
            padding       : 2px 4px;
            height        : 24px;
            max-width     : 78px;
            font-family   : PingFangSC-Regular;
            font-size     : 14px;
            color         : rgba(0, 0, 0, 0.87);
            cursor        : pointer;
        }

        .components-avatar>img {
            width        : 20px;
            height       : 20px;
            border-radius: 50%;
        }

        .components-avatar::after {
            content    : attr(data-name);
            margin-left: 8px;
        }

        .components-avatar:hover {
            background-color: rgba(0, 0, 0, 0.06);
            border-radius   : 4px;
        }
    `;
    static createStyle() {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(Avatar.cssText));
        document.querySelector("head").appendChild(style);
        return style;
    }
    static getInstance() {
        if (!Avatar.instance) {
            Avatar.instance = new Storage();
            Avatar.createStyle();
        }
        return Avatar.instance;
    }
    constructor(mis: string, dom: HTMLElement) {
        this.mis = mis;
        this.dom = dom;
        this.storage = Avatar.getInstance();
        this.initialization();
    }
    private initialization() {
        const img = new Image();
        const box = document.createElement('div');
        box.classList.add('components-avatar');
        box.appendChild(img);
        this.dom.appendChild(box);
        this.storage.get(this.mis, (vo: UserInfo) => {
            img.src = vo.url;
            box.setAttribute('data-name', vo.name);
        });
    }
}
export default Avatar;
