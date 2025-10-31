import React, { useEffect, useState } from 'react';
import './About.css'; 

const About = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`about-container ${loaded ? 'fade-slide-in' : ''}`}>
      <h1>About Us</h1>
      <hr />
      <p>
        Welcome to Drop Store! We are committed to providing the best online shopping experience with quality products at fair prices.
      </p>
      <p>
        Our mission is to make shopping easy, enjoyable, and accessible for everyone.
      </p>
      <p className="contact">
        Contact us at{" "}
        <a href="mailto:dropstoore1@gmail.com">
          support@dropstore.com
        </a>
      </p>
    </div>
  );
};

export default About;
