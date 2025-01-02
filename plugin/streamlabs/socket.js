// 创建一个websocket 然后连接上 并且监听起来 看看有什么 效果
const { Plugins, Actions, log } = require('../utils/plugin');
const { getProxySettings } = require('get-proxy-settings');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { StreamlabsProxyGet, proxyGet, proxyPost, proxyPut, proxyPatch, getUserInfo, StreamlabsProxyPost, StreamlabsProxyDelete, StreamlabsProxyPatch, StreamlabsProxyPut } = require('../utils/request');
const io = require('socket.io-client')
function Socket(userInfo = null, statusContexts, actionStatus, plugin) {
    if (userInfo == null) {
        return;
    }

    getToken(userInfo, async (success, socketToken) => {
        if (!success) {
            log.info(socketToken); return;
        }
        //const data = (await getProxySettings());
        const webSocket = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'], agent: null });
        //const webSocket = io(`https://sockets.streamlabs.com?token=${socketToken}`, { transports: ['websocket'], agent: data ? new HttpsProxyAgent(data.https) : null });

        // 连接成功
        webSocket.on('connect', () => {
            log.info('WebSocket Client Connected'); // client = webSocket;
        });

        // 接收到任何事件
        webSocket.on('event', (eventData) => {
            log.info('Received event:', eventData); // log.info('Received event:', eventData.type); /// 在这里将事件 分门别类 然后进行转化
            if (eventData.type === 'mediaSharingSettingsUpdate') {
                if ('auto_play' in eventData.message.advanced_settings && eventData.message.advanced_settings.auto_play) {         // 开启警告静音
                    actionStatus.action9 = true; statusContexts.action9.forEach((context) => { plugin.setState(context, actionStatus.action9 ? 0 : 1); })
                } if ('auto_play' in eventData.message.advanced_settings && !eventData.message.advanced_settings.auto_play) {         // 开启警告静音
                    actionStatus.action9 = false; statusContexts.action9.forEach((context) => { plugin.setState(context, actionStatus.action9 ? 0 : 1); })
                } if ('requests_enabled' in eventData.message.advanced_settings && eventData.message.advanced_settings.requests_enabled) {         // 暂停媒体
                    actionStatus.action13 = true; statusContexts.action13.forEach((context) => { plugin.setState(context, actionStatus.action13 ? 0 : 1); })
                } if ('requests_enabled' in eventData.message.advanced_settings && !eventData.message.advanced_settings.requests_enabled) {         // 播放媒体
                    actionStatus.action13 = false; statusContexts.action13.forEach((context) => { plugin.setState(context, actionStatus.action13 ? 0 : 1); })
                } if ('auto_show' in eventData.message.advanced_settings && eventData.message.advanced_settings.auto_show) {         // 暂停媒体
                    actionStatus.action15 = true; statusContexts.action15.forEach((context) => { plugin.setState(context, actionStatus.action15 ? 0 : 1); })
                } if ('auto_show' in eventData.message.advanced_settings && !eventData.message.advanced_settings.auto_show) {         // 播放媒体
                    actionStatus.action15 = false; statusContexts.action15.forEach((context) => { plugin.setState(context, actionStatus.action15 ? 0 : 1); })
                } if ('moderation_queue' in eventData.message.advanced_settings && eventData.message.advanced_settings.moderation_queue) {         // 暂停媒体
                    actionStatus.action16 = true; statusContexts.action16.forEach((context) => { plugin.setState(context, actionStatus.action16 ? 0 : 1); })
                } if ('moderation_queue' in eventData.message.advanced_settings && !eventData.message.advanced_settings.moderation_queue) {         // 播放媒体
                    actionStatus.action16 = false; statusContexts.action16.forEach((context) => { plugin.setState(context, actionStatus.action16 ? 0 : 1); })
                } if ('backup_playlist_enabled' in eventData.message.advanced_settings && eventData.message.advanced_settings.backup_playlist_enabled) {         // 暂停媒体
                    actionStatus.action17 = true; statusContexts.action17.forEach((context) => { plugin.setState(context, actionStatus.action17 ? 0 : 1); })
                } if ('backup_playlist_enabled' in eventData.message.advanced_settings && !eventData.message.advanced_settings.backup_playlist_enabled) {         // 播放媒体
                    actionStatus.action17 = false; statusContexts.action17.forEach((context) => { plugin.setState(context, actionStatus.action17 ? 0 : 1); })
                }
            } if (eventData.type === 'muteVolume') {     // 开启警告静音
                actionStatus.action3 = true; statusContexts.action3.forEach((context) => { plugin.setState(context, actionStatus.action3 ? 0 : 1); })
            } if (eventData.type === 'unmuteVolume') {     // 关闭警告静音
                actionStatus.action3 = false; statusContexts.action3.forEach((context) => { plugin.setState(context, actionStatus.action3 ? 0 : 1); })
            } if (eventData.type === 'pauseQueue') {     // 开启暂停警告播放
                actionStatus.action4 = true; statusContexts.action4.forEach((context) => { plugin.setState(context, actionStatus.action4 ? 0 : 1); })
            } if (eventData.type === 'unpauseQueue') {     // 关闭警告静音
                actionStatus.action4 = false; statusContexts.action4.forEach((context) => { plugin.setState(context, actionStatus.action4 ? 0 : 1); })
            }
            if (eventData.message.type === 'requestPlay') {     // 开启警告静音
                actionStatus.action14 = true; statusContexts.action14.forEach((context) => { plugin.setState(context, actionStatus.action14 ? 0 : 1); })
            } if (eventData.message.type === 'requestPause') {     // 开启警告静音
                actionStatus.action14 = false; statusContexts.action14.forEach((context) => { plugin.setState(context, actionStatus.action14 ? 0 : 1); })
            }
        });

        // 错误处理
        webSocket.on('error', (error) => {
            log.error('Error:', error);
            webSocket = null;
        });

        // 断开连接
        webSocket.on('disconnect', (reason) => {
            log.info(`Disconnected: ${reason}`);
            webSocket = null;
        });

        // 自动重新连接
        webSocket.on('reconnect', (attemptNumber) => {
            log.info(`Reconnect attempt: ${attemptNumber}`);
            webSocket = null;
        });

        // 连接超时
        webSocket.on('connect_timeout', (timeout) => {
            log.info(`Connection Timeout: ${timeout}`);
            webSocket = null;
        });

        // 发射事件，如果需要向服务端发送事件
        // client.emit('some_event', { some: 'data' });

    })
}

// Private function called for the get token request
function getToken(account, callback) {
    log.info("account", account)
    proxyGet("https://streamlabs.com/api/v2.0/socket/token", {
        headers: {
            "Content-Type": "application/json", "Authorization": `Bearer ${account.access_token}`
        }
    }).then(async (result) => {
        if ('socket_token' in result) {
            await callback(true, result.socket_token);
        }
        else {
            await callback(false, "Account request failed.");
        }
        log.info("我已经发送了 请求result", result);
    }).catch((error) => {
        log.info("error", error);
    })
}
module.exports = {
    Socket
}