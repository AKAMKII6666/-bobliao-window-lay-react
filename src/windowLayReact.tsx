/**
 * 廖力编写
 * 2022/03/24
 * 弹出窗口组件
 */
import { IwlProp, useableFuncs } from './iWindow';
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import _windowLay from './windowLay.js';
import useJquery, {
  jQueryObject,
  isRunningInServer,
} from '@bobliao/use-jquery-hook';

/**
 * 将组件引用出去
 */
const WindowLayReact = forwardRef<useableFuncs, IwlProp>(
  (
    {
      /**
       * 默认参数集合
       */
      children = null,
      //标题
      title = '',
      //位置
      position = {
        x: 'center',
        y: 'center',
      },
      //大小
      size = {
        width: 450,
        height: 'auto',
      },
      //按钮设置
      buttons = {
        //none为没有按钮
        //yes为只有确认键
        //yesno为确定和取消
        //free为自定义
        mode: 'none',
        yesCall: function() {},
        noCall: function() {},
        arr: [],
      },
      //是否加入背景
      background = {
        enabled: true,
        //是否点击空白处关闭
        bgClose: false,
      },
      //附加杭样式
      style = '',
      //附加样式表
      classAdd = '',
      //关闭回调
      closeCall = function() {},
      //是否不显示关闭按钮
      isNoCloseBtn = false,
      //是否不显示标题
      isNoTitle = false,
    },
    _ref
  ): React.ReactElement => {
    const $ = useJquery();

    const replaceContent = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [container, setContainer] = useState<jQueryObject>(null);
    //因为这个组件(_windowLay)不是typescript组件,所以无法强制使用类型
    //这里用any算了
    const [curWindowLay, setCurWindowLay] = useState<any>(null);

    //隐藏窗口
    const hide = function(_callback: Function = function() {}): void {
      if (curWindowLay !== null) {
        curWindowLay.close();
        setCurWindowLay(null);
        _callback();
      }
    };

    //显示窗口
    const show = async function(
      _callback: Function = function() {}
    ): Promise<void> {
      var _container = $('<div></div>');

      var w = new _windowLay({
        //标题
        title: title,
        //内容
        content: _container,
        //放置的容器
        container: 'body',
        //位置
        position: position,
        //大小
        size: size,
        //按钮设置
        buttons: {
          mode: buttons.mode,
          yesCall: buttons.yesCall,
          noCall: buttons.noCall,
          yesText: 'Yes',
          noText: 'No',
          arr: buttons.arr,
        },
        //是否加入背景
        background: background,
        style: style,
        classAdd: classAdd,
        //关闭回调
        closeCall: closeCall,
        //是否不显示关闭按钮
        isNoCloseBtn: isNoCloseBtn,
        //是否不显示标题
        isNoTitle: isNoTitle,
      });
      w.open(_callback);
      await new Promise<number>(function(_res: Function, _rej: Function) {
        ReactDOM.render(children, _container[0], function() {
          w.resize();
          _res();
        });
      });
      setContainer(_container);
      setCurWindowLay(w);
    };

    //暴露方法给上级
    //这里暴露的任何方法都需要定义Types
    //否则在这里写任何方法在Typescript里面是不合法的
    useImperativeHandle(_ref, () => ({
      hide(_callback = function() {}) {
        hide(_callback);
      },
      show(_callback = function() {}) {
        show(_callback);
      },
    }));

    /**
     * ==================================Effects===============================
     */
    useEffect(function(): ReturnType<React.EffectCallback> {
      if (isMounted === false) {
        setIsMounted(true);
      }
      return function(): void {
        setIsMounted(false);
      };
    }, []);

    useEffect(
      function() {
        try {
          //同步更新渲染的组件
          if (container !== null) {
            ReactDOM.render(children, container[0], function() {
              if (curWindowLay !== null) {
                curWindowLay.resize();
              }
            });
          }
        } catch (_e) {}
      },
      [children]
    );

    return (
      <>
        <div ref={replaceContent} style={{ display: 'none' }}>
          {(function() {
            if (isRunningInServer) {
              return children;
            } else {
              return '';
            }
          })()}
        </div>
      </>
    );
  }
);

export default WindowLayReact;
