import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// 备用模拟图像URL列表（仅在API调用失败时使用）
const mockImageUrls = [
  'https://images.unsplash.com/photo-1635776062127-d379bfcba9f9?q=80&w=2532&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2574&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=2670&auto=format&fit=crop'
];

// 构建Pollinations图像URL的函数
function buildPollinationsImageUrl(prompt: string, params: Record<string, any> = {}) {
  // 对提示词进行编码
  const encodedPrompt = encodeURIComponent(prompt);
  
  // 构建基础URL
  let url = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  
  // 添加参数
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    }
    url += `?${queryParams.toString()}`;
  }
  
  return url;
}

// 生成随机种子
function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

// API处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 设置CORS头，允许所有来源访问
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '只允许POST请求' });
  }

  try {
    console.log('API请求开始处理...');
    
    // 从请求体中获取参数
    const {
      prompt,
      negative_prompt = 'blurry, bad quality, distorted',
      count = 3,
      width = 768,
      height = 768,
      aspectRatio = 'square',
      style = 'photorealistic'
    } = req.body;

    console.log('请求参数:', { prompt, style, aspectRatio, width, height, count });

    // 验证必要参数
    if (!prompt) {
      console.log('缺少提示词参数');
      return res.status(400).json({ success: false, error: '缺少提示词参数' });
    }

    // 准备生成图像
    const outputs: string[] = [];
    
    // 根据风格调整提示词
    let enhancedPrompt = prompt;
    if (style && style !== 'photorealistic') {
      enhancedPrompt = `${prompt}, ${style} style`;
    }

    console.log('增强后的提示词:', enhancedPrompt);

    // 直接生成指定数量的图像URL，不进行可访问性检查
    for (let i = 0; i < count; i++) {
      const seed = generateRandomSeed();
      console.log(`生成图像 ${i+1}/${count}, 种子值: ${seed}`);
      
      // 构建Pollinations API URL
      const imageUrl = buildPollinationsImageUrl(enhancedPrompt, {
        width,
        height,
        seed,
        nologo: true,
        negative_prompt: negative_prompt
      });
      
      console.log(`图像URL ${i+1}: ${imageUrl}`);
      outputs.push(imageUrl);
    }

    console.log(`成功生成 ${outputs.length} 张图像URL`);
    
    // 返回生成的图像URL
    return res.status(200).json({
      success: true,
      outputs
    });
  } catch (error: any) {
    console.error('生成图像时出错:', error);
    console.error('错误详情:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    
    // 返回错误响应，但仍提供一些模拟图像
    return res.status(500).json({
      success: false,
      error: '生成图像时出错: ' + (error.message || '未知错误'),
      outputs: mockImageUrls.slice(0, 3)
    });
  }
} 