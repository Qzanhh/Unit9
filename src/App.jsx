import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Layout from './layout/layout';
import FoodDetail from './pages/FoodDetail';
import EditPage from './pages/EditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path ="/home" element={<HomePage />} />
          <Route path ="/create" element={<CreatePost />} />
          <Route path ="/profile" element={<Profile />} />
          <Route path ="/home/:id" element={<FoodDetail />} />
          <Route path ="/edit/:id" element={<EditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
