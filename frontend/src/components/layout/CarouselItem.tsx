import React from "react";
import { Skeleton } from "antd";

interface CarouselItemProps {
  loading: boolean;
  handleImageLoad: () => void;
  imageUrl: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  loading,
  handleImageLoad,
  imageUrl,
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {loading && <Skeleton.Image className="w-full h-full" />}
      <img
        src={imageUrl}
        className={`w-full h-full object-cover ${loading ? "hidden" : ""}`}
        onLoad={handleImageLoad}
        alt="carousel slide"
      />
    </div>
  );
};

export default CarouselItem;
