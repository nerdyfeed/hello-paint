import React from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';

import '../styles/toolbar.scss';
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Rectangle from '../tools/Rectangle';

function Toolbar() {
  const changeColor = (e) => {
    toolState.setStrokeColor(e.target.value);
    toolState.setFillColor(e.target.value);
  };

  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL();
    console.log(dataUrl);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = canvasState.sessionid + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="toolbar">
      <div>
        <button
          type="button"
          className="toolbar__btn brush"
          onClick={() =>
            toolState.setTool(
              new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid),
            )
          }
        ></button>
        <button
          type="button"
          className="toolbar__btn rectangle"
          onClick={() =>
            toolState.setTool(
              new Rectangle(canvasState.canvas, canvasState.socket, canvasState.sessionid),
            )
          }
        ></button>
        <button
          type="button"
          className="toolbar__btn circle"
          onClick={() => toolState.setTool(new Circle(canvasState.canvas))}
        ></button>
        <button
          type="button"
          className="toolbar__btn eraser"
          onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}
        ></button>
        <button type="button" className="toolbar__btn line"></button>
        <input onChange={(e) => changeColor(e)} type="color" />
      </div>
      <div>
        <button
          type="button"
          className="toolbar__btn undo"
          onClick={() => canvasState.undo()}
        ></button>
        <button
          type="button"
          className="toolbar__btn redo"
          onClick={() => canvasState.redo()}
        ></button>
        <button type="button" className="toolbar__btn save" onClick={() => download()}></button>
      </div>
    </div>
  );
}

export default Toolbar;
