import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';

import '../styles/canvas.scss';
import Rectangle from '../tools/Rectangle';

const Canvas = observer(() => {
  const canvasRef = React.useRef();
  const usernameRef = React.useRef();
  const [modal, setModalState] = React.useState(true);
  const params = useParams();

  React.useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    canvasState.setCanvas(canvasRef.current);
    axios.get(`http://localhost:4000/image?id=${params.id}`).then((res) => {
      const img = new Image();
      img.src = res.data;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:4000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));

      socket.onopen = () => {
        console.log('Client connection established');
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: 'connection',
          }),
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} присоединился`);
            break;
          case 'draw':
            drawHandler(msg);
            break;
          default:
            break;
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext('2d');

    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case 'rectangle':
        Rectangle.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.fillColor,
          figure.strokeColor,
        );
        break;
      case 'finish':
        ctx.beginPath();
        break;
      default:
        break;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios
      .post(`http://localhost:4000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((res) => console.log(res.data));
  };

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModalState(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        onMouseDown={(e) => mouseDownHandler(e)}
        ref={canvasRef}
        width={600}
        height={400}
      ></canvas>
    </div>
  );
});

export default Canvas;
