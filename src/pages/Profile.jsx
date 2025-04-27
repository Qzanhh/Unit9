import { useState, useEffect } from 'react';
import './Profile.css';
import FoodCard from '../components/FoodCard'
import supabase from '../supabase-client';

const Profile = () => {
  const [foodItems, setFoodItems] = useState([]);

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
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src="https://via.placeholder.com/100" alt="Profile" />
        <h1>John Doe</h1>
        <p>@johndoe</p>
      </div>
      <div className="profile-actions">
        <button>Edit Profile</button>
        <button>Settings</button>
      </div>
      <div className="profile-tabs">
        <button className="active">Posts</button>
        <button>Reviews</button>
      </div>
      <div className="profile-content">
        <p>No posts yet. Start sharing your food experiences!</p>
      </div>
    </div>
  );
};

export default Profile;