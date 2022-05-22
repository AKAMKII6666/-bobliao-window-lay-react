import { ReactElement, CSSProperties } from 'react';

export interface Ibutton {
  name: string;
  callBack: Function;
}

export interface IwlProp {
  title?: string;
  position?: {
    x: number | string;
    y: number | string;
  }; 
  size?: {
    width: number | string;
    height?: number | string;
  };
  buttons?: {
    mode?: string;
    yesCall?: Function;
    noCall?: Function;
    arr?: Array<Ibutton>;
  };
  //是否加入背景
  background?: {
    enabled: boolean;
    //是否点击空白处关闭
    bgClose?: boolean;
  };
  style?: CSSProperties;
  classAdd?: string;
  //关闭回调
  closeCall?: Function;
  //是否不显示关闭按钮
  isNoCloseBtn?: boolean;
  //是否不显示标题
  isNoTitle?: boolean;
  //子组件
  children: ReactElement;
}

//向上级暴露方法的定义
export type useableFuncs = {
  show: (_callback?: Function) => void;
  hide: (_callback?: Function) => void;
};

