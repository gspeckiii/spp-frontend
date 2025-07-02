import React, { useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"
import CategorySlider from "./CategorySlider"

function Home() {
  const { loggedIn, user } = useContext(StateContext)

  return (
    <div className="home">
      <div className="page-section--background">
        <div className="page-section--pull-down">
          <div className="home__content">
            <h1 className="home__title">Welcome to Sherman Peck Productions</h1>
            {loggedIn ? (
              <>
                <p className="home__greeting">Hello, {user.username}! Explore our categories below.</p>
                <CategorySlider />
              </>
            ) : (
              <>
                <p className="home__intro">Discover our curated collection of products. Sign in to explore more or browse our categories below.</p>
                <Link to="/register" className="home__register-link">
                  Create an Account
                </Link>
                <CategorySlider />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
