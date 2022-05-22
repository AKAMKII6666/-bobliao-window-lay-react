# 一個彈出窗口的React組件

使用方法:
```javascript
import WindowLay from '@bobliao/window-lay-react';
import { useableFuncs } from '@bobliao/window-lay-react';

const App = () => {
  const wl = useRef<useableFuncs>(null);

  return (
    <div>



      <button onClick={function () { 
        /*
        *   顯示窗口內容
        */
        wl.current?.show(function () { 
            /*
            * 顯示動畫之後觸發的回調函數
            */
        });
      }} >open window</button>



      <WindowLayReact 
        //标题
        title = {''},
        //位置
        position = {{
            x: 'center',
            y: 'center',
        }}

        //大小
        size ={ {
            width: 450,
            height: 'auto',
        }}
        
        //按钮设置
        buttons = {{
            //none为没有按钮
            //yes为只有确认键
            //yesno为确定和取消
            //free为自定义
            mode: 'none',
            yesCall: function() {},
            noCall: function() {},
            arr: [],
        }}

        //是否加入背景
        background = {{
            enabled: true,
            //是否点击空白处关闭
            bgClose: false,
        }}

        //附加杭样式
        style = {''}

        //附加样式表
        classAdd = {''}

        //关闭回调
        closeCall = {function() {}}

        //是否不显示关闭按钮
        isNoCloseBtn = {false}

        //是否不显示标题
        isNoTitle = {false}
        
        ref={wl}
      >
        <div>this is content</div>
      </WindowLayReact>


    </div>
  );
};


```