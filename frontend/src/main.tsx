import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider
    theme={{
      token: {
        fontFamily: "Noto Sans, 'Noto Sans Thai', 'Prompt', sans-serif",
        colorBgContainer: "f4f4f4",
      },
      components: {
        Input: {
          colorBorder: "rgb(51, 51, 51)",
        },
      },
    }}
  >
    <ChakraProvider>
    <App />
    </ChakraProvider>
  </ConfigProvider>
);
