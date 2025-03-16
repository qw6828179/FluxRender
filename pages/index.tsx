import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiDownload, FiRefreshCw, FiCopy, FiInfo, FiCheck } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

// 样式和动画配置
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// 预设风格选项
const styleOptions = [
  { id: 'photorealistic', name: '写实风格' },
  { id: 'anime', name: '动漫风格' },
  { id: 'digital-art', name: '数字艺术' },
  { id: 'oil-painting', name: '油画风格' },
  { id: 'watercolor', name: '水彩风格' },
  { id: 'pixel-art', name: '像素艺术' },
  { id: 'fantasy', name: '奇幻风格' },
  { id: 'cyberpunk', name: '赛博朋克' },
  { id: 'abstract', name: '抽象艺术' },
  { id: 'minimalist', name: '极简主义' }
];

// 图片比例选项
const aspectRatioOptions = [
  { id: 'square', name: '正方形', width: 768, height: 768 },
  { id: 'portrait', name: '竖向长方形', width: 768, height: 1024 },
  { id: 'landscape', name: '横向长方形', width: 1024, height: 768 }
];

// 多语言随机提示示例
const randomPromptExamples = {
  'zh-CN': [
    "一个未来科技城市的夜景，霓虹灯光照亮高耸的摩天大楼",
    "一个宁静的湖泊，周围是秋天的森林，远处有雪山",
    "一个科幻实验室内的机器人工程师正在工作",
    "一个漂浮在太空中的水晶城堡，背景是五彩斑斓的星云",
    "一个古老的图书馆，阳光透过彩色玻璃窗照射进来",
    "一个赛博朋克风格的街道，雨水反射着霓虹灯光",
    "一个幻想世界中的巨大树屋城市，藤蔓和瀑布环绕",
    "一个深海探索潜艇遇到发光的海洋生物",
    "一个漂浮在云端的未来城市，飞行器穿梭其中",
    "一个被遗弃的太空站，宇航员正在探索",
    "一个水晶洞穴，发光的矿物照亮了整个空间",
    "一个未来的生物实验室，充满了奇异的植物和生物",
    "一个漂浮在云端的古代神殿，周围环绕着飞龙",
    "一个霓虹灯闪烁的赛博朋克酒吧，充满了各种奇异的角色",
    "一个被遗忘的地下城市，古老的建筑与先进的科技融合",
    "一个外星景观，有着奇特的植物和多彩的天空"
  ],
  'en': [
    "A futuristic city skyline at night, with neon lights illuminating towering skyscrapers",
    "A serene lake surrounded by autumn forest with snow-capped mountains in the distance",
    "A robot engineer working in a sci-fi laboratory",
    "A crystal castle floating in space with colorful nebulae in the background",
    "An ancient library with sunlight streaming through stained glass windows",
    "A cyberpunk street with rain reflecting neon lights",
    "A massive treehouse city in a fantasy world, surrounded by vines and waterfalls",
    "A deep-sea exploration submarine encountering luminescent marine creatures",
    "A floating future city in the clouds with flying vehicles zooming around",
    "An abandoned space station being explored by astronauts",
    "A crystal cave illuminated by glowing minerals",
    "A futuristic biological laboratory filled with strange plants and organisms",
    "An ancient temple floating in the clouds, surrounded by flying dragons",
    "A cyberpunk bar with flickering neon lights, filled with various strange characters",
    "A forgotten underground city where ancient architecture merges with advanced technology",
    "An alien landscape with bizarre plants and a colorful sky"
  ],
  'ja': [
    "未来的な都市の夜景、ネオンライトが高層ビルを照らしている",
    "静かな湖、周りは秋の森、遠くには雪山がある",
    "SF研究所でロボットエンジニアが作業している",
    "宇宙に浮かぶ水晶の城、背景にはカラフルな星雲がある",
    "古い図書館、ステンドグラスから日光が差し込んでいる",
    "サイバーパンクスタイルの通り、雨がネオンライトを反射している",
    "ファンタジー世界の巨大なツリーハウス都市、蔓と滝に囲まれている",
    "深海探査潜水艦が発光する海洋生物に遭遇する",
    "雲の上に浮かぶ未来都市、飛行機器が行き交っている",
    "放棄された宇宙ステーション、宇宙飛行士が探索している",
    "水晶の洞窟、輝く鉱物が空間全体を照らしている",
    "未来の生物学研究所、奇妙な植物と生物で満ちている",
    "雲の上に浮かぶ古代の神殿、周りには飛龍が舞っている",
    "ネオンライトが点滅するサイバーパンクバー、様々な奇妙なキャラクターで満ちている",
    "忘れられた地下都市、古代の建築と先進技術が融合している",
    "エイリアンの風景、奇妙な植物とカラフルな空がある"
  ],
  'ko': [
    "미래 도시의 야경, 네온 불빛이 높은 마천루를 비추고 있다",
    "고요한 호수, 주변은 가을 숲이고 멀리 눈 덮인 산이 있다",
    "공상 과학 실험실에서 로봇 엔지니어가 작업 중이다",
    "우주에 떠 있는 수정 성, 배경에는 다채로운 성운이 있다",
    "고대 도서관, 햇빛이 스테인드글라스 창을 통해 들어온다",
    "사이버펑크 스타일의 거리, 비가 네온 불빛을 반사하고 있다",
    "판타지 세계의 거대한 나무 집 도시, 덩굴과 폭포로 둘러싸여 있다",
    "심해 탐사 잠수함이 빛나는 해양 생물을 만난다",
    "구름 위에 떠 있는 미래 도시, 비행 장치가 오가고 있다",
    "버려진 우주 정거장, 우주 비행사가 탐험 중이다",
    "수정 동굴, 빛나는 광물이 전체 공간을 밝히고 있다",
    "미래의 생물학 실험실, 이상한 식물과 생물로 가득 차 있다",
    "구름 위에 떠 있는 고대 신전, 주변에는 용들이 날고 있다",
    "네온 불빛이 깜박이는 사이버펑크 바, 다양한 이상한 캐릭터로 가득 차 있다",
    "잊혀진 지하 도시, 고대 건축물과 첨단 기술이 융합되어 있다",
    "외계 풍경, 기이한 식물과 다채로운 하늘이 있다"
  ]
};

