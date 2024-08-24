import React from "react";
import { Skeleton } from "antd";

interface CarouselItemProps {
  loading: boolean;
  handleImageLoad: () => void;
}

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "300px",
  textAlign: "center",
  background: "#364d79",
};

const CarouselItem: React.FC<CarouselItemProps> = ({
  loading,
  handleImageLoad,
}) => {
  return (
    <div style={contentStyle}>
      {loading && <Skeleton.Image style={{ width: "100%", height: "300px" }} />}
      <img
        src="https://placehold.co/300x300"
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        style={loading ? { display: "none" } : {}}
        alt="carousel slide"
      />
    </div>
  );
};

export default CarouselItem;
