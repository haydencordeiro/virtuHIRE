import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPlayerRealtime from "./Components/VideoPlayerRealtime";
// import TrackerCharts from "./Components/TrackerCharts";
import CameraCapture from './Components/CameraCapture'
import LeaderboardComponent from './Components/LeaderboardComponent'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VideoPlayerRealtime />} />
          <Route path="/leaderboard" element={<LeaderboardComponent />} />

        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
