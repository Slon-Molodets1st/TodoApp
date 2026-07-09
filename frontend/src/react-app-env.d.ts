// src/react-app-env.d.ts
/// <reference types="react-scripts" />

// Обработка CSS файлов
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Обработка CSS модулей
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Обработка изображений
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.tiff' {
  const src: string;
  export default src;
}

declare module '*.woff';
declare module '*.woff2';
declare module '*.ttf';
declare module '*.eot';