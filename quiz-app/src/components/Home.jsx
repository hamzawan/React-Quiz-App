import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Icon from "@mdi/react";
import { mdiCube } from "@mdi/js";
import { Link } from "react-router-dom";

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Quiz App - Home</title>
    </Helmet>
    <div id="home">
      <section>
        <div style={{textAlign:'center'}}>
          <span><Icon path={mdiCube} color="#ffbb00" size={4} /></span>
        </div>
        <h1>Quiz App</h1>
        <div className="play-button-container">
          <ul>
            <li>
              <Link className="play-button" to="/play/quiz">Play</Link>
            </li>
          </ul>
        </div>
        <div className="auth-container">
            <Link to="/login" className="auth-button" id="login-button">Login</Link>
            <Link to="/register" className="auth-button" id="signup-button">Sign Up</Link>
        </div>
      </section>
    </div>
  </Fragment>
);

export default Home;
