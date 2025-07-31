import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
// 引入处理未使用导入的插件
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { ignores: ["dist", "src/store/MusicStore.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    // 添加 unused-imports 插件
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports, // 新增：未使用导入插件
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // 新增：处理未使用导入的规则
      "unused-imports/no-unused-imports": "error", // 检测并报错未使用的导入
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      // 覆盖 TypeScript 自带的 no-unused-vars 规则（避免冲突）
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
