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

// 检查图片URL是否可访问 - 简化版本，避免超时
async function isImageAccessible(url: string): Promise<boolean> {
  try {
    // 使用更短的超时时间，避免在Vercel上超时
    const response = await axios.head(url, { 
      timeout: 3000,
      headers: {
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error(`图片URL检查失败: ${url}`, error);
    return false;
  }
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

    // 在Vercel环境中，减少模拟处理时间，避免超时
    // 检查是否在Vercel环境中
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      // Vercel环境中使用较短的延迟
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('Vercel环境，使用5秒延迟');
    } else {
      // 本地环境使用完整的20秒延迟
      await new Promise(resolve => setTimeout(resolve, 20000));
      console.log('本地环境，使用20秒延迟');
    }

    // 准备生成图像
    const outputs: string[] = [];
    const failedOutputs: number[] = [];
    
    // 根据风格调整提示词
    let enhancedPrompt = prompt;
    if (style && style !== 'photorealistic') {
      enhancedPrompt = `${prompt}, ${style} style`;
    }

    console.log('增强后的提示词:', enhancedPrompt);

    // 生成指定数量的图像URL
    for (let i = 0; i < count; i++) {
      const seed = generateRandomSeed();
      console.log(`生成图像 ${i+1}/${count}, 种子值: ${seed}`);
      
      // 构建Pollinations API URL
      const imageUrl = buildPollinationsImageUrl(enhancedPrompt, {
        width,
        height,
        seed,
        nologo: true
      });
      
      console.log(`图像URL ${i+1}: ${imageUrl}`);
      
      // 在Vercel环境中，跳过可访问性检查以避免超时
      if (isVercel) {
        outputs.push(imageUrl);
        continue;
      }
      
      // 本地环境中检查图片URL是否可访问
      const isAccessible = await isImageAccessible(imageUrl);
      
      if (isAccessible) {
        console.log(`图像 ${i+1} 可访问`);
        outputs.push(imageUrl);
      } else {
        console.log(`图像 ${i+1} 不可访问，使用备用URL`);
        failedOutputs.push(i);
        // 使用备用URL
        const backupUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${seed + 1000}&nologo=true`;
        outputs.push(backupUrl);
      }
    }

    // 如果所有图片生成失败，返回模拟数据
    if (outputs.length === 0) {
      console.log('所有图像生成失败，返回模拟数据');
      // 模拟图像URL
      const mockImages = mockImageUrls.slice(0, count);
      
      return res.status(200).json({
        success: true,
        outputs: mockImages,
        warning: '无法生成真实图像，返回模拟数据'
      });
    }

    console.log(`成功生成 ${outputs.length} 张图像`);
    
    // 返回生成的图像URL
    return res.status(200).json({
      success: true,
      outputs,
      failedCount: failedOutputs.length,
      failedIndexes: failedOutputs
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