import React, { useState } from "react";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CreatePost.css";
import supabase from "../supabase-client";

const CreatePost = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log(supabase);

  const handleAddCategory = () => {
    if (category && !categories.includes(category)) {
      setCategories([...categories, category]);
      setCategory("");
    }
  };

  const handleCategoryInputChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const inputCategories = e.target.value.split(",").map((cat) => cat.trim());
    setCategories(inputCategories);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodName || !description || !origin || categories.length === 0 || !image) {
      alert("All fields are required. Please fill out the form completely.");
      return;
    }
    const response = await fetch(image);
    const blob = await response.blob();
    const fileName = `foods/${Date.now()}.png`; // Create a unique filename

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('food-images') // your bucket name
      .upload(fileName, blob);
    if (uploadError) {
      throw uploadError;
    }

    // Step 2: Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('food-images')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Step 3: Insert into 'foods' table
    const { data, error } = await supabase
      .from('foods')
      .insert([
        {
          food_name: foodName,
          description,
          origin,
          categories, // assuming 'categories' is a text[] array in your DB
          image_url: imageUrl,
          creation_time: new Date().toISOString(), // Add creation time
        },
      ]);

    if (error) {
      throw error;
    }

    alert("Food added successfully!");
    console.log('Inserted food:', data);

    // Handle form submission logic here
    // await supabase().from("")
    // console.log({ foodName, description, origin, categories, image });
    setFoodName("");
    setDescription("");
    setOrigin("");
    setCategories([]);
    setImage(null);
    setCategory("");
  };

  return (
    <div className="create-post">
      <Link to="/home" className="back-link">
        <FaArrowLeft /> Back to all foods
      </Link>
      
      <h1>Add New Food</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Food Name</label>
          <input
            type="text"
            placeholder="Enter food name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe the food..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Origin</label>
          <input
            type="text"
            placeholder="Where is this food from?"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Categories</label>
          <div className="add-category-inline">
            <input
              type="text"
              placeholder="Add a category"
              value={category}
              onChange={handleCategoryInputChange}
            />
            <button type="button" onClick={handleAddCategory} className="add-category-button">
              Add
            </button>
          </div>
          {categories.length > 0 && (
            <div className="selected-categories">
              {categories.map((cat, index) => (
                <span key={index} className="category-tag">
                  {cat}
                  <button 
                    type="button"
                    onClick={() => setCategories(categories.filter((_, i) => i !== index))}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Food Image</label>
          <div className="image-upload">
            {image ? (
              <img src={image} alt="Uploaded Preview" className="uploaded-image" />
            ) : (
              <>
                <FaImage className="image-icon" />
                <p className="upload-text">Click to upload or drag and drop</p>
              </>
            )}
            <button type="button" className="select-image-btn">
              Select Image
            </button>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>
        </div>

        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Add Food
        </button>
      </form>
    </div>
  );
};

export default CreatePost;