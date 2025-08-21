import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  /* 其他配置 */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'http://localhost:3001'],

  env: {
    NEXT_PUBLIC_APP_VERSION: version,  // 注入为前端可访问的环境变量
  },
};

export default nextConfig;
