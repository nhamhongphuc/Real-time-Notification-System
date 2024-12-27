import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Input,
  message,
  Modal,
  Space,
  theme,
  Typography,
  Upload,
  Badge,
  List,
  Drawer,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import {
  FileImageOutlined,
  LogoutOutlined,
  BellTwoTone,
} from "@ant-design/icons";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import axios from "axios";
import { capitalizeFirstLetter, displayLocalTime } from "../../ultils/ultils";
import { Notification } from "../../pages/home";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;

const AppHeader = (props: {
  fetchData: () => Promise<void>;
  unreadMessages: number;
  setUnreadMessages: Dispatch<SetStateAction<number>>;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  handleNotification: () => Promise<void>;
  openNotification: boolean;
  setOpenNotification: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    fetchData,
    notifications,
    setNotifications,
    setUnreadMessages,
    unreadMessages,
    handleNotification,
    openNotification,
    setOpenNotification,
  } = props;
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const { token } = useToken();
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();
  const [url, setURL] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const username = localStorage.getItem("username");

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (!title || !content) {
      message.error("Title and content are required.");
      return;
    }
    try {
      setConfirmLoading(true);
      await api.post(
        `/posts?title=${encodeURIComponent(title)}&content=${encodeURIComponent(
          content
        )}&image_url=${encodeURIComponent(url || "")}`
      );
      message.success("Post shared successfully.");

      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/signin");
      }
      message.error("Failed to share post. Please try again.");
    } finally {
      setURL("");
      setTitle("");
      setContent("");
      setFileList([]);
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  const beforeUpload = async (file: string | Blob) => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "multipart/form-data");

    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/posts/upload-image/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const imageUrl = response.data.file_url;
    setURL(imageUrl);

    return false;
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
    setNotifications([]);
    setUnreadMessages(0);
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `0px ${token.paddingLG}px`
        : `0px ${token.padding}px`,
    },
    divider: {
      margin: 0,
    },
    header: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.paddingSM}px 0px`,
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    placeholder: {
      backgroundColor: token.colorBgLayout,
      border: `${token.lineWidth}px dashed ${token.colorBorder}`,
      borderRadius: token.borderRadiusLG,
      padding: token.paddingLG,
      textAlign: "center" as const,
    },
    section: {
      backgroundColor: token.colorBgContainer,
      padding: `${token.sizeXXL}px 0px`,
    },
    tagline: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      margin: "0px",
    },
    user: {
      fontSize: token.fontSizeHeading4,
      margin: "0px",
    },
    titleWrapper: {
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      flexDirection: screens.md ? ("row" as const) : ("column" as const),
    },
  };

  return (
    <>
      <div style={styles.header as React.CSSProperties}>
        <div style={styles.container}>
          <Space
            size="middle"
            direction={screens.md ? "horizontal" : "vertical"}
            style={styles.titleWrapper}
          >
            <Space direction="horizontal">
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
              <Title style={styles.title}>Post Sharing</Title>
            </Space>
            <Space style={styles.titleWrapper}>
              {username && (
                <Title
                  level={4}
                  style={styles.user}
                >{`Welcome, ${capitalizeFirstLetter(username)}`}</Title>
              )}
              <a
                style={{ marginRight: "10px" }}
                onClick={() => {
                  handleNotification();
                  setOpenNotification(true);
                  setUnreadMessages(0);
                }}
              >
                <Badge count={unreadMessages}>
                  <BellTwoTone />
                </Badge>
              </a>
              <Button
                type="primary"
                icon={<FileImageOutlined />}
                onClick={showModal}
              >
                Write a post
              </Button>
              <Button onClick={handleLogout} icon={<LogoutOutlined />}>
                Log out
              </Button>
            </Space>
          </Space>
        </div>
      </div>
      <Divider style={styles.divider} />
      <Modal
        title={`${capitalizeFirstLetter(username)}, what are you thinking?`}
        open={open}
        centered
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
        <Input
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="Title"
          variant="borderless"
        />
        <Input.TextArea
          value={content}
          style={{ minHeight: "200px" }}
          onChange={(event) => setContent(event.currentTarget.value)}
          placeholder="Content"
          variant="borderless"
        />
      </Modal>
      <Drawer
        title="Notifications"
        open={openNotification}
        onClose={handleCloseNotification}
      >
        <List
          dataSource={notifications}
          renderItem={(notification) => {
            let data;
            try {
              data = JSON.parse(notification.message);
            } catch {
              return;
            }
            let message = "";
            if (data.action === "unlike") {
              return;
            }
            if (data.action === "comment") {
                const contentPreview = data.content.length > 50 
                ? `${data.content.substring(0, 50)}...` 
                : data.content;
                message = `${capitalizeFirstLetter(
                data.from
                )} commented on your post: ${contentPreview}`;
            } else if (data.action === "like") {
              message = `${capitalizeFirstLetter(data.from)} liked your post`;
            }
            return (
              <List.Item key={notification.id}>
                {message}
                <div style={{ fontSize: "0.8em", color: "gray" }}>
                  {displayLocalTime(notification.created_at)}
                </div>
              </List.Item>
            );
          }}
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
