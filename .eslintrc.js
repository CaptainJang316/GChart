module.exports = {
    parser: "@typescript-eslint/parser", // TypeScript 파서를 사용합니다.
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended", // TypeScript 관련 규칙 추가
      "plugin:prettier/recommended", // Prettier와 ESLint 통합
    ],
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
      "prettier/prettier": "error", // Prettier 규칙 위반 시 ESLint 오류 발생
      "react/react-in-jsx-scope": "off", // React 17 이상일 경우 필요 없음
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  