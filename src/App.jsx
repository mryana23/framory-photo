import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FrameSelection from './components/FrameSelection';
import CameraCapture from './components/CameraCapture';
import ResultPreview from './components/ResultPreview';
import { createContext, useContext } from 'react';

const BoothContext = createContext(null);
export const useBooth = () => useContext(BoothContext);

// ── Helper persist ke sessionStorage ──
const saveSession = (key, value) => {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
};
const loadSession = (key) => {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
};

const AppRoutes = () => {
  const navigate = useNavigate();

  const [selectedTheme, setSelectedTheme] = useState(() => loadSession('selectedTheme'));
  const [selectedFrame, setSelectedFrame] = useState(() => loadSession('selectedFrame'));
  const [frameImage, setFrameImage] = useState(() => loadSession('frameImage'));
  const [photoSlots, setPhotoSlots] = useState(() => loadSession('photoSlots') ?? []);
  const [photos, setPhotos] = useState(() => loadSession('photos') ?? []);

  const handleReset = () => {
    setPhotos([]); setSelectedTheme(null); setSelectedFrame(null);
    setFrameImage(null); setPhotoSlots([]);
    ['selectedTheme','selectedFrame','frameImage','photoSlots','photos'].forEach(k => sessionStorage.removeItem(k));
    navigate('/');
  };

  const handleRetake = () => {
    sessionStorage.removeItem('photos');
    navigate('/camera');
  };

  const ctxValue = {
    selectedTheme, setSelectedTheme,
    selectedFrame, setSelectedFrame,
    frameImage, setFrameImage,
    photoSlots, setPhotoSlots,
    photos, setPhotos,
    handleReset, handleRetake,
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
                  saveSession('selectedTheme', theme);
                  navigate('/frame');
                }}
              />
            }
          />

          <Route
            path="/frame"
            element={
              selectedTheme
                ? <FrameSelection
                    selectedTheme={selectedTheme}
                    onBack={() => navigate('/')}
                    onSelectFrame={(frame, frameUrl, slots) => {
                      setSelectedFrame(frame);
                      setFrameImage(frameUrl);
                      setPhotoSlots(slots);
                      saveSession('selectedFrame', frame);
                      saveSession('frameImage', frameUrl);
                      saveSession('photoSlots', slots);
                      navigate('/camera');
                    }}
                  />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/camera"
            element={
              selectedFrame && photoSlots.length > 0
                ? <CameraCapture
                    selectedFrame={selectedFrame}
                    photoSlots={photoSlots}
                    photos={[]}
                    onPhotosComplete={(capturedPhotos) => {
                      setPhotos(capturedPhotos);
                      saveSession('photos', capturedPhotos);
                      navigate('/result');
                    }}
                  />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/result"
            element={
              photos.length > 0
                ? <ResultPreview
                    frameImage={frameImage}
                    photos={photos}
                    photoSlots={photoSlots}
                    onRetake={handleRetake}
                  />
                : <Navigate to="/" replace />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
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