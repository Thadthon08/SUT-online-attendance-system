import { useState } from "react";
import { Carousel } from "antd";
import AnnouncementBar from "./AnnouncementBar";
import CarouselItem from "./CarouselItem";

export default function CarouselComponent() {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  // Define your image URLs here
  const imageUrls = [
    "https://www.sut.ac.th/images/upload/banner/1251/1251/banner.jpg",
    "https://www.sut.ac.th/images/upload/banner/1261/1261/banner.jpg",
    "https://www.sut.ac.th/images/upload/banner/1245/1245/banner.jpg",
    "https://www.sut.ac.th/images/upload/banner/1234/1234/banner.jpg"
  ];

  return (
    <>
      <AnnouncementBar />
      <Carousel arrows infinite={false}>
        {imageUrls.map((url, index) => (
          <CarouselItem
            key={index}
            loading={loading}
            handleImageLoad={handleImageLoad}
            imageUrl={url}
          />
        ))}
      </Carousel>
    </>
  );
}
