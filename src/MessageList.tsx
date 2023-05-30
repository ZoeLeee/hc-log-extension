import React from 'react';
import { MessageItem } from './MessageItem';

type Props = { logs: any[]; };

export const MessageList: React.FC<Props> = ({ logs }) => {
    return (
        <ul className='message'>
            {logs.map((err, index) => (
                <MessageItem isLeft log={err} key={index} />
            ))}
        </ul>
    );
};