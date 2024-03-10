import {
  Forum,
  Person,
} from '@/types/data';

export const getTimeSince = ({ date }: { date: Date }) => {
  const seconds = Math.floor((new Date()).getTime() - date.getTime()) / 1000;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(seconds / 3600);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(seconds / 86400);

  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(seconds / 604800);

  if (weeks < 52) {
    return `${weeks}w`;
  }

  return `${Math.floor(seconds / 31536000)}y`;
};

export const hasAccessToForum = ({
  forum,
  authPerson,
}: { forum: Forum, authPerson?: Person }) => {
  const isPublic = (forum?.postAccess?.length === 0
    && forum.groupAccess?.length === 0
    && forum.readAccess?.length === 0);
  const hasGroupAccess = authPerson && forum?.groupAccess
    ?.some(([fieldName, value]) => authPerson[fieldName] === value);
  const hasReadAccess = [
    forum?.owner.toString(),
    ...((forum?.readAccess) ?? []),
  ].includes(authPerson?._id?.toString() ?? '');
  const hasPostAccess = [
    forum?.owner.toString(),
    ...((forum?.postAccess) ?? []),
  ].includes(authPerson?._id?.toString() ?? '');

  return {
    post: isPublic || hasGroupAccess || hasPostAccess,
    read: isPublic || hasGroupAccess || hasReadAccess,
  };
};
