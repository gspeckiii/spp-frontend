import React, { useState } from "react"
import Page from "./Page"
import axios from "axios" // Changed from Axios to axios to match the package name
import { Link } from "react-router-dom"

function HomeGuest() {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await axios.post("/api/users", { username, email, password })
      console.log("Registration successful")
    } catch (e) {
      console.error("Error in registration:", e.response ? e.response.data.error : e.message)
    }
  }

  return (
    <Page title="Landing" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Sherman Peck Productions</h1>
          <p className="lead text-muted">I appreciate you for visiting my website and taking some time to view my work. I have organized my products by categories for your browsing pleasure. I hope you find a treasure or two for yourself or a family member or friend. Sharing is caring and contibuting to an artist will not only benefit my passion but hopfully lighten up your life.</p>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
