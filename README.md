# 给宝宝的一封信

一个浪漫的动态情书网页，为 520 而做。

## 快速开始

```bash
npm install
npm run dev
```

然后在浏览器中打开 http://localhost:5173

## 自定义内容

所有可编辑的内容都集中在 `src/data/letter.js` 中：

- **recipient** — 称呼（宝宝）
- **passphrase** — 进入暗号
- **sections** — 情书正文段落
- **photos** — 照片路径和占位文字
- **promises** — 未来约定列表
- **finalText / easterEggText** — 最后告白和彩蛋

## 添加照片

把照片放在 `public/photos/` 文件夹中：

```
public/photos/photo-1.jpg
public/photos/photo-2.jpg
public/photos/photo-3.jpg
```

## 添加音乐

把音乐文件放在 `public/music/` 文件夹中：

```
public/music/gentle.mp3
```

## 构建部署

```bash
npm run build
npm run deploy
```

部署到 GitHub Pages：https://jerry-pixel310.github.io/love-yxr/

## 测试

```bash
npm test
```

