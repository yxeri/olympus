import { ObjectId } from 'mongodb';

export type ResponseError = {
  error: string,
};

type IdDb = { _id: ObjectId };
export type UserIdName = { name: string, family: string };
export type FamilyIdName = { name: string };

export type UserId = IdDb | UserIdName;
export type FamilyId = IdDb | FamilyIdName;
