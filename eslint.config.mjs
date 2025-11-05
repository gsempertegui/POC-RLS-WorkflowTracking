import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import jest from 'eslint-plugin-jest';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    // Configuración específica para archivos de Node.js como babel.config.js
    files: ["babel.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs", // Asegura que se reconoce la sintaxis de CommonJS
    },
  },  
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },    
  },
  {
    // Configuraciones base para todos los archivos
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect", // Le dice al plugin que detecte la versión de React
      },
    },
    rules: {
      // Deshabilita la regla `react/react-in-jsx-scope` para JSX Runtime
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      'react/jsx-uses-react': 'off', // Also disable this related rule      
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-duplicate-head': 'off',
      'no-unused-vars': 'off',

      // Corrige el error de 'error' is of type 'unknown'
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
        },
      ],
    },
  },
{
    // Definir los patrones de archivo para pruebas
    files: [
        'src/**/*.test.js', 
        'src/**/*.test.jsx', 
        'src/**/*.test.ts', 
        'src/**/*.test.tsx', 
        'src/tests/**' // Carpeta de pruebas específica como la que usaste
    ],
    
    // Habilitar y configurar el plugin
    plugins: {
      jest,
    },
    
    // 4. Usar las reglas recomendadas y de buenas prácticas
    ...jest.configs['flat/recommended'], // Reglas esenciales
    ...jest.configs['flat/style'],     // Reglas de estilo
    
    // Especificar el entorno (globals)
    languageOptions: {
      globals: {
        ...globals.jest, // Habilita variables globales de Jest (describe, test, expect, etc.)
      },
    },
    
    // Sobrescribir o añadir reglas específicas
    rules: {
      // Ejemplo: Requerir que el bloque 'expect' esté dentro de 'test' o 'it'
      'jest/valid-expect': 'error', 
      
      // Ejemplo: Deshabilitar la regla de exportación predeterminada en archivos de prueba
      'import/no-default-export': 'off', 
    },
  },  
];