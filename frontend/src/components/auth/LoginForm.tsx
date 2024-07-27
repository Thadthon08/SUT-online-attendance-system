import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { SignIn } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { LoginResponseInterface } from "../../interface/ILoginRespon";

const App: React.FC = () => {
  const context = useAuth();

  const onFinish = async (values: any) => {
    try {
      const res: LoginResponseInterface = await SignIn(values);
      if (res.token.token) {
        context.signIn(res);
        console.log("Login successful:", res);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item className="text-center">
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button w-full"
          style={{ backgroundColor: "rgb(242, 101, 34)" }}
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
