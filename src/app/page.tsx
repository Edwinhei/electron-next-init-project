'use client'; // <-- 声明为客户端组件

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css'; // 假设 Next.js 默认的样式文件

export default function Home() {
  const [response, setResponse] = useState('');
  const [asyncResponse, setAsyncResponse] = useState('');

  // 监听主进程的异步回复
  useEffect(()=>{
    if (typeof window !== 'undefined' && window.electronAPI){
      window.electronAPI.onReplyToAnotherMessage((message: string) => {
        setAsyncResponse(message);
      });
    }
    // 清理事件监听器
    return () => {
      if (typeof window !== 'undefined' && window.electronAPI) {
          window.electronAPI.onReplyToAnotherMessage(() => {}); // 移除监听器
      }
  };
  }, []);

  const handleSayHello = async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      const res = await window.electronAPI.sayHello('Next.js 应用');
      setResponse(res);
    } else {
      setResponse('Electron API 未加载，可能不在 Electron 环境中。');
    }
  };

  const handleSendAsyncMessage = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.sendAnotherMessage('这是一个来自 Next.js 应用的异步消息！');
      setAsyncResponse('发送中...');
    } else {
      setAsyncResponse('Electron API 未加载。');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Electron + Next.js</h1>
        <p>这是你的桌面应用！</p>
        <div>
          <button onClick={handleSayHello}>调用主进程同步方法</button>
          <p>主进程回复: {response}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSendAsyncMessage}>发送主进程异步消息</button>
          <p>主进程回复 (异步): {asyncResponse}</p>
        </div>
      </div>
    </main>
  );

}