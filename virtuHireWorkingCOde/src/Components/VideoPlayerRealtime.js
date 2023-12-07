import React, { useState, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from "axios";
import CameraCapture from './CameraCapture'
import poster from "../assets/raw/poster.png";
import input_video from "../assets/raw/female_avatar.mp4";

import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import { debounce } from 'lodash';


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const VideoPlayerRealtime = () => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const [playingOutputVideo, setPlayingOutputVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState("muted");
  const [isRecording, setIsRecording] = useState(false);
  
  // Video Face Detection
  const [videoFaceDectectionStarted, setVideoFaceDectectionStarted] = useState(false)

  recognition.continuous = true;
  recognition.lang = "en-US";
  recognition.interimResults = true; // Set to true for interim results

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const finalTranscript = event.results[i][0].transcript;
        inputRef.current.value = finalTranscript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // console.log("We have the results sire")
    debouncedHandleSendClick()
    // If you want to display interim results, you can use interimTranscript
  };

  const startSpeechRecognition = () => {
    recognition.start();
    setIsRecording(true);
  };

  const stopSpeechRecognition = () => {
    recognition.stop();
    setIsRecording(false);

  };

  const handleVideoEnd = () => {
    setPlayingOutputVideo(false);
    videoRef.current.src = input_video;

    videoRef.current.play().catch((error) => {
      console.error("Video play error:", error);
    });
  };

  const handleSendClick = async () => {
    setMuted("");
    setLoading(true);
    const inputText = inputRef.current.value;

    try {
      const response = await axios.post(
        "https://saravananchandrasekaran.com/avatar/api_gen_video.php",
        {
          input_text: inputText,
        }
      );

      const videoUrl = response.data.video_url;

      setLoading(false);
      setPlayingOutputVideo(true);
      videoRef.current.src = videoUrl;

      videoRef.current.play().catch((error) => {
        console.error("Video play error:", error);
      });
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const debouncedHandleSendClick = debounce(handleSendClick, 1000); // Adjust the debounce delay as needed

  const handleStartInterview = () =>{
    setVideoFaceDectectionStarted(true)
  }

  return (
    <div style={{ overflow: "auto", height: "100vh" }}>
      <div
        className="question-card"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <label htmlFor="languageSelect" style={{ flex: "1" }}>
          VirtuHire
        </label>
      </div>
      {videoFaceDectectionStarted && <CameraCapture videoFaceDectectionStarted = {videoFaceDectectionStarted}></CameraCapture>}
      
      <div style={{ textAlign: "-webkit-center" }}>
        <video
          ref={videoRef}
          src={input_video}
          controls={false}
          style={{ width: "80%", maxWidth: "800px", maxHeight:"37rem" }}
          poster={poster}
          autoPlay
          muted={muted}
          onEnded={handleVideoEnd}
        />
      </div>

      {/* Mic, Text Input, and Send Button */}
      <div
        className="input-container"
        style={{
          display: "flex",
          flexDirection: "horizontal",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={isRecording ? <StopCircleIcon />  :<MicIcon />}
          onMouseDown={startSpeechRecognition}
          onMouseUp={stopSpeechRecognition}
          disabled = {!videoFaceDectectionStarted}
        >
          Mic
        </Button>

        <input
          placeholder="Chat"
          style={{ flex: 1, marginLeft: "10px", marginRight: "10px" }}
          ref={inputRef}
        />
        {
          videoFaceDectectionStarted ?
          <LoadingButton
          loading={loading}
          loadingPosition="start"
          onClick={handleSendClick}
          startIcon={<SendIcon />}
          variant="outlined"
        >
          Submit
        </LoadingButton>
        :
        <LoadingButton
        loading={loading}
        loadingPosition="start"
        onClick={handleStartInterview}
        startIcon={<SendIcon />}
        variant="outlined"
      >
        Start Interview
      </LoadingButton>
        }
      </div>
    </div>
  );
};

export default VideoPlayerRealtime;
