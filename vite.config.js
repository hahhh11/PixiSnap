/*
 * @Author: 98Precent
 * @Date: 2025-03-29 12:26:38
 * @LastEditors: Do not edit
 * @LastEditTime: 2025-03-31 10:38:57
 * @FilePath: /PixiSnap/vite.config.js
 */
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    server: {
        fs: {
            allow: [path.resolve(__dirname, '..')]// 允许访问项目根目录
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@utils': path.resolve(__dirname, './src/utils'),
        }
    }
})
