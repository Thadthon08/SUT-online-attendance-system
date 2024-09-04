import React from "react";
import { Skeleton } from "antd";

interface CarouselItemProps {
  loading: boolean;
  handleImageLoad: () => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  loading,
  handleImageLoad,
}) => {
  return (
    <div className="bg-[#364d79] text-white flex items-center justify-center w-full h-[300px] 2xl:h-[468px]">
      {loading && <Skeleton.Image className="w-full h-full" />}
      <img
        src="https://placehold.co/300x300"
        className={`w-full h-full object-cover ${loading ? "hidden" : ""}`}
        onLoad={handleImageLoad}
        alt="carousel slide"
      />
    </div>
  );
};

export default CarouselItem;
