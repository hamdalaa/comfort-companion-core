import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "lenis/dist/lenis.css";
import { registerServiceWorkerOnIdle } from "./lib/serviceWorker";

createRoot(document.getElementById("root")!).render(<App />);
registerServiceWorkerOnIdle();
