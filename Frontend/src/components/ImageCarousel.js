import React, { useState, useEffect } from 'react';
import './css/ImageCarousel.css';

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    "/images/Image_1.jpg",
    "/images/Image_2.jpg", 
    "/images/Image_3.jpg",
    "/images/Image_4.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <div className="slide-content">
                <img 
                  src={image} 
                  alt={`Slide ${index + 1}`}
                  className="carousel-image"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/800x400/3498db/ffffff?text=Image+${index + 1}`;
                  }}
                />
                <div className="slide-overlay">
                  <h3>Welcome to OPTICO</h3>
                  <p>Transforming HR Management</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-btn prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-btn next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;