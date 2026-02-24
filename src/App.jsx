import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FrameSelection from './components/FrameSelection';
import CameraCapture from './components/CameraCapture';
import ResultPreview from './components/ResultPreview';

import { createContext, useContext } from 'react';

const BoothContext = createContext(null);
export const useBooth = () => useContext(BoothContext);

const AppRoutes = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [frameImage, setFrameImage] = useState(null);
  const [photoSlots, setPhotoSlots] = useState([]);
  const [photos, setPhotos] = useState([]);

  // Full reset — balik ke landing, hapus semua state
  const handleReset = () => {
    setPhotos([]);
    setSelectedTheme(null);
    setSelectedFrame(null);
    setFrameImage(null);
    setPhotoSlots([]);
    navigate('/');
  };

  // Retake — hanya reset photos, frame & slots tetap, langsung ke kamera
  const handleRetake = () => {
    setPhotos([]);
    navigate('/camera');
  };

  const ctxValue = {
    selectedTheme, setSelectedTheme,
    selectedFrame, setSelectedFrame,
    frameImage, setFrameImage,
    photoSlots, setPhotoSlots,
    photos, setPhotos,
    handleReset,
    handleRetake,
  };

  return (
    <BoothContext.Provider value={ctxValue}>
      <div style={{ minHeight: '100vh' }}>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onSelectTheme={(theme) => {
                  setSelectedTheme(theme);
                  navigate('/frame');
                }}
              />
            }
          />

          <Route
            path="/frame"
            element={
              <FrameSelection
                selectedTheme={selectedTheme}
                onBack={() => navigate('/')}
                onSelectFrame={(frame, frameUrl, slots) => {
                  setSelectedFrame(frame);
                  setFrameImage(frameUrl);
                  setPhotoSlots(slots);
                  navigate('/camera');
                }}
              />
            }
          />

          <Route
            path="/camera"
            element={
              <CameraCapture
                selectedFrame={selectedFrame}
                photoSlots={photoSlots}
                photos={photos}
                onPhotosComplete={(capturedPhotos) => {
                  setPhotos(capturedPhotos);
                  navigate('/result');
                }}
              />
            }
          />

          <Route
            path="/result"
            element={
              <ResultPreview
                frameImage={frameImage}
                photos={photos}
                photoSlots={photoSlots}
                onRetake={handleRetake}
              />
            }
          />

          <Route
            path="*"
            element={
              <LandingPage
                onSelectTheme={(theme) => {
                  setSelectedTheme(theme);
                  navigate('/frame');
                }}
              />
            }
          />
        </Routes>
      </div>
    </BoothContext.Provider>
  );
};

const PhotoBoothApp = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default PhotoBoothApp;