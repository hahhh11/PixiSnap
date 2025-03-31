/*
 * @Author: 98Precent
 * @Date: 2025-03-31 10:30:06
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 12:03:26
 * @FilePath: /PixiSnap/scripts/generate-manifest.mjs
 */

import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const MANIFEST_PATH = path.join(__dirname, '../src/manifest.json');

// 类型映射表
const TYPE_MAP = {
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.webp': 'image',
    '.mp3': 'audio',
    '.ogg': 'audio',
    '.json': 'json'
};

function generateManifest() {
    const bundles = [];

    try {
        // 1. 遍历assets下的所有一级子目录
        const bundleDirs = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // 2. 为每个目录创建bundle
        for (const dirName of bundleDirs) {
            const bundlePath = path.join(ASSETS_DIR, dirName);
            const resources = [];

            // 3. 扫描目录内的文件
            fs.readdirSync(bundlePath).forEach(file => {
                const filePath = path.join(bundlePath, file);
                const stats = fs.statSync(filePath);

                if (stats.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    resources.push({
                        id: path.basename(file, ext), // 去除扩展名的文件名作为id
                        src: `./assets/${dirName}/${file}`,
                        type: TYPE_MAP[ext] || 'unknown'
                    });
                }
            });

            if (resources.length > 0) {
                bundles.push({
                    name: dirName,
                    resources
                });
            }
        }

        // 4. 写入manifest文件
        fs.writeJsonSync(MANIFEST_PATH, { bundles }, { spaces: 2 });
        console.log('✅ Manifest updated with', bundles.length, 'bundles');
    } catch (err) {
        console.error('⚠️ Manifest generation failed:', err);
    }
}

// 开发模式下监听文件变化
if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(ASSETS_DIR, {
        ignored: /(^|[\/\\])\../, // 忽略隐藏文件
        persistent: true,
        ignoreInitial: true
    });

    watcher
        .on('add', path => handleFileChange('add', path))
        .on('unlink', path => handleFileChange('unlink', path))
        .on('ready', () => console.log('🔭 Watching assets directory...'));
}

function handleFileChange(event, filePath) {
    console.log(`📦 File ${event}: ${path.relative(ASSETS_DIR, filePath)}`);
    generateManifest();
}

// 初始生成
generateManifest();