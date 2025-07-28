import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { TaskComment } from "@/lib/models/TaskComment";
import { getLoggedInUser } from "@/lib/auth/getUser";
import { Filter } from "bad-words";

export async function GET(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const { taskId } = await context.params;

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const allComments = await TaskComment.find({ taskId })
      .sort({ createdAt: -1 })
      .populate("userId", "username image")
      .lean();

    const topLevelComments = allComments.filter((c) => !c.replyTo);
    const replies = allComments.filter((c) => c.replyTo);

    const paginatedTopLevel = topLevelComments.slice(skip, skip + limit);

    const commentsWithReplies = paginatedTopLevel.map((comment) => {
      const commentReplies = replies
        .filter((reply) => reply.replyTo?.toString() === comment._id.toString())
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      return {
        ...comment,
        replies: commentReplies,
      };
    });

    return NextResponse.json({
      success: true,
      data: commentsWithReplies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(topLevelComments.length / limit),
        totalComments: topLevelComments.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { message, replyTo } = body;

    const { taskId } = await context.params;

    if (!message || message.length > 250) {
      return NextResponse.json(
        { success: false, message: "Message must be 250 characters or fewer." },
        { status: 400 }
      );
    }

    const filter = new Filter();

    if (filter.isProfane(message)) {
      return NextResponse.json(
        { success: false, message: "Inappropriate language is not allowed." },
        { status: 400 }
      );
    }

    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const comment = await TaskComment.create({
      taskId: taskId,
      userId: user._id,
      message,
      replyTo: replyTo || null,
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to post comment" },
      { status: 500 }
    );
  }
}
