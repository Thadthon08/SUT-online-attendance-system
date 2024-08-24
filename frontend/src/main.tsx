import ReactDOM from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
