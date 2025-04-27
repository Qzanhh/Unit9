import React, { useEffect, useState } from "react";
import "./HomePage.css";
import FoodCard from "../components/FoodCard";
import supabase from "../supabase-client";

const HomePage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("Highest Rated");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data, error } = await supabase.from("foods").select("*");
        console.log(data);
        if (error) {
          throw new Error(error.message);
        }
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
    // console.log(foodItems);
  }, []);

  const filteredAndSortedFoods = foodItems
    .filter((item) =>
      item.food_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "Highest Rated") {
        return b.upvotes - a.upvotes;
      } else if (sortOption === "Most Recent") {
        return new Date(b.creation_time) - new Date(a.creation_time);
      }
      return 0; // No sorting for "Featured"
    });

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Rate My Food</h1>
        <p>
          Discover and rate delicious food from around the world. Share your culinary
          experiences and see what others think about your favorite dishes.
        </p>
      </header>
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search foods..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="sort-dropdown"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option>Highest Rated</option>
          <option>Most Recent</option>
          <option>Featured</option>
        </select>
      </div>
      <div className="food-grid">
        {filteredAndSortedFoods.map((item, index) => (
          <FoodCard
            key={index}
            name={item.food_name}
            description={item.description}
            tags={item.tags}
            image={item.image_url || '/public/Food-hub.svg'} // Fallback to placeholder image
            creationTime={item.creation_time}
            categories={item.categories}
            origin={item.origin}
            id={item.id}
            upvotes={item.upvotes}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;