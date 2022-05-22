import 'react-app-polyfill/ie11';
import  React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as ReactDOM from 'react-dom';
import WindowLayReact from '../.';
import { useableFuncs } from '../dist/iWindow';

const App = () => {
  const wl = useRef<useableFuncs>(null);

  return (
    <div>
      <button onClick={function () { 
        wl.current?.show(function () { });
      }} >open window</button>
      <WindowLayReact  ref={wl}>
        <div>this is content</div>
      </WindowLayReact>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
