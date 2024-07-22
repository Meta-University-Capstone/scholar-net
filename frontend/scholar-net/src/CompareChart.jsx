import React from "react";
import { Link } from "react-router-dom";

function CompareChart() {
    return (
        <>
        <h1>Compare Students</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>
        </>
      )
}

export default CompareChart
