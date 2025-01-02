// 配置日志文件
const now = new Date();
const log = require('log4js').configure({
    appenders: {
        file: {
            type: 'file',
            filename: `./log/${new Date().toISOString().split('T')[0]}.log`,
            layout: {
                type: 'pattern',
                pattern: '%d %p %f{1}:%l %m'  // This pattern includes date, log level, filename, line number and message
            }
        }
    },
    categories: {
        default: { appenders: ['file'], level: 'info' }
    }
}).getLogger();

// 主线程同步错误处理
process.on('uncaughtException', (err) => {
    log.error("系统错误", err);
    process.exit();
});

// 插件类
const ws = require('ws');
class Plugins {
    static language = process.argv[5];
    constructor() {
        if (Plugins.instance) {
            return Plugins.instance;
        }
        this.ws = new ws("ws://127.0.0.1:" + process.argv[2]);
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({ uuid: process.argv[3], event: process.argv[4] }))
            // log.info("我连上了")
        });
        this.ws.on('close', process.exit);
        this.ws.on('message', e => {
            const data = JSON.parse(e.toString());
            const action = data.action?.split('.').pop();
            this[action]?.[data.event]?.(data);
            this[data.event]?.(data);
        });
        Plugins.instance = this;
    }
    // 设置标题
    setTitle(context, str, row = 0, num = 6) {
        let newStr = '';
        if (row) {
            let nowRow = 1, strArr = str.split('');
            strArr.forEach((item, index) => {
                if (nowRow < row && index >= nowRow * num) { nowRow++; newStr += '\n'; }
                if (nowRow <= row && index < nowRow * num) { newStr += item; }
            });
            if (strArr.length > row * num) { newStr = newStr.substring(0, newStr.length - 1); newStr += '..'; }
        }
        this.ws.send(JSON.stringify({
            event: "setTitle",
            context, payload: {
                target: 0,
                title: newStr || str
            }
        }));
    }
    // 设置背景
    setImage(context, url) {
        const image = new Image();
        image.src = url; image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            this.ws.send(JSON.stringify({
                event: "setImage",
                context, payload: {
                    target: 0,
                    image: canvas.toDataURL("image/png")
                }
            }));
        };
    }
    // 设置状态
    setState(context, state) {
        this.ws.send(JSON.stringify({
            event: "setState",
            context,
            payload: { state }
        }));
    }
    // 保存持久化数据
    setSettings(context, payload) {
        this.ws.send(JSON.stringify({
            event: "setSettings",
            context,
            payload
        }));
    }
    // 发送给属性检测器
    sendToPropertyInspector(payload) {
        this.ws.send(JSON.stringify({
            action: Actions.currentAction,
            context: Actions.currentContext,
            payload,
            event: "sendToPropertyInspector"
        }));
    }
    // 用默认浏览器打开网页
    openUrl(url) {
        this.ws.send(JSON.stringify({
            event: "openUrl",
            payload: { url }
        }));
    }
};

// 操作类
class Actions {
    constructor(data) {
        this.data = {};
        this.default = {};
        Object.assign(this, data);
    }
    // 属性检查器显示时
    static currentAction = null;
    static currentContext = null;
    propertyInspectorDidAppear(data) {
        Actions.currentAction = data.action;
        Actions.currentContext = data.context;
        this._propertyInspectorDidAppear?.(data);
    }
    // 初始化数据
    willAppear(data) {
        const { context, payload: { settings } } = data;
        this.data[context] = Object.assign({ ...this.default }, settings);
        this._willAppear?.(data);
    }
    // 行动销毁
    willDisappear(data) {
        this._willDisappear?.(data);
        delete this.data[data.context];
    }
}

module.exports = {
    log,
    Plugins,
    Actions,
};