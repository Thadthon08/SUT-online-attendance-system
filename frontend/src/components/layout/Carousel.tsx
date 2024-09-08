import  { useState } from "react";
import { Carousel } from "antd";
import AnnouncementBar from "./AnnouncementBar";
import CarouselItem from "./CarouselItem";

export default function CarouselComponent() {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <AnnouncementBar />
      <Carousel arrows infinite={false}>
        {[...Array(4)].map((_, index) => (
          <CarouselItem
            key={index}
            loading={loading}
            handleImageLoad={handleImageLoad}
          />
        ))}
      </Carousel>
    </>
  );
}
