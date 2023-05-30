import { useEffect, useState } from "react";

import "./App.css";
import "./list.css";
import { MessageList } from "./MessageList";


type IMessage = {
  type?: string;
  msg: string;
  createTime: string;
};

let ws: WebSocket;
let timer: number;

const check = () => {
  timer = setTimeout(() => {
    ws.send('ping');
  }, 1000 * 30);
};
const reset = () => {
  timer && clearTimeout(timer);
  check();
};

function showNotification(title: string, content: string) {
  if (window.Notification) {
    if (window.Notification.permission == "granted") {
      const notification = new Notification(title, {
        body: content,
      });

      notification.onclick = function () {
        //可直接打开通知notification相关联的tab窗口
        window.focus();
      };

    } else {
      window.Notification.requestPermission();
    }
  } else alert('你的浏览器不支持此消息提示功能，请使用chrome内核的浏览器！');
}

const host = "cicd3d.gkiiot.com";
const wsPrexix =  "wss";


function App() {
  const [logs, setLogs] = useState<IMessage[]>([]);

  const callback = function (evt: MessageEvent<any>) {
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

        const content = JSON.parse(contentString) as IMessage;

        if (content.type === "log") {
          showNotification("收到新的更新日志", content.msg);
          setLogs((logs) => {
            return [{
              ...content,
              createTime: content.createTime || new Date().toLocaleString(),
            }, ...logs,];
          });
        }
        if (content.type === "error") {
          showNotification("收到错误信息", content.msg);
        }
        else if (content.type === "init") {
          // const data = JSON.parse(content.msg) as IMessage[];
          // const errors = [];
          // const logs = [];
          // for (const d of data) {
          //   if (d.type === "log") {
          //     logs.push(d);
          //   }
          //   if (d.type === "error")
          //     errors.push(d);
          // }
          // setLogs(logs);
          // setErrors(errors);
        }

      }
    } catch (error) {
      console.log('error: ', error);
    }

  };

  const init = () => {
    fetch(`https://${host}/get-logs`).then(res => res.json()).then(r => {
      console.log('r: ', r);
      if (r.code === 200) {
        setLogs(r.data || []);
      }
    });
  };


  useEffect(() => {
    init();
    if (!ws) {
      ws = new WebSocket(`${wsPrexix}://${host}/client2`);

      //连接打开时触发
      ws.onopen = function () {
        console.log("Connection open ...");
        setTimeout(() => {
          ws.send('{"type":"init"}');
        }, 100);
        check();
      };

      //连接关闭时触发
      ws.onclose = function () {
        console.log("Connection closed.");
      };
    }
    //接收到消息时触发
    ws.addEventListener("message", callback);

    
    return () => {
      ws.removeEventListener("message", callback);
    };

  }, []);

  return (
    <div className="App">
      <div style={{ flex: 1 }}>
        <h4>发布记录</h4>
        <MessageList logs={logs} />
      </div>
    </div>
  );
}

export default App;
