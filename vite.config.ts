import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

export default defineConfig(({mode}) => {
    // 加载 .env 文件
    dotenv.config({path: path.resolve(__dirname, `.env.${mode}`)});

    return {
        plugins: [react()],
        server: {
            proxy: {
                '/api': {
                    target: process.env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});
