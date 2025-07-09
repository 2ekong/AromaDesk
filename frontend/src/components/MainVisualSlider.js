import React, { useEffect, useRef, useState } from 'react';
import './MainVisualSlider.css';

const slides = [
  {
    image: process.env.PUBLIC_URL + '/images/main1.jpg',
    text: '향기로 기억되는 순간.',
    bgColor: 'rgba(80,80,80,0.38)',
    // 더 은은한 회색
  },
  {
    image: process.env.PUBLIC_URL + '/images/main2.jpg',
    text: '순간을 영원처럼, 향기로 담다.',
    bgColor: 'rgba(220,120,60,0.22)',
    // 더 은은한 주황/브라운
  },
];

function MainVisualSlider() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000); // 7초로 변경
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  return (
    <div className="main-visual-slider">
      {slides.map((slide, idx) => (
        <div
          className={`slide${idx === current ? ' active' : ''}`}
          key={idx}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-bg-overlay" style={{ background: slide.bgColor }} />
          <div className="slide-text">{slide.text}</div>
        </div>
      ))}
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? 'dot active' : 'dot'}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default MainVisualSlider; 