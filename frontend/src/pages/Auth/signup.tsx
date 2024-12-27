// src/SignUp.tsx
import React from "react";
import useAuthStore from "../../store/authStore";
import type { FormProps } from "antd";
import {
  LockOutlined,
  UserOutlined,
  SafetyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Grid, Input, message, theme, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

type FieldType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};
const SignUp: React.FC = () => {
  const { signUp } = useAuthStore();
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      await signUp(values.email, values.username, values.password);
      navigate("/signin");
    } catch (error: any) {
      message.error("Failed to sign up. Please try again. ");
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.sm
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center" as const,
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXS}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 248 204"
            width="50px"
            height="50px"
          >
            <path
              fill="#1d9bf0"
              d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"
            />
          </svg>

          <Title style={styles.title}>Sign up</Title>
          <Text style={styles.text}>
            Join us! Create an account to get started.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="text"
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="confirmPassword"
            rules={[
              { required: true, message: "Please input your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("The passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block={true} type="primary" htmlType="submit">
              Sign Up
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Already have an account?</Text>{" "}
              <Link to="/signin">Sign in</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default SignUp;
