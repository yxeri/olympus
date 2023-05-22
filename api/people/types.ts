import { ObjectId } from 'mongodb';

export type ResponseError = {
  error: string,
};

type IdDb = { _id: ObjectId };
export type IdName = { name: string, family: string };

export type Id = IdDb | IdName;
