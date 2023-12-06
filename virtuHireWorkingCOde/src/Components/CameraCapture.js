import React, { useState, useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';

const CameraCapture = ({videoFaceDectectionStarted}) => {
  const videoRef = useRef(null);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [videoPosition, setVideoPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);


  // Variable to track whether it's the first image
  const isFirstImageRef = useRef(true);
  var faceRecognitionState = ['Same Person','Same Person','Same Person'];

  const [firstImageState, setFirstImageState] = useState(true);
  const [showUserAlert, setShowUserAlert] = useState('')
  // const [faceRecognitionState, setFaceRecognitionState] = useState(['Same Person','Same Person','Same Person'])
  
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();
  }, []);
  
  useEffect(()=>{

    console.log("started")
    setFirstImageState(false)
    setTimeout(takePicture, 3000)
  
},[])



  function addToFaceRecognitionState(result){
    // var temp = [...faceRecognitionState, result]
    faceRecognitionState.push(result)
    console.log(faceRecognitionState)
    const lastThreeNotSamePerson = faceRecognitionState.slice(-3).every(value => value !== 'Same Person');
    if(lastThreeNotSamePerson){
      setShowUserAlert(faceRecognitionState.slice(-1))
    }

    // console.log(result, temp, faceRecognitionState, "Result")
    // temp.push(result)
    // setFaceRecognitionState(temp)
  }

  const takePicture = async () => {
    try {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;

      canvas.width = video.videoWidth ;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg');
      const blobData = dataURItoBlob(dataUrl);

      const formData = new FormData();
      formData.append('file', blobData);

      // Determine the endpoint based on whether it's the first image
      const endpoint = isFirstImageRef.current ? 'http://localhost:5000/first_image' : 'http://localhost:5000/recognize';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json();
      // console.log(result.result, "result.result")
      if(result.result){
        // if(result.result == 'First image set as known face'){
        //   result.result = "Same Person"
        // }
        addToFaceRecognitionState(result.result)

      }
      // if(result.result  == 'Different Person'){
      //   alert("We are detecting a different person, please ensure you are sitting in appropriate lighting")
      // }

      // Set isFirstImage to false after the first image is captured
      isFirstImageRef.current = false;

      // If it's the first image and it passes, set up a timer to capture images automatically every 10 seconds
        setTimeout(() => {
          takePicture();
        }, 1000);
      
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
  
    // Get the initial mouse position
    let initialX = e.clientX;
    let initialY = e.clientY;
  
    const handleMouseMove = (e) => {
      // Calculate the distance moved by the mouse
      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;
  
      // Update the video position based on the mouse movement
      setVideoPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      }));
  
      // Update the initial mouse position
      initialX = e.clientX;
      initialY = e.clientY;
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
  
      // Remove the event listeners when dragging stops
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  
    // Add event listeners for mousemove and mouseup
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  };

  const handleClick = () => {
    // Proceed to capture the first image
    setFirstImageState(false)
    takePicture();
  };



  return (
    <div>
      <video
  ref={videoRef}
  style={{
    position: 'fixed',
    height: '8rem',
    right: `${-videoPosition.x}px`,
    top: `${videoPosition.y}px`,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: 100
  }}
  autoPlay
  muted
  onMouseDown={handleMouseDown}
/>

<Snackbar
  open={showUserAlert}
  autoHideDuration={3000}
  onClose={()=>setShowUserAlert(false)}
  message={showUserAlert}
  anchorOrigin={{ vertical:'top', horizontal:'left' }}

  // action={action}
/>
      {/* <video  ref={videoRef}   style={{position:'fixed', height:'8rem', right:'0'}} autoPlay muted /> */}
      { firstImageState ? <button onClick={handleClick}  style={{position:'fixed', height:'2rem', flex:'1', flexDirection:'row', top:'15rem'}}>Capture Image</button> 
      : <></>}
      {/* {recognitionResult !== null && (
        <p>{recognitionResult ? recognitionResult : "Different Person"}</p>
      )} */}
    </div>
  );
};

export default CameraCapture;
