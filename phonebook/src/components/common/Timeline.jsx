import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { motion } from "framer-motion";

import "../common/css/Timeline.css";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

import TimelineLogo from "../../assets/images/TimelineLogo.png";

const timelineData = [
  {
    year: "1981",
    image: TimelineLogo,
    text: "Company launched",
  },
  {
    year: "2001",
    text: "B2B portal launched",
  },
  {
    year: "2002",
    text: "Trade leads section started",
  },
  {
    year: "2003",
    text: "CRM operations started",
  },
  {
    year: "2005",
    text: "Expansion milestone",
  },
  {
    year: "2008",
    text: "Digital platform growth",
  },
  {
    year: "2010",
    text: "International expansion",
  },
  {
    year: "2015",
    text: "Major technology upgrade",
  },
];

const Timeline = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="timeline-section">

      <div className="container">

        <h2 className="timeline-title text-center">
          Our Journey
        </h2>

        <div className="timeline-wrapper">

          {/* Animated Progress Line */}

          <div className="timeline-line">
            <motion.div
              className="timeline-progress"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={40}
            grabCursor={true}

            onSlideChange={(swiper) => {
              const percent =
                (swiper.activeIndex /
                  (timelineData.length - 1)) *
                100;
              setProgress(percent);
            }}

            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
            }}

            className="timeline-swiper"
          >
            {timelineData.map((item, index) => (
              <SwiperSlide key={index}>

                <motion.div
                  className="timeline-item"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >

                  <div className="timeline-dot"></div>

                  <div className="timeline-card">

                    <div className="timeline-year">
                      {item.year}
                    </div>

                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="timeline-img"
                      />
                    ) : (
                      <p className="timeline-text">
                        {item.text}
                      </p>
                    )}

                  </div>

                </motion.div>

              </SwiperSlide>
            ))}
          </Swiper>

        </div>

      </div>

    </section>
  );
};

export default Timeline;