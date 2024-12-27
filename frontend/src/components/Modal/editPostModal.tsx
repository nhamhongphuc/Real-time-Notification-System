import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Input, message } from "antd";
import { Post } from "../../pages/home";
import { capitalizeFirstLetter } from "../../ultils/ultils";
import api from "../../services/api";

interface EditPostModalProps {
  open: boolean;
  post: Post;
  username: string;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setItem: Dispatch<SetStateAction<Post | undefined>>;
  confirmLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchData: () => Promise<void>;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  open,
  post,
  username,
  setItem,
  setIsModalVisible,
  confirmLoading,
  setLoading,
  fetchData
}) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleOk = async () => {
    if (!title || !content) {
        message.error("Title and content are required.");
        return;
    }
    if (title === post.title && content === post.content) {
        message.error("No changes detected.");
        return;
    }
    try {
        setLoading(true);
        await api.put(`/posts/${post.id}?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);
        message.success("Post updated successfully.");
        fetchData();
    } catch (error) {
        message.error("An error occurred while updating the post: " + error);
    } finally {
        setIsModalVisible(false);
        setItem(undefined);
        setLoading(false);
    }
  };
  const handleCancel = async () => {
    setIsModalVisible(false);
    setItem(undefined);
  };
  
  return (
    <Modal
      title={`${capitalizeFirstLetter(
        username
      )}, do you want to change something?`}
      open={open}
      centered
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Input
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        placeholder="Title"
        variant="borderless"
      />
      <Input.TextArea
        value={content}
        style={{ minHeight: '200px' }}
        onChange={(event) => setContent(event.currentTarget.value)}
        placeholder="Content"
        variant="borderless"
      />
    </Modal>
  );
};

export default EditPostModal;