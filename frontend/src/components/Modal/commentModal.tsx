import React, { useState } from "react";
import { Modal, Button, Input, List } from "antd";
import { capitalizeFirstLetter, displayLocalTime } from "../../ultils/ultils";

export interface Comment {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Modal
      title="Comments"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddComment}>
          Add Comment
        </Button>,
      ]}
    >
      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item key={comment.id}>
            <strong>{capitalizeFirstLetter(comment.username)}</strong>: {comment.content}
            <div style={{ fontSize: "0.8em", color: "gray" }}>{displayLocalTime(comment.created_at)}</div>
          </List.Item>
        )}
        style={{ maxHeight: "300px", overflowY: "auto" }}
      />
      <Input.TextArea
        rows={4}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
    </Modal>
  );
};

export default CommentModal;
