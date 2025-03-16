# Dome AI - 免费AI图像生成器

Dome AI是一个免费、无需登录的AI图像生成器，基于Pollinations AI构建，采用科技风格设计。

## 特性

- **完全免费**：无需付费即可使用所有功能，没有隐藏费用或订阅
- **无需登录**：无需注册或登录即可开始生成图像，保护您的隐私
- **高质量输出**：基于Pollinations AI的强大API，生成令人惊叹的高质量图像
- **多样化风格**：支持多种艺术风格、颜色方案和构图选项，满足您的创意需求
- **批量生成**：一次生成3张图像，从中选择最满意的一张，提高效率
- **多种比例选择**：支持正方形、竖向和横向图片比例，适应不同场景需求
- **多语言支持**：支持中文、英文、日文和韩文，自动检测用户浏览器语言

## 技术栈

- **前端框架**：React.js, Next.js
- **样式**：TailwindCSS, Framer Motion
- **API集成**：Pollinations AI
- **多语言**：i18next, react-i18next

## Pollinations API集成

Dome AI使用Pollinations API生成图像。API URL格式如下：

```
https://image.pollinations.ai/prompt/{prompt}?{params}
```

参数说明：
- `width`: 图像宽度（像素）
- `height`: 图像高度（像素）
- `seed`: 随机种子，用于生成一致的结果
- `model`: 使用的模型（可选）
- `nologo`: 设置为true可移除水印
- `enhance`: 设置为true可增强图像质量
- `private`: 设置为true可使图像私有

更多信息请参考[Pollinations API文档](https://pollinations.ai/docs)。

## 多语言支持

Dome AI支持以下语言：
- 中文 (zh-CN)
- 英文 (en)
- 日文 (ja)
- 韩文 (ko)

系统会自动检测用户浏览器语言并切换到相应语言。用户也可以通过导航栏中的语言切换器手动选择语言。

## 功能模块

### 图像生成器
- 提示词输入
- 风格选择
- 图片比例选择
- 负面提示词
- 生成进度显示（20秒倒计时）
- 图像预览和下载

### 灵感画廊
- 展示16张精选AI生成图像
- 响应式布局（手机端一排2张）
- 图像加载优化

## 使用指南

1. 输入描述您想要生成的图像的提示词
2. 选择合适的风格和图片比例
3. 可选：添加负面提示词，排除不需要的元素
4. 点击"生成图像"按钮
5. 等待20秒，系统会生成3张图像
6. 点击选择您喜欢的图像，然后点击"下载图像"按钮保存

## 开发和部署

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建和部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

可以轻松部署到Vercel或Netlify等平台。

## 最近更新

- 集成Pollinations AI API，实现真实AI图像生成
- 添加批量生成功能，一次生成3张图像
- 添加20秒倒计时显示，提升用户体验
- 优化图片加载逻辑，提高加载成功率
- 添加多语言支持，支持中文、英文、日文和韩文

## 贡献指南

欢迎对项目进行贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

MIT License 