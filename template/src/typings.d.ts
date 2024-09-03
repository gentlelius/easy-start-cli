// 引入文件报错未声明时，在此处申明即可
declare const BASE_URL: string;
declare const APP_ENV: string;

// 资源声明
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

// 样式声明
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';

type RefPort = (ref: FormInstance) => void;
type RefType = FormInstance;
