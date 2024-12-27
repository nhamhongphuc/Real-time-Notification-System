export function timeAgo(timestamp: string): string {
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const past = new Date(timestamp);
  const secondsAgo = Math.floor((utcNow.getTime() - past.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export function capitalizeFirstLetter(username: string | null): string {
  if (!username) return '';
  return username.charAt(0).toUpperCase() + username.slice(1);
}

export function displayInteractionQuantity(likes: number, comments: number): string {
  const likeText = `${likes} like${likes !== 1 ? 's' : ''}`;
  const commentText = `${comments} comment${comments !== 1 ? 's' : ''}`;
  return `${likeText}, ${commentText}`;
}

export function displayLocalTime(timestamp: string): string {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Date(
    timestamp.includes("Z") ? timestamp : timestamp + "Z"
  ).toLocaleString("en-US", {
    timeZone: timezone,
  });
}