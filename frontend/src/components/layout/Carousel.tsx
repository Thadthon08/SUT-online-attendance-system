import React, { useState } from "react";
import { Carousel, Skeleton } from "antd";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "300px",
  textAlign: "center",
  background: "#364d79",
};

export default function CarouselComponent() {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <Carousel arrows infinite={false}>
      <div>
        <div style={contentStyle}>
          {loading && (
            <Skeleton.Image style={{ width: "100%", height: "300px" }} />
          )}
          <img
            src="https://placehold.co/300x300"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            style={loading ? { display: "none" } : {}}
          />
        </div>
      </div>
      <div>
        <div style={contentStyle}>
          {loading && (
            <Skeleton.Image style={{ width: "100%", height: "300px" }} />
          )}
          <img
            src="https://placehold.co/300x300"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            style={loading ? { display: "none" } : {}}
          />
        </div>
      </div>
      <div>
        <div style={contentStyle}>
          {loading && (
            <Skeleton.Image style={{ width: "100%", height: "300px" }} />
          )}
          <img
            src="https://placehold.co/300x300"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            style={loading ? { display: "none" } : {}}
          />
        </div>
      </div>
      <div>
        <div style={contentStyle}>
          {loading && (
            <Skeleton.Image style={{ width: "100%", height: "300px" }} />
          )}
          <img
            src="https://placehold.co/300x300"
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            style={loading ? { display: "none" } : {}}
          />
        </div>
      </div>
    </Carousel>
  );
}
