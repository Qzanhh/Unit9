import React from "react";
import { Link } from "react-router-dom";
import "./FoodCard.css";

const FoodCard = ({ id, name, description, tags = [], image, creationTime, upvotes, origin, categories = [] }) => {
  const getTimeDifference = (creationTime) => {
    const now = new Date();
    const createdTime = new Date(creationTime);
    const diffInMinutes = Math.floor((now - createdTime) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <Link to={`/home/${id}`} className="food-card-link">
      <div className="food-card">
        <div className="food-image-placeholder">
          <img src={image} alt={name} className="food-image" />
        </div>
        <div className="food-details">
          <h2>{name}</h2>
          <p>{description}</p>
          <div className="food-meta">
            <div className="creation-time">Created: {getTimeDifference(creationTime)}</div>
            <div className="upvotes">Upvotes: {upvotes}</div>
          </div>
          <div className="food-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="food-badges">
            <span className="badge origin-badge">{origin}</span>
            {categories.slice(0, 2).map((category, index) => (
              <span key={index} className="badge category-badge">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;