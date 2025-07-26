export const GetRewardPoints = (engagement: string): number => {
  const key = engagement.toLowerCase();

  switch (key) {
    case "view":
      return 2;
    case "like":
    case "favorite":
    case "upvote":
      return 10;
    case "comment":
    case "reply":
      return 15;
    case "share":
    case "retweet":
    case "repost":
      return 25;
    case "follow":
    case "subscribe":
      return 20;
    case "tag":
      return 10;
    case "mention":
      return 15;
    case "dm":
    case "message":
      return 5;
    case "save":
    case "bookmark":
      return 12;
    case "click":
    case "link_click":
      return 8;
    case "video_watch":
    case "watch":
      return 10;
    case "story_reaction":
      return 10;
    case "reaction":
      return 10;
    default:
      return 0;
  }
};