// 灵感画廊图片 - 多语言
const getInspirationGalleryImages = (language) => {
  const prompts = randomPromptExamples[language] || randomPromptExamples['zh-CN'];
  return prompts.map(prompt => ({
    url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true`,
    prompt: prompt
  }));
};

export default function Home() {
  const { t, i18n } = useTranslation();
  // 添加客户端渲染状态
  const [mounted, setMounted] = useState(false);
  
  // 组件挂载后设置状态，避免SSR问题
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 状态管理
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('square');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [inspirationImages, setInspirationImages] = useState([]);
  
  // 当语言变化时更新灵感画廊
  useEffect(() => {
    if (mounted) {
      const currentLanguage = i18n.language || 'zh-CN';
      setInspirationImages(getInspirationGalleryImages(currentLanguage));
    }
  }, [i18n.language, mounted]);
  
  // 倒计时效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGenerating && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isGenerating, countdown]);
  
  // 生成随机提示
  const generateRandomPrompt = () => {
    const currentLanguage = i18n.language || 'zh-CN';
    const prompts = randomPromptExamples[currentLanguage] || randomPromptExamples['zh-CN'];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[randomIndex]);
  };

  // 复制提示到剪贴板
  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('提示已复制到剪贴板！');
  };

  // 下载生成的图像
  const downloadImage = (imageUrl: string, index: number) => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dome-ai-${new Date().getTime()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('图像下载已开始！');
  };

  // 获取当前选择的宽高比
  const getSelectedAspectRatioConfig = () => {
    return aspectRatioOptions.find(option => option.id === selectedAspectRatio) || aspectRatioOptions[0];
  };

  // 生成图像
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词！');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImages([]);
    setSelectedImageIndex(null);
    setCountdown(20); // 设置20秒倒计时
    
    try {
      const aspectRatioConfig = getSelectedAspectRatioConfig();
      
      // 使用本地API路由，该路由会调用Pollinations API
      const response = await axios.post('/api/generate', {
        prompt: prompt,
        negative_prompt: negativePrompt || 'blurry, bad quality, distorted',
        width: aspectRatioConfig.width,
        height: aspectRatioConfig.height,
        count: 3, // 一次生成3张图片
        aspectRatio: selectedAspectRatio,
        style: selectedStyle
      });
      
      if (response.data && response.data.success && response.data.outputs) {
        setGeneratedImages(response.data.outputs);
        // 默认选择第一张图片
        setSelectedImageIndex(0);
        
        // 如果有警告信息，显示给用户
        if (response.data.warning) {
          toast.warning(response.data.warning);
        }
        
        // 如果有失败的图片，显示提示
        if (response.data.failedCount && response.data.failedCount > 0) {
          toast.info(`${response.data.failedCount}张图片可能加载较慢，请耐心等待`);
        }
      } else {
        throw new Error('生成图像失败');
      }
    } catch (err) {
      console.error('生成图像时出错:', err);
      setError('生成图像时出错。请稍后再试。');
      toast.error('生成图像失败，请稍后再试！');
    } finally {
      setIsGenerating(false);
      setCountdown(0);
    }
  };

  // 如果组件未挂载，返回加载状态或空内容
  if (!mounted) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <ToastContainer position="bottom-right" theme="dark" />

      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-black/50 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                Dome AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.features')}
              </a>
              <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.gallery')}
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.faq')}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 英雄区域 */}
        <section className="mb-20">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          {/* 图像生成器 */}
          <motion.div 
            className="tech-card max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                {t('generator.prompt')}
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  rows={3}
                  className="tech-input"
                  placeholder={t('generator.promptPlaceholder')}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="absolute right-2 top-2 flex space-x-2">
                  <button
                    onClick={generateRandomPrompt}
                    className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                    title={t('generator.generateRandomPrompt')}
                  >
                    <FiRefreshCw size={18} />
                  </button>
                  <button
                    onClick={copyPromptToClipboard}
                    className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                    title={t('generator.copyPrompt')}
                    disabled={!prompt}
                  >
                    <FiCopy size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('generator.style')}
                </label>
                <select
                  id="style"
                  className="tech-select w-full"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {styleOptions.map((style) => (
                    <option key={style.id} value={style.id}>
                      {t(`styleOptions.${style.id}`)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('generator.aspectRatio')}
                </label>
                <select
                  id="aspectRatio"
                  className="tech-select w-full"
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value)}
                >
                  {aspectRatioOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {t(`aspectRatioOptions.${option.id}`)} ({option.width}x{option.height})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-300 mb-2">
                {t('generator.negativePrompt')}
              </label>
              <textarea
                id="negativePrompt"
                rows={2}
                className="tech-input"
                placeholder={t('generator.negativePromptPlaceholder')}
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="tech-button flex items-center justify-center min-w-[200px]"
              >
                {isGenerating ? (
                  <TailSpin color="#ffffff" height={24} width={24} />
                ) : (
                  t('generator.generateButton')
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {t('generator.errorGenerating')}
              </div>
            )}

            {isGenerating && (
              <div className="mt-8 text-center text-gray-300">
                <p>{t('generator.generating')}</p>
                {countdown > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 max-w-md mx-auto">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${((20 - countdown) / 20) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm">{t('generator.estimatedTime', { countdown })}</p>
                  </div>
                )}
              </div>
            )}

            {generatedImages.length > 0 && !isGenerating && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-center">{t('generator.generatedImages')}</h3>
                
                {/* 图像网格 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {generatedImages.map((imageUrl, index) => (
                    <div 
                      key={index}
                      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${selectedImageIndex === index ? 'border-primary-500 shadow-lg shadow-primary-500/20' : 'border-gray-700 hover:border-gray-500'}`}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        aspectRatio: `${getSelectedAspectRatioConfig().width}/${getSelectedAspectRatioConfig().height}`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-0">
                        <TailSpin color="#6d28d9" height={30} width={30} />
                      </div>
                      <Image
                        src={imageUrl}
                        alt={`AI生成的图像 ${index + 1}`}
                        fill
                        className="object-cover z-10"
                        unoptimized={true} // 对于外部图像，设置为unoptimized
                        onLoadingComplete={(img) => {
                          // 图片加载完成后，隐藏加载指示器
                          const parent = img.parentElement?.parentElement;
                          if (parent) {
                            const loader = parent.querySelector('div.absolute');
                            if (loader) {
                              loader.classList.add('hidden');
                            }
                          }
                        }}
                        onError={(e) => {
                          // 图片加载失败时，尝试使用不同的种子值
                          console.error('图片加载失败，尝试使用备用URL');
                          const target = e.target as HTMLImageElement;
                          const seed = Math.floor(Math.random() * 1000000);
                          const aspectRatioConfig = getSelectedAspectRatioConfig();
                          target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${aspectRatioConfig.width}&height=${aspectRatioConfig.height}&seed=${seed}&nologo=true`;
                        }}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1 z-20">
                          <FiCheck size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* 选中的图像和下载按钮 */}
                {selectedImageIndex !== null && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative w-full max-w-2xl rounded-lg overflow-hidden border border-gray-700 mb-4"
                      style={{
                        aspectRatio: `${getSelectedAspectRatioConfig().width}/${getSelectedAspectRatioConfig().height}`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-0">
                        <TailSpin color="#6d28d9" height={40} width={40} />
                      </div>
                      <Image
                        src={generatedImages[selectedImageIndex]}
                        alt="选中的AI生成图像"
                        fill
                        className="object-cover z-10"
                        unoptimized={true} // 对于外部图像，设置为unoptimized
                        priority={true}
                        onLoadingComplete={(img) => {
                          // 图片加载完成后，隐藏加载指示器
                          const parent = img.parentElement?.parentElement;
                          if (parent) {
                            const loader = parent.querySelector('div.absolute');
                            if (loader) {
                              loader.classList.add('hidden');
                            }
                          }
                        }}
                        onError={(e) => {
                          // 图片加载失败时，尝试使用不同的种子值
                          console.error('大图加载失败，尝试使用备用URL');
                          const target = e.target as HTMLImageElement;
                          const seed = Math.floor(Math.random() * 1000000);
                          const aspectRatioConfig = getSelectedAspectRatioConfig();
                          target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${aspectRatioConfig.width}&height=${aspectRatioConfig.height}&seed=${seed}&nologo=true`;
                          toast.info(t('generator.loadingSlow'));
                        }}
                      />
                    </div>
                    <button
                      onClick={() => downloadImage(generatedImages[selectedImageIndex], selectedImageIndex)}
                      className="tech-button flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      {t('generator.downloadImage')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* 灵感画廊 - 移到生成图片下面 */}
        <section id="gallery" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {t('gallery.title')}
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {inspirationImages.map((item, index) => (
              <motion.div
                key={index}
                className="tech-card overflow-hidden p-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <TailSpin color="#6d28d9" height={30} width={30} />
                  </div>
                  <Image
                    src={item.url}
                    alt={`灵感图像 ${index + 1}`}
                    fill
                    className="object-cover z-10"
                    unoptimized={true}
                    loading="lazy"
                    onLoadingComplete={(img) => {
                      // 图片加载完成后，隐藏加载指示器
                      const parent = img.parentElement?.parentElement;
                      if (parent) {
                        const loader = parent.querySelector('div.absolute');
                        if (loader) {
                          loader.classList.add('hidden');
                        }
                      }
                    }}
                    onError={(e) => {
                      // 图片加载失败时的处理
                      console.error('灵感画廊图片加载失败，尝试使用备用URL');
                      const target = e.target as HTMLImageElement;
                      const seed = index + Math.floor(Math.random() * 1000);
                      target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt)}?width=768&height=768&nologo=true&seed=${seed}`;
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 italic line-clamp-2">
                  "{item.prompt}"
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 特性部分 */}
        <section id="features" className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {t('features.title')}
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                key: 'free',
                icon: '🎁'
              },
              {
                key: 'noLogin',
                icon: '🔒'
              },
              {
                key: 'highQuality',
                icon: '✨'
              },
              {
                key: 'styles',
                icon: '🎨'
              },
              {
                key: 'batch',
                icon: '⚡'
              },
              {
                key: 'ratios',
                icon: '📐'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="tech-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-gray-400">{t(`features.${feature.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 常见问题 */}
        <section id="faq" className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {t('faq.title')}
              </span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {[
              'free',
              'commercial',
              'bestResults',
              'storage',
              'limits',
              'ratios'
            ].map((key, index) => (
              <motion.div
                key={index}
                className="tech-card mb-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold mb-2">{t(`faq.questions.${key}.question`)}</h3>
                <p className="text-gray-400">{t(`faq.questions.${key}.answer`)}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black/50 backdrop-blur-sm border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                Dome AI
              </span>
              <p className="text-gray-400 mt-2">
                {t('hero.title')}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.terms')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {t('footer.about')}
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Dome AI. {t('footer.rights')}</p>
            <p className="mt-2">
              {t('footer.poweredBy')} <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Pollinations AI</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 