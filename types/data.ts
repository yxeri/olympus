import { JSONContent } from '@tiptap/react';
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

export const PersonObject: Omit<Person, '_id'> = {
  society: 'Bacchus',
  family: '',
  name: '',
  status: 'a',
  year: 0,
  type: 'Discipli',
  score: 0,
  profile: {},
  age: 20,
  province: 'imperiet',
  pronouns: ['hon'],
  imgVersion: 1,
};

export type Person = {
  authId?: string;
  _id: ObjectId | string,
  rank?: number,
  family: string,
  name: string,
  society?: Society,
  status: Status,
  year: Year,
  type: PersonType,
  score: number,
  profile: Record<string, any>,
  mail?: string,
  auth?: Record<string, Record<'user' | 'mod' | 'admin', boolean>>,
  imgVersion?: number,
  isInactive?: boolean;
  pronouns?: string[];
  province?: 'imperiet' | 'afrikanska samväldet' | 'förenade asien' | 'nya amerika';
  specialisation?: string;
  age?: number;
};

export const FamilyObject: Omit<Family, '_id'> = {
  name: 'name',
  status: 'a',
  province: 'imperiet',
  imgVersion: 1,
};

export type Family = {
  name: string;
  status: Status;
  imgVersion?: number;
  _id?: ObjectId | string;
  profile?: Record<string, any>,
  province?: 'imperiet' | 'afrikanska samväldet' | 'förenade asien' | 'nya amerika';
};

export const statusCollection: { [key in Status]: string } = {
  a: 'α',
  b: 'β',
  g: 'γ',
  d: 'δ',
  e: 'ε',
};

export const romanNumbers: { [key in Year]: string } = {
  0: '0',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  99: 'Q',
  100: 'S',
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
  _id: ObjectId | string;
  name: string;
  color?: string;
  events: FullEvent[];
};

type SharedData = {
  _id: ObjectId | string;
  owner: ObjectId | string;
  createdAt: Date;
  lastModified: Date;
};

type Access = {
  readAccess?: Array<ObjectId | string>;
  postAccess?: Array<ObjectId | string>;
  groupAccess?: Array<[keyof Person, string | number]>;
};

type SharedForumContent = {
  likes: Array<ObjectId | string>;
  dislikes: Array<ObjectId | string>;
  title?: string;
  content: string;
};

export type Post = SharedData & SharedForumContent & {
  threadId: ObjectId | string;
  media: Array<{ type: 'video' | 'image', path: string }>;
  subPosts: Array<Omit<Post, 'title' | 'subPosts'> & { postId: string }>;
};

export type Thread = SharedData & SharedForumContent & {
  forumId: ObjectId | string;
  media: Array<{ type: 'video' | 'image', path: string }>;
  locked: boolean;
  pinned: Array<ObjectId | string>;
};

export type Forum = SharedData & Access & {
  name: string;
  type: 'personal' | 'forum';
  pinned: Array<ObjectId | string>;
};

export type Document = SharedData & Access & {
  title: string;
  json: JSONContent;
};
