import {
  PersonObject,
  PersonTypeObject,
  StatusObject,
  YearObject
} from '../types/data';

export const validatePerson = (person: any): [boolean, string[]] => {
  const errors = [];

  Object.keys(PersonObject).forEach((key) => {
    if (person[key] === undefined) {
      errors.push(`missing ${key}`);
    }
  });

  if (!Object.keys(StatusObject).includes(person.status)) {
    errors.push(`valid status are: ${Object.keys(StatusObject)}`);
  }

  if (!Object.keys(YearObject).includes(person.year.toString())) {
    errors.push(`valid years are: ${Object.keys(YearObject)}`);
  }

  if (!Object.keys(PersonTypeObject).includes(person.type)) {
    errors.push(`valid types are: ${Object.keys(PersonTypeObject)}`);
  }

  return [errors.length === 0, errors];
};
