export const getTimeSince = ({ date }: { date: Date }) => {
  const seconds = Math.floor((new Date()).getTime() - date.getTime()) / 1000;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  if (hours < 24) {
    return `${hours}h`;
  }

  if (days < 10) {
    return `${days}d`;
  }

  return undefined;
};
