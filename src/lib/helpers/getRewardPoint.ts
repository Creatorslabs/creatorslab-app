export const GetRewardPoints = (engagement: string): number => {
  const key = engagement.toLowerCase();

  switch (key) {
    case "view":
      return 0.1;
    case "like":
    case "favorite":
    case "upvote":
      return 0.5;
    case "comment":
    case "reply":
      return 0.8;
    case "share":
    case "retweet":
    case "repost":
      return 1;
    case "follow":
    case "subscribe":
      return 0.5;
    case "tag":
      return 0.4;
    case "mention":
    case "quote":
      return 0.4;
    case "dm":
    case "message":
      return 1;
    case "save":
    case "bookmark":
      return 0.4;
    case "click":
    case "link_click":
      return 0.2;
    case "video_watch":
    case "watch":
      return 0.8;
    case "story_reaction":
      return 0.2;
    case "reaction":
      return 0.2;
    default:
      return 0;
  }
};
