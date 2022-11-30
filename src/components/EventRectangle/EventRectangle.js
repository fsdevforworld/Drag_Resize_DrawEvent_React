import React, { useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: inline-block;
  background-color: ${(props) => props.color};
  opacity: 0.5;
  height: 70%;
  width: ${(props) => props.width};
  left: ${(props) => props.left};
  top: 8%;
  border-radius: 10px;
`;

const LeftBorder = styled.div`
  float: left;
  cursor: col-resize;
  width: 10px;
  height: 100%;
  z-index: 100;
  transform: translate(-5px);
`;

const RightBorder = styled.div`
  float: right;
  cursor: col-resize;
  width: 10px;
  height: 100%;
  z-index: 100;
  transform: translate(5px);
`;

const EventRectangle = ({ color, left = 0, width = 0, handleBorder }) => {
  const ref = useRef();
  return (
    <Container color={color} left={left} width={width} ref={ref}>
      <RightBorder onMouseDown={(e) => handleBorder(e, ref)} />
      <LeftBorder onMouseDown={(e) => handleBorder(e, ref)} />
    </Container>
  );
};

export default EventRectangle;
