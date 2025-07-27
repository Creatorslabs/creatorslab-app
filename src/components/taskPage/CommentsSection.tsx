"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comment {
  _id: string;
  userId: string;
  message: string;
  createdAt: string;
}

interface Props {
  taskId: string;
}

const CommentsSection = ({ taskId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`);
      const data = await res.json();
      setComments(data?.data || []);
    } catch (err) {
      toast({
        title: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ message: newComment }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error();

      setNewComment("");
      setShowInput(false);
      toast({ title: "Comment posted!" });
      fetchComments();
    } catch {
      toast({
        title: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <div className="space-y-4">
      <div>
        {!showInput ? (
          <Button onClick={() => setShowInput(true)} variant="secondary">
            Add a Comment
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="text-sm"
              disabled={submitting}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Post"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowInput(false);
                  setNewComment("");
                }}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted/10 border border-border rounded-lg p-3 text-sm text-white"
            >
              <p>{comment.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
