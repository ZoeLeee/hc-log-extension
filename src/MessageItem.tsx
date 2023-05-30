import React from 'react';

type Props = { log: any; isLeft: boolean; };

export const MessageItem: React.FC<Props> = ({ log, isLeft }) => {
    return (
        <li className={isLeft ? "leftMsg" : "rightMsg"}>
            <div className='avatar'></div>
            <div className='contentContainer'>
                <div className='time'>{log.createTime}</div>
                <div className='content'>
                    {
                        log.type === "error" ? <>
                            <div>用户名:{log.user}</div>
                            <div>文件名:{log.fileName}</div>
                            <div>文件id:{log.file}</div>
                            <div>地址:{log.href}</div>
                            <div>包版本:{log.version}</div>
                            <div>msg:{log.msg}</div>
                            <div>stack:{log.stack}</div>
                            <div>用户代理:{log.userAgent}</div>
                            <div>显卡信息:{log.renderInfo}</div>
                            <div>IP:{log.ip}</div>
                            <div>本地IP:{log.localIP}</div>
                        </> : log.msg
                    }
                </div>
            </div>
        </li>
    );
};