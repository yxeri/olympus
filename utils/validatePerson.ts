import {
  PersonObject,
  PersonTypeObject,
  SocietyObject,
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

  console.log(person);

  if (person.year && !Object.keys(YearObject).includes(person.year.toString())) {
    errors.push(`valid years are: ${Object.keys(YearObject)}`);
  }

  if (!Object.keys(PersonTypeObject).includes(person.type)) {
    errors.push(`valid types are: ${Object.keys(PersonTypeObject)}`);
  }

  if (person.society && !Object.keys(SocietyObject).includes(person.society)) {
    errors.push(`valid societies are: ${Object.keys(SocietyObject)}`);
  }

  return [errors.length === 0, errors];
};
