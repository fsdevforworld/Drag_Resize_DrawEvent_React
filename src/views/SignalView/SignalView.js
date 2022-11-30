import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { SineWave, EventRectangle } from 'components';

const Container = styled.div`
  position: relative;
`;

// The Overlay is a div that lies on top of the chart to capture mouse events
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

// The chart canvas will be the same height/width as the ChartWrapper
// https://www.chartjs.org/docs/3.2.1/configuration/responsive.html#important-note
const ChartWrapper = styled.div``;

const DrawingEvent = styled.div`
  background-color: blue;
  opacity: 0.5;
  width: 0;
  height: 70%;
  margin-top: 1%;
  border-radius: 10px;
`;

const borderWidth = 10;

const SignalView = () => {
  // Access the height of the chart as chartWrapperRef.current?.clientHeight to determine the height to set on events
  const chartWrapperRef = useRef();
  const overlayRef = useRef();
  const drawingEvent = useRef();

  const [drawing, setDrawing] = useState(false);
  const [events, setEvents] = useState([]);
  const [ctrEvent, setCtrEvent] = useState({});
  const [mode, setMode] = useState({});

  const calculatePos = (event) => {
    return event
      ? {
          x: event.clientX - event.target.offsetLeft,
          y: event.clientY - event.target.offsetTop,
        }
      : {};
  };

  const convertPixel = (percent) => {
    const width = parseInt(
      getComputedStyle(overlayRef.current, null)
        .getPropertyValue('width')
        .replace('px', ''),
      10
    );
    return (width * parseInt(percent.replace('%', ''), 10)) / 100;
  };

  const detectBorder = useCallback(
    (point) => {
      for (let i = 0; i < events.length; i++) {
        const start = convertPixel(events[i].start);
        const duration = convertPixel(events[i].duration);

        if (start <= point.x && start + borderWidth >= point.x)
          return { id: i + 1, side: 'left' };
        if (
          start + duration <= point.x &&
          start + duration + borderWidth >= point.x
        )
          return { id: i + 1, side: 'right' };
      }
      return { side: 'none' };
    },
    [events]
  );

  const handleDragStart = useCallback(
    (event) => {
      const isBorder = detectBorder(calculatePos(event));
      setMode(isBorder);
      //create event
      if (isBorder.side === 'none') {
        setEvents([
          ...events,
          {
            id: events.length + 1,
            start: calculatePos(event).x > 0 ? calculatePos(event).x : 0,
            duration: 0,
            end: calculatePos(event).x > 0 ? calculatePos(event).x : 0,
          },
        ]);
        setDrawing(true);
      }
    },
    [detectBorder, events]
  );

  const handleDrag = useCallback(
    (event) => {
      if (drawing) {
        //draw
        if (mode.side === 'none') {
          if (calculatePos(event).x >= events[events.length - 1].start)
            drawingEvent.current.style.cssText += `; width: ${
              calculatePos(event).x - events[events.length - 1].start
            }px; margin-left: ${events[events.length - 1].start}px;`;
          else
            drawingEvent.current.style.cssText += `; width: ${
              events[events.length - 1].start - calculatePos(event).x
            }px; margin-left: ${calculatePos(event).x}px;`;
        }
      } else if (mode.id) {
        const winWidth = 100 / overlayRef.current.offsetWidth;
        const start = convertPixel(events[mode.id - 1].start);
        const end = convertPixel(events[mode.id - 1].end);

        if (mode.side === 'right')
          ctrEvent.current.style.cssText += `; width: ${
            calculatePos(event).x - start
          }px;`;
        else
          ctrEvent.current.style.cssText += `; width: ${
            (end - calculatePos(event).x) * winWidth
          }%; left: ${calculatePos(event).x * winWidth}%`;
      }
    },
    [drawing, mode.side, mode.id, events, ctrEvent]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const winWidth = 100 / overlayRef.current.offsetWidth;
      if (mode.id) {
        const start = convertPixel(events[mode.id - 1].start);
        const end = convertPixel(events[mode.id - 1].end);

        if (mode.side === 'right') {
          setEvents(
            events.map((e) =>
              e.id === mode.id
                ? {
                    ...e,
                    duration: (calculatePos(event).x - start) * winWidth + '%',
                    end: calculatePos(event).x * winWidth + '%',
                  }
                : e
            )
          );
        } else {
          ctrEvent.current.style.cssText += `; width: ${
            (end - calculatePos(event).x) * winWidth
          }%; left: ${calculatePos(event).x * winWidth}%;`;

          setEvents(
            events.map((e) =>
              e.id === mode.id
                ? {
                    ...e,
                    duration: (end - calculatePos(event).x) * winWidth + '%',
                    start: calculatePos(event).x * winWidth + '%',
                  }
                : e
            )
          );
        }
      } else {
        setEvents(
          events.map((e) =>
            e.id === events.length
              ? calculatePos(event).x >= e.start
                ? {
                    ...e,
                    start: e.start * winWidth + '%',
                    duration:
                      (calculatePos(event).x - e.start) * winWidth + '%',
                    end: calculatePos(event).x * winWidth + '%',
                  }
                : {
                    ...e,
                    start: calculatePos(event).x * winWidth + '%',
                    duration:
                      (e.start - calculatePos(event).x) * winWidth + '%',
                    end: e.start * winWidth + '%',
                  }
              : e
          )
        );
      }
      setDrawing(false);
    },
    [mode.id, mode.side, events, ctrEvent]
  );

  const handleOverlayClick = (event) => {
    // Prevent the event from bubbling up to the chart
    event.stopPropagation();
    event.preventDefault();
  };

  const handleBorder = (event, ref) => {
    event.stopPropagation();
    setCtrEvent(ref);
  };

  return (
    <Container>
      <ChartWrapper ref={chartWrapperRef}>
        <SineWave samplingRate={50} lowerBound={0} upperBound={10} />
      </ChartWrapper>
      {/* The overlay covers the same exact area the sine wave chart does */}
      <Overlay onClick={handleOverlayClick}>
        {/* You can place events in here as children if you so choose */}
        <Overlay
          onClick={handleOverlayClick}
          draggable="true"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          ref={overlayRef}
        >
          {drawing
            ? events
                .slice(0, events.length - 1)
                .map((event) => (
                  <EventRectangle
                    key={event.id}
                    left={event.start}
                    width={event.duration}
                    color="green"
                  />
                ))
            : events.map((event) => (
                <EventRectangle
                  key={event.id}
                  left={event.start}
                  width={event.duration}
                  color="green"
                  handleBorder={handleBorder}
                />
              ))}
          {drawing && <DrawingEvent ref={drawingEvent} />}
        </Overlay>
      </Overlay>
    </Container>
  );
};

export default SignalView;
