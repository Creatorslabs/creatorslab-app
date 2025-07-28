"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface User {
  username: string;
  image?: string;
}

export interface Reply {
  _id: string;
  taskId: string;
  userId: User;
  message: string;
  replyTo: string;
  createdAt: string;
  __v: number;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: User;
  message: string;
  createdAt: string;
  __v: number;
  replies: Reply[];
}

interface Props {
  taskId: string;
}

const CommentsSection = ({ taskId }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});

  const fetchComments = async (reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/tasks/${taskId}/comments?page=${reset ? 1 : page}`
      );
      const data = await res.json();
      const newComments = data?.data || [];

      setHasMore(newComments.length >= 10);
      if (reset) {
        setComments(newComments);
        setPage(2);
      } else {
        setComments((prev) => [...prev, ...newComments]);
        setPage((prev) => prev + 1);
      }
    } catch {
      toast({ title: "Failed to load comments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (message: string, replyTo?: string) => {
    if (!message.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: JSON.stringify({ message, replyTo }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to post comment");
      }

      toast({ title: "Comment posted!" });

      setNewComment("");
      setReplyInputs({});
      setShowReplyInput({});
      setShowInput(false);
      fetchComments(true);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowAllReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
  };

  useEffect(() => {
    fetchComments(true);
  }, [taskId]);

  return (
    <div className="space-y-4">
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
            maxLength={250}
            className="text-sm border-border bg-zinc-900 text-white resize-none"
            rows={3}
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {newComment.length}/250
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmit(newComment)}
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

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        ) : (
          comments.map((comment) => {
            const replies = comment.replies || [];
            const showAll = expandedReplies[comment._id];
            const visibleReplies = showAll ? replies : replies.slice(0, 3);
            const replyVisible = showReplyInput[comment._id];

            return (
              <div key={comment._id}>
                <div className="flex gap-3">
                  <Image
                    src={comment.userId.image || "/default-avatar.png"}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full object-cover w-9 h-9"
                    quality={75}
                    loader={({ src, width, quality }) =>
                      `${src}?w=${width}&q=${quality || 75}`
                    }
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {comment.userId.username}
                    </p>
                    <p className="text-sm text-gray-200">{comment.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt))} ·{" "}
                      {!replyVisible && (
                        <button
                          onClick={() =>
                            setShowReplyInput((prev) => ({
                              ...prev,
                              [comment._id]: true,
                            }))
                          }
                          className="text-xs text-gray-400 hover:underline"
                        >
                          Reply
                        </button>
                      )}
                    </p>

                    {/* Reply input */}
                    {replyVisible && (
                      <div className="mt-2">
                        <Textarea
                          value={replyInputs[comment._id] || ""}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          maxLength={250}
                          rows={2}
                          className="text-sm resize-none bg-zinc-900 border border-zinc-700 focus:ring-0 focus:outline-none text-white"
                          disabled={submitting}
                        />
                        <div className="flex gap-2 mt-1">
                          <Button
                            onClick={() =>
                              handleSubmit(
                                replyInputs[comment._id],
                                comment._id
                              )
                            }
                            disabled={
                              submitting || !replyInputs[comment._id]?.trim()
                            }
                            className="h-8 px-3 text-sm"
                          >
                            {submitting ? (
                              <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                              "Reply"
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              setShowReplyInput((prev) => ({
                                ...prev,
                                [comment._id]: false,
                              }))
                            }
                            className="h-8 px-3 text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                <div className="ml-12 mt-4 space-y-4">
                  {visibleReplies.map((reply) => (
                    <div key={reply._id} className="flex gap-3">
                      <Image
                        src={reply.userId.image || "/default-avatar.png"}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8"
                        quality={75}
                        loader={({ src, width, quality }) =>
                          `${src}?w=${width}&q=${quality || 75}`
                        }
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {reply.userId.username}
                        </p>
                        <p className="text-sm text-gray-300">{reply.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(reply.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}

                  {replies.length > 3 && !showAll && (
                    <button
                      onClick={() => handleShowAllReplies(comment._id)}
                      className="text-xs text-blue-400 hover:underline ml-2"
                    >
                      View all {replies.length} replies
                    </button>
                  )}
                </div>

                <hr className="my-4 border-zinc-800" />
              </div>
            );
          })
        )}

        {hasMore && !loading && (
          <Button onClick={() => fetchComments()} variant="ghost">
            Load more comments
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
