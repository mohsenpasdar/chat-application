import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'
import { v4 as uuidv4 } from 'uuid';

const Chat = ({ socket, username, room }) => {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const sendMessage = async () => {
        if (currentMessage) {
            const messageData = {
                id: uuidv4(),
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit('send_message', messageData)
            setMessageList(list => [...list, messageData])
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        socket.off('receive_message').on('receive_message', (data) => {
            setMessageList(list => [...list, data])
        }, [socket])
    })

    return (
        <div className='chat-window'>
            <div className='chat-header'>
                <p>Live chat</p>
            </div>
            <div className='chat-body'>
                <ScrollToBottom className='message-container'>
                    {messageList.map(message => (
                        <div
                            key={message.id}
                            className='message'
                            id={username === message.author ? "you" : "other"}
                        >
                            <div>
                                <div className='message-content'>
                                    <p>{message.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{message.time}</p>
                                    <p id='author'>{message.author}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input
                    value={currentMessage}
                    type='text'
                    placeholder='type here...'
                    onChange={e => { setCurrentMessage(e.target.value) }}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            sendMessage()
                        }
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
};

export default Chat;