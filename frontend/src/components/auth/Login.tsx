import LoginForm from "./LoginForm";
import "./style.css";
import ConfigProvider from "antd/es/config-provider";

export default function Login() {
  return (
    <div className="bg-image">
      <div className="md:container md:mx-auto  h-lvh flex items-center justify-center">
        <div className=" w-1/2 min-w-80 max-w-2xl">
          <h1
            className="text-2xl font-medium text-center p-4 text-white"
            style={{ backgroundColor: "rgb(51, 51, 51)" }}
          >
            SUT attendance
          </h1>
          <div className="p-5 bg-slate-50">
            <ConfigProvider
              theme={{
                token: {
                  fontFamily:
                    "Noto Sans, 'Noto Sans Thai', 'Prompt', sans-serif",
                  colorBgContainer: "f4f4f4",
                },
                components: {
                  Input: {
                    colorBorder: "rgb(51, 51, 51)",
                  },
                },
              }}
            >
              <LoginForm />
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
