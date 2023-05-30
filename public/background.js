let ws;
let timer;

const check = () => {
    timer = setTimeout(() => {
        ws.send('ping');
    }, 1000 * 30);
};

const reset = () => {
    timer && clearTimeout(timer);
    check();
};

const showNotification = (title, message) => {
    chrome.notifications.create(Date.now().toString(), {
        type: 'basic',
        title: title,
        message: message,
        iconUrl: 'vite.svg',
        isClickable:true,
    });
}

const callback = function (evt) {
    reset();
    console.log('Received : ', evt.data);
    const contentString = evt.data;

    //维持心跳
    if (contentString === "pong") {
        return;
    }

    try {
        if (contentString) {
            if (!contentString) return;

            const content = JSON.parse(contentString);

            if (content.type === "log") {
                showNotification("收到新的更新日志", content.msg);
            }
            if (content.type === "error") {
                showNotification("收到错误信息", content.msg);
            }

        }
    } catch (error) {
        console.log('error: ', error);
    }

};

if (!ws) {
    ws = new WebSocket(`wss://cicd3d.gkiiot.com/client2`);

    //连接打开时触发
    ws.onopen = function () {
        console.log("Connection open ...");
        check();
    };

    //连接关闭时触发
    ws.onclose = function () {
        console.log("Connection closed.");
    };
}
//接收到消息时触发
ws.addEventListener("message", callback);



chrome.notifications.onClicked.addListener(function (notificationId) {
    chrome.tabs.create({
        url: "https://cicd3d.gkiiot.com/web/"
    }).then(tab=>{
        chrome.notifications.clear(notificationId);
        tab.active = true;
    })
})