import React, { useCallback, useEffect, useState } from "react";
import AppHeader from "../components/Header";
import api from "../services/api";
import {
  List,
  Skeleton,
  Grid,
  Typography,
  message,
  Modal,
  theme,
  Avatar,
  Card,
  notification,
  NotificationArgsProps,
} from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  LikeTwoTone,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  capitalizeFirstLetter,
  displayInteractionQuantity,
  timeAgo,
} from "../ultils/ultils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditPostModal from "../components/Modal/editPostModal";
import CommentModal from "../components/Modal/commentModal";
import { Comment } from "../components/Modal/commentModal";
import useWebSocket from "react-use-websocket";
type NotificationPlacement = NotificationArgsProps["placement"];

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Meta } = Card;

export type Post = {
  username: string;
  id: string;
  title: string;
  content: string;
  user_id: number;
  image_data: string;
  image_url: string;
  created_at: string;
  total_likes: number;
  total_comments: number;
  is_liked_by_current_user: boolean;
};

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
};

const Home = () => {
  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const tokenAuthen = localStorage.getItem("token");
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const screens = useBreakpoint();
  const [item, setItem] = useState<Post>();
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [postIdSelected, setPostIdSelected] = useState<number>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [apiNotify, contextHolder] = notification.useNotification();
  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  const openNotification = (
    message: string,
    placement: NotificationPlacement
  ) => {
    apiNotify.info({
      message: `Notification`,
      description: message,
      placement,
      duration: 2,
    });
  };

  const WS_URL = `ws://127.0.0.1:8000/ws/${user_id}/${tokenAuthen}`;
  const { lastMessage } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });

  // Run when a new WebSocket message is received (lastMessage)
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      // Notification for the current user
      if (data.from === username) {
        return;
      }
      if (data.user_id === Number(user_id)) {
        if (data.action !== "unlike") {
          setUnreadMessages((prev) => prev + 1);
          setNotifications((prev) => [
            {
              id: Date.now(),
              user_id: data.user_id,
              message: lastMessage.data,
              created_at: new Date().toISOString(),
            },
            ...prev,
          ]);
        }

        if (data.action === "like" && !openNotificationModal) {
          openNotification(`${data.from} liked your post!`, "topRight");
        } else if (data.action === "comment" && !openNotificationModal && item?.id !== data.post_id) {
          const contentPreview = data.content.length > 50 
                ? `${data.content.substring(0, 50)}...` 
                : data.content;
          openNotification(
            `${data.from} commented on your post: ${contentPreview}`,
            "topRight"
          );
        }
      }

      // Logic for handling the new message
      if (data.action === "like") {
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id === data.post_id) {
              return {
                ...post,
                total_likes: post.total_likes + 1,
              };
            }
            return post;
          });
        });
      } else if (data.action === "unlike") {
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id === data.post_id) {
              return {
                ...post,
                total_likes: post.total_likes - 1,
              };
            }
            return post;
          });
        });
      } else if (data.action === "comment") {
        setPosts((prev) => {
          return prev.map((post) => {
            if (post.id === data.post_id) {
              return {
                ...post,
                total_comments: post.total_comments + 1,
              };
            }
            return post;
          });
        });
        if (Number(postIdSelected) === data.post_id && comments.length > 0) {
          setComments((prev) => [
            {
              id: Date.now(),
              content: data.content,
              username: data.from,
              created_at: data.created_at,
            },
            ...prev,
          ]);
        }
      }
    }
  }, [lastMessage]);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      message.success("Post deleted successfully");
    } catch (error) {
      message.error("Failed to delete post: " + error);
    }
  };

  const showDeleteConfirm = (postId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      okText: "Delete",
      okButtonProps: { style: { backgroundColor: "red", borderColor: "red" } },
      onOk: () => handleDelete(postId),
    });
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/likes/`, { post_id: postId });
      setPosts((prev) => {
        return prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              total_likes: post.total_likes + 1,
              is_liked_by_current_user: true,
            };
          }
          return post;
        });
      });
    } catch (error) {
      message.error("Failed to like post: " + error);
    }
  };

  const handleUnLike = async (postId: string) => {
    try {
      await api.delete(`/likes/${postId}`);
      setPosts((prev) => {
        return prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              total_likes: post.total_likes - 1,
              is_liked_by_current_user: false,
            };
          }
          return post;
        });
      });
    } catch (error) {
      message.error("Failed to unlike post: " + error);
    }
  };

  const handleComment = async (postId: number) => {
    try {
      setPostIdSelected(postId);
      const response = await api.get(`/comments/${postId}`);
      setComments(response.data);
      setIsCommentModalVisible(true);
    } catch (error) {
      message.error("Failed to load comments: " + error);
    }
  };

  const handleAddComment = async (comment: string) => {
    try {
      if (item) {
        await api.post(`/comments/`, { post_id: item.id, content: comment });
      } else {
        message.error("Failed to add comment: post item is undefined");
      }
      setComments((prev) => [
        {
          id: Date.now(),
          content: comment,
          username: username || "",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setPosts((prev) => {
        return prev.map((post) => {
          if (post.id === item?.id) {
            return {
              ...post,
              total_comments: comments.length + 1,
            };
          }
          return post;
        });
      });
    } catch (error) {
      message.error("Failed to add comment: " + error);
    }
  };

  const toggleCommentModal = () => {
    setIsCommentModalVisible(!isCommentModalVisible);
  };

  const handleNotification = async () => {
    try {
      const response = await api.get(`/notifications/`);
      setNotifications(response.data);
    } catch (error) {
      message.error("Failed to load comments: " + error);
    }
  };
  const styles = {
    section: {
      alignItems: "center",
      backgroundColor: "#f0f2f5",
      display: "flex",
      padding: screens.md ? `${token.sizeXXS}px 0px` : "0px",
    },
    list: {
      margin: "0 auto",
      width: screens.xl ? "50%" : screens.lg ? "70%" : "90%",
      padding: screens.sm
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
    },
    item: {
      width: "100%",
      marginBottom: screens.sm
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added box shadow
    },
    image: {
      maxWidth: "100%",
      maxHeight: "374px",
      objectFit: "contain" as React.CSSProperties["objectFit"], // Optional: to maintain aspect ratio and cover the area
    },
  };
  return (
    <>
      <AppHeader
        fetchData={fetchData}
        unreadMessages={unreadMessages}
        setUnreadMessages={setUnreadMessages}
        notifications={notifications}
        setNotifications={setNotifications}
        handleNotification={handleNotification}
        openNotification={openNotificationModal}
        setOpenNotification={setOpenNotificationModal}
      />
      <div style={styles.section}>
        {contextHolder}
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <List
              itemLayout="vertical"
              size="large"
              style={styles.list}
              dataSource={posts}
              renderItem={(item: Post) => (
                <>
                  <Card
                    key={item.id}
                    style={styles.item}
                    cover={
                      item.image_data ? (
                        <img
                          src={`data:image/jpeg;base64,${item.image_data}`}
                          alt={item.title}
                          style={styles.image}
                        />
                      ) : (
                        ""
                      )
                    }
                    actions={
                      Number(user_id) === item.user_id
                        ? [
                            item.is_liked_by_current_user ? (
                              <LikeTwoTone
                                key={item.id + "like"}
                                onClick={() => handleUnLike(item.id)}
                              />
                            ) : (
                              <LikeOutlined
                                key={item.id + "like"}
                                onClick={() => handleLike(item.id)}
                              />
                            ),
                            <CommentOutlined
                              key={item.id + "comment"}
                              onClick={() => {
                                setItem(item);
                                handleComment(Number(item.id));
                                toggleCommentModal();
                              }}
                            />,
                            <EditOutlined
                              key={item.id + "edit"}
                              onClick={() => {
                                setItem(item);
                                toggleModal();
                              }}
                            />,
                            <DeleteOutlined
                              key={item.id + "delete"}
                              color="red"
                              onClick={() => showDeleteConfirm(item.id)}
                            />,
                          ]
                        : [
                            item.is_liked_by_current_user ? (
                              <LikeTwoTone
                                key={item.id}
                                onClick={() => handleUnLike(item.id)}
                              />
                            ) : (
                              <LikeOutlined
                                key={item.id}
                                onClick={() => handleLike(item.id)}
                              />
                            ),
                            <CommentOutlined
                              key="comment"
                              onClick={() => {
                                setItem(item);
                                handleComment(Number(item.id));
                                toggleCommentModal();
                              }}
                            />,
                          ]
                    }
                  >
                    <Meta
                      avatar={
                        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                      }
                      title={capitalizeFirstLetter(item.username)}
                      description={
                        <>
                          <div>{timeAgo(item.created_at)}</div>
                          <h3>
                            <strong>{item.title}</strong>
                          </h3>
                          <div>{item.content}</div>
                        </>
                      }
                    />
                    <div style={{ marginTop: "10px" }}>
                      <Typography.Text>
                        {displayInteractionQuantity(
                          item.total_likes,
                          item.total_comments
                        )}
                      </Typography.Text>
                    </div>
                  </Card>
                </>
              )}
            />
            {item?.id && (
              <>
                <EditPostModal
                  open={isModalVisible}
                  username={localStorage.getItem("username") || ""}
                  post={item}
                  confirmLoading={loading}
                  setLoading={setLoading}
                  setItem={setItem}
                  setIsModalVisible={setIsModalVisible}
                  fetchData={fetchData}
                />
              </>
            )}
            <CommentModal
              visible={isCommentModalVisible}
              onClose={() => {
                setComments([]);
                setIsCommentModalVisible(false);
                setPostIdSelected(undefined);
              }}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
