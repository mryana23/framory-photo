📸 Framory: Modern Web-Based Photobooth
Framory is a high-performance Single Page Application (SPA) designed to bring the classic photobooth experience to the browser. Built with React 19 and Vite, it features real-time webcam integration, dynamic theme selection, and instant frame composition.

🚀 Key Features
Seamless SPA Experience: Zero-refresh transitions using React Router 7 for a native-app feel.
Webcam API Integration: Automated capture sequences with real-time countdowns.
Dynamic Theming: Filterable frame catalogs based on user-selected aesthetic themes.
Persistence: State management backed by SessionStorage to prevent data loss on refresh.
Responsive UI: Optimized for various screen sizes using modern CSS principles.

🏗️ Architecture & Component Roles
I designed this application with a modular "Theater" architecture to ensure scalability and clean separation of concerns:
1. The Core (Infrastructure)
main.jsx: The entry point that bootstraps the React environment into the DOM.
App.jsx (The Orchestrator): Manages global state, routing logic, and provides the BoothContext for efficient data flow across the component tree.
2. The Components (The Actors)
LandingPage.jsx: Manages entry intent and theme initialization.
FrameSelection.jsx: A dynamic catalog that handles complex filtering of frame assets.
CameraCapture.jsx: The technical core—interfaces with browser media devices, manages timers, and processes raw image data.
ResultPreview.jsx: Handles the final image synthesis, merging captures with selected frames for download.

🛠️ Technical Stack
React 19: Leveraging the latest hooks and rendering performance.
Vite: For an optimized build pipeline and near-instant HMR.
React Router 7: Implementing declarative, client-side routing.
Lucide React: For consistent, lightweight iconography.
⚙️ Development Setup
1. Clone the repository:
git clone https://github.com/mryana23/framory-photo
2. Install dependencies:
npm install
3. Launch the development server:

npm run dev
💡 Why this approach?
By opting for an SPA architecture, I eliminated the "white-screen" flash between steps. This ensures the user stays immersed in the experience—crucial for a creative tool like a photobooth.