/// <reference types="react"/>

declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module '*.html';

// google analytics interface
interface GAFieldsObject {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
}
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
}

interface classAndStyleProps {
  className?: string;
  style?: React.CSSProperties;
}

interface NoArgFn<T> {
  (): T;
}

declare let ga: Function;

declare let hljs: any;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
