import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar, FaStarHalfAlt } from "react-icons/fa";
import supabase from "../supabase-client";
import "./FoodDetail.css";

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  useEffect(() => {
    const fetchFoodDetails = async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching food details:", error);
      } else {
        setFood(data);
        setUpvotes(data.upvotes || 0);
        setReviews(data.reviews || []); // Ensure reviews are set as an array
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from("foods")
      .update({
        upvotes: upvotes + 1,
      })
      .eq("id", id);

    if (error) {
      console.error("Error adding upvote:", error);
    } else {
      setUpvotes(upvotes + 1);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const updatedReviews = [...(reviews || []), { content: newComment }];

    const { data, error } = await supabase
      .from("foods")
      .update({ reviews: updatedReviews })
      .eq("id", id);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setReviews(updatedReviews); // Update the state with the new reviews
      setNewComment(""); // Clear the input field
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("foods")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting food item:", error);
    } else {
      // Redirect to home page or show a success message
      window.location.href = "/home";
    }
  };

  if (!food) {
    return <div className="loading">Loading...</div>;
  }

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    
    return stars;
  };

  return (
    <div className="food-detail">
      <Link to="/home" className="back-link">
        <FaArrowLeft /> Back to all foods
      </Link>
      
      <div className="food-detail-header">
        <div className="food-image-placeholder">
          {food.image_url ? (
            <img src={food.image_url} alt={food.food_name} />
          ) : (
            <div className="placeholder-icon"></div>
          )}
        </div>
        
        <div className="food-info">
          <div className="category-tags">
            {food.categories && food.categories.map((category, index) => (
              <span key={index} className="category-tag">
                {category}
              </span>
            ))}
            {food.featured && (
              <span className="category-tag featured">Featured</span>
            )}
          </div>
          
          <h1>{food.food_name}</h1>
          
          <div className="food-rating">
            <span className="review-count">({food.review_count || reviews.length} reviews)</span>
          </div>
          
          <p className="food-description">{food.description}</p>
          
          <div className="food-meta">
            <div className="meta-item">
              <span className="meta-label">Origin</span>
              <span className="meta-value">{food.origin}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Added by</span>
              <span className="meta-value">{food.added_by || "Alex Johnson"}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Added on</span>
              <span className="meta-value">
                {food.created_at 
                  ? new Date(food.created_at).toLocaleDateString() 
                  : "6/21/2023"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="upvote-section">
        <button className="upvote-button" onClick={handleUpvote}>
          Upvote ({upvotes})
        </button>
        <button className="edit-button" style={{marginLeft: '70px'}}><Link to={`/edit/${id}`} style={{color: 'white', textDecoration: 'none'}}>Edit</Link></button>

        <button className="delete-button" onClick={handleDelete} style={{ marginLeft: '30px' }}>Delete</button>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>
          
          <button className="add-review-button">Add Review</button>
        </div>
        
        {activeTab === "reviews" && (
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p>{review.content}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </div>
        )}
      </div>

      <div className="add-comment-section">
        <textarea
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={handleAddComment}>Submit Comment</button>
      </div>
    </div>
  );
};

export default FoodDetail;