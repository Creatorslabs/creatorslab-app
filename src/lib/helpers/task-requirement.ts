export function getTaskRequirements(type: string[], platform: string, creator: string) {
  const platformName = formatPlatformName(platform);
  const requirements: string[] = [];

  type.forEach((action) => {
    switch (action.toLowerCase()) {
      case "follow":
        requirements.push(`Follow ${creator} on ${platformName}`);
        break;
      case "like":
        requirements.push(`Like ${creator}'s post on ${platformName}`);
        break;
      case "comment":
        requirements.push(`Comment on ${creator}'s post on ${platformName}`);
        break;
      case "share":
        requirements.push(`Share ${creator}'s post on ${platformName}`);
        break;
      case "join":
        requirements.push(`Join ${creator}'s ${platformName} community`);
        break;
      case "subscribe":
        requirements.push(`Subscribe to ${creator} on ${platformName}`);
        break;
      case "retweet":
        requirements.push(`Retweet ${creator}'s post on ${platformName}`);
        break;
      case "repost":
        requirements.push(`Repost ${creator}'s content on ${platformName}`);
        break;
      case "react":
        requirements.push(`React to ${creator}'s message on ${platformName}`);
        break;
      default:
        requirements.push(`${action} ${creator} on ${platformName}`);
    }
  });

  return requirements;
}

function formatPlatformName(platform: string): string {
  switch (platform.toLowerCase()) {
    case "twitter":
      return "Twitter";
    case "discord":
      return "Discord";
    case "telegram":
      return "Telegram";
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "lens":
      return "Lens Protocol";
    case "threads":
      return "Threads";
    case "reddit":
      return "Reddit";
    default:
      return capitalize(platform);
  }
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
