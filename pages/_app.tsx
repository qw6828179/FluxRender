import React, { useState, useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../src/i18n'; // 导入i18n配置

function MyApp({ Component, pageProps }: AppProps) {
  // 添加客户端渲染状态
  const [isClient, setIsClient] = useState(false);

  // 在客户端渲染后设置状态
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 禁用右键菜单
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Dome AI - 免费、无需登录的AI图像生成器，基于Pollinations AI构建，采用科技风格设计。" />
        <meta name="keywords" content="AI, 图像生成, 人工智能, 免费, Pollinations, 科技风格" />
        <meta property="og:title" content="Dome AI - 免费AI图像生成器" />
        <meta property="og:description" content="免费、无需登录的AI图像生成器，基于Pollinations AI构建。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dome-ai.vercel.app" />
        <meta property="og:image" content="https://dome-ai.vercel.app/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dome AI - 免费AI图像生成器" />
        <meta name="twitter:description" content="免费、无需登录的AI图像生成器，基于Pollinations AI构建。" />
        <meta name="twitter:image" content="https://dome-ai.vercel.app/og-image.jpg" />
        <title>Dome AI - 免费AI图像生成器</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isClient ? <Component {...pageProps} /> : null}
    </>
  );
}

export default MyApp; 