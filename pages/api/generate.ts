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

// 检查图片URL是否可访问
async function isImageAccessible(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, { timeout: 5000 });
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
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '只允许POST请求' });
  }

  try {
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

    // 验证必要参数
    if (!prompt) {
      return res.status(400).json({ success: false, error: '缺少提示词参数' });
    }

    // 模拟处理时间 - 20秒
    await new Promise(resolve => setTimeout(resolve, 20000));

    // 准备生成图像
    const outputs: string[] = [];
    const failedOutputs: number[] = [];
    
    // 根据风格调整提示词
    let enhancedPrompt = prompt;
    if (style && style !== 'photorealistic') {
      enhancedPrompt = `${prompt}, ${style} style`;
    }

    // 生成指定数量的图像URL
    for (let i = 0; i < count; i++) {
      const seed = generateRandomSeed();
      
      // 构建Pollinations API URL
      const imageUrl = buildPollinationsImageUrl(enhancedPrompt, {
        width,
        height,
        seed,
        nologo: true,
        negative_prompt: negative_prompt
      });
      
      // 检查图片URL是否可访问
      const isAccessible = await isImageAccessible(imageUrl);
      
      if (isAccessible) {
        outputs.push(imageUrl);
      } else {
        failedOutputs.push(i);
        // 使用备用URL
        const backupUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${width}&height=${height}&seed=${seed + 1000}&nologo=true`;
        outputs.push(backupUrl);
      }
    }

    // 如果所有图片生成失败，返回模拟数据
    if (outputs.length === 0) {
      // 模拟图像URL
      const mockImages = [
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=1&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=2&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=3&nologo=true`
      ];
      
      return res.status(200).json({
        success: true,
        outputs: mockImages,
        warning: '无法生成真实图像，返回模拟数据'
      });
    }

    // 返回生成的图像URL
    return res.status(200).json({
      success: true,
      outputs,
      failedCount: failedOutputs.length,
      failedIndexes: failedOutputs
    });
  } catch (error) {
    console.error('生成图像时出错:', error);
    
    // 返回错误响应
    return res.status(500).json({
      success: false,
      error: '生成图像时出错',
      outputs: [
        'https://image.pollinations.ai/prompt/error%20occurred%20placeholder%20image?width=768&height=768&seed=1&nologo=true',
        'https://image.pollinations.ai/prompt/error%20occurred%20placeholder%20image?width=768&height=768&seed=2&nologo=true',
        'https://image.pollinations.ai/prompt/error%20occurred%20placeholder%20image?width=768&height=768&seed=3&nologo=true'
      ]
    });
  }
} 