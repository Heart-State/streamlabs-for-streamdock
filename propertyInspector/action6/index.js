/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />
// $local 是否国际化
// $back 是否自行决定回显时机
// $dom 获取文档元素 - 不是动态的都写在这里面
const $local = true, $back = false, $dom = {
    main: $('.sdpi-wrapper'),
    user: $('#user'),
    clearUser: $('#clearUser'),
    notLoggedIn: $('#notLoggedIn'),
    loggedIn: $('#loggedIn'),
    referenceTest: $('#referenceTest'),
    clientId: $('#clientId'),
    clientSecret: $('#clientSecret'),
    authorizeBtn: $('#authorizeBtn'),
    authorizeBox: $('#authorizeBox'),
    box: $('#box'),
    open: $('#open'),
};
const $propEvent = {
    // 操作持久化数据触发  
    didReceiveSettings({ settings }) {

    },
    // 当插件使用 sendToPropertyInspector 事件时触发
    sendToPropertyInspector(data) {
        console.log("sendToPropertyInspector", data)
        // 初始化 不太好说
        // 表示需要执行 内容
        Object.keys(data).forEach(key => {
            executeMethod(key, data[key])
        });
    },
    sendToPlugin(data) {
        console.log("sendToPlugin我被触发了。", data)
    }
};

//打开认证页面
$dom.user.on('click', function () {
    const tempToken = generateRandomString(32);
    console.log("我进来了！")
    $websocket.sendToPlugin({ "saveLoginToken": tempToken })
    // window.open("http://localhost:3056/validateOne?code=" + tempToken, Date.now(), 'width=400,height=300');
});

// 清理用户
$dom.clearUser.on("click", function () {
    $websocket.sendToPlugin({ "revokingAccessTokens": "" })
});

// 更新登录用户文本框
function inputChange(text) {
    console.log(text)
    if (text != "" && text != "{}") {
        $dom.notLoggedIn.style.display = 'none';
        $dom.loggedIn.style.display = '';
        $dom.loggedIn.selected = true;
        $dom.loggedIn.text = text;
        $dom.authorizeBox.style.display = "none";
        $dom.box.style.display = "block";
    } else {
        $dom.notLoggedIn.style.display = '';
        $dom.notLoggedIn.selected = true;
        $dom.loggedIn.style.display = 'none';
        $dom.authorizeBox.style.display = "block";
        $dom.box.style.display = "none";
    }
}
// 打开登录用户窗口
function openLoginWindow() {
    $dom.user.click();
}

// 传递方法名和参数
function executeMethod(methodName, parameter) {
    // 使用 window[methodName] 获取方法引用，然后调用它
    if (typeof window[methodName] === 'function') {
        window[methodName](parameter);
    } else {
        console.error(`Method ${methodName} not found.`);
    }
}

// function openRemindinWindow(text) {
//     if (text === "") {
//         $dom.remindWindow.style = "display: none;";
//     } else {
//         $dom.remindWindow.style = "display: flex;";
//         $dom.remindWindow.getElementsByTagName('span')[0].innerText = text;
//     }
// }

var index = 0;
function openRemindinWindow1(messageObj) {
    var id = `message${++index}`;
    var context = `<div class="sdpi-item" id="${id}">
    <div style="
    flex: none;
    width: 94px;
    padding-right: 4px;
    font-weight: 600"> </div>
    <span class="sdpi-item-value" style="text-align: center; color: red;"> ${messageObj.message}</span>
</div>`;
    $dom.referenceTest.insertAdjacentHTML('afterend', context)
    // 设置定时器，5秒后执行删除操作
    setTimeout(function () {
        // 获取要删除的子元素
        var childElement = document.getElementById(id);
        // 删除子元素
        if (childElement) {
            childElement.parentNode.removeChild(childElement);
        }
    }, messageObj.time);
}


$dom.authorizeBtn.on('click', (e) => {
    if (($dom.clientId.value != null && $dom.clientId.value != '') && ($dom.clientSecret.value != null && $dom.clientSecret.value != '')) {
        // $websocket.openUrl("http://127.0.0.1:3056/save?clientId=" + $dom.clientId.value + "&clientSecret=" + $dom.clientSecret.value);
        fetch("http://127.0.0.1:3056/save?clientId=" + $dom.clientId.value + "&clientSecret=" + $dom.clientSecret.value, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json' // 根据需要设置
            }
        })
        $dom.box.style.display = "block";
        openLoginWindow()
    }
})

$dom.open.on('click', (e) => {
    $websocket.openUrl("https://streamlabs.com/dashboard#/settings/oauth-clients")
})