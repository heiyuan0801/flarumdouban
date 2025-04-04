# Flarum 豆瓣信息搜索插件

这个插件允许用户在Flarum编辑器中搜索和插入豆瓣电影信息。

## 功能特点

- 在编辑器工具栏添加豆瓣搜索按钮
- 支持关键词搜索豆瓣电影信息
- 预览电影详细信息
- 以BBCode格式插入电影信息到编辑器

## 安装

使用 Composer 安装此插件：

```bash
composer require doubanapi/flarum-ext-douban
```

## 使用方法

1. 在编辑器工具栏中点击豆瓣搜索图标
2. 在弹出的搜索框中输入关键词
3. 从搜索结果中选择需要的电影
4. 预览电影信息，点击「插入内容」将信息添加到编辑器

## BBCode 格式

插件使用以下BBCode格式插入电影信息：

```
[douban]
标题：电影标题
年份：发行年份
类型：电影类型
导演：导演名称
评分：豆瓣评分
简介：电影简介
[/douban]
```

## 许可证

此插件基于 MIT 许可证发布。