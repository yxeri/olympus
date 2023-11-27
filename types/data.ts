import { ObjectId } from 'mongodb';
import { ReactNode } from 'react';
import { Event } from 'react-big-calendar';
import { Options } from 'rrule';

export const SocietyObject = {
  Bacchus: '', Bellona: '', Pheme: '',
};
export type Society = keyof typeof SocietyObject;
export const StatusObject = {
  a: '', b: '', g: '', d: '', e: '',
};
export type Status = keyof typeof StatusObject;
export const YearObject = {
  0: '', 1: '', 2: '', 3: '', 4: '', 99: '', 100: '',
};
export type Year = keyof typeof YearObject;
export const PersonTypeObject = { Discipli: '', Questi: '', Soter: '' };
export type PersonType = keyof typeof PersonTypeObject;

export const PersonObject: Person = {
  society: 'Bacchus',
  family: '',
  name: '',
  status: 'a',
  year: 0,
  type: 'Discipli',
  score: 0,
  profile: {},
};

export type Person = {
  authId?: string;
  _id?: ObjectId | string,
  rank?: number,
  family: string,
  name: string,
  society?: Society,
  status: Status,
  year: Year,
  type: PersonType,
  score: number,
  mail?: string,
  profile: Record<string, any>,
  auth?: Record<string, Record<'user' | 'mod' | 'admin', boolean>>,
  imgVersion?: string | number,
  isInactive?: boolean;
};

export const statusCollection: { [key in Status]: string } = {
  a: 'α',
  b: 'β',
  g: 'γ',
  d: 'δ',
  e: 'ε',
};

export type FullEvent = Event & {
  start: Date;
  end: Date;
  title: ReactNode;
  id: string;
  description?: string;
  location?: string;
  rrule?: Partial<Options>;
  calendar?: string;
};

export type Calendar = {
  _id?: ObjectId | string;
  name: string;
  color?: string;
  events: FullEvent[];
};

export type Post = {
  _id?: ObjectId | string;
  owner: ObjectId | string;
  createdAt: Date;
  lastModified: Date;
  threadId: ObjectId | string;
  title?: string;
  content: string;
  images: string[];
  subPosts: Array<Omit<Post, 'title' | 'subPosts'> & { postId: string }>;
};

export type Thread = {
  _id?: ObjectId | string;
  forumId: ObjectId | string;
  owner: ObjectId | string;
  createdAt: Date;
  lastModified: Date;
  title?: string;
  content: string;
  images: string[];
  locked: boolean;
  pinned: Array<ObjectId | string>;
};

export type Forum = {
  _id?: ObjectId | string;
  createdAt: Date;
  lastModified: Date;
  owner: ObjectId | string;
  name: string;
  type: 'personal' | 'forum';
  readAccess?: Array<ObjectId | string>;
  postAccess?: Array<ObjectId | string>;
  groupAccess?: Array<[keyof Person, string | number]>;
  pinned: Array<ObjectId | string>;
};
