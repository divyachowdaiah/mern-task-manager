import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';
import './Home.css'; // Import CSS

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn, user } = authState;

  useEffect(() => {
    document.title = isLoggedIn && user ? `${user.name}'s tasks` : "Task Manager";
  }, [isLoggedIn, user]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className="home-container">
          <img src="/images/logo.png" alt="Logo" className="home-logo" /> {/* Logo in round shape */}
          <Link to="/signup" className="signup-link">
            <span>click here to get your task</span>
            <span className="relative ml-4 text-base">
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          </Link>
        </div>
      ) : (
        <>
          <center><h6 className="header">Here are the tasks listed by {user?.name || "User"}</h6></center>
          <Tasks />
        </>
      )}
    </MainLayout>
  );
};

export default Home;
