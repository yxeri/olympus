export const SocietyObject = { Bacchus: '', Bellona: '', Pheme: '' };
export type Society = keyof typeof SocietyObject;
export const StatusObject = {
  a: '', b: '', g: '', d: '', e: '', '?': ''
};
export type Status = keyof typeof StatusObject;
export const YearObject = {
  0: '', 1: '', 2: '', 3: '', 4: '', 99: ''
};
export type Year = keyof typeof YearObject;
export const PersonTypeObject = { Discipli: '', Questi: '' };
export type PersonType = keyof typeof PersonTypeObject;

export const PersonObject: Omit<Person, '_id'> = {
  rank: 1,
  family: '',
  name: '',
  society: 'Bacchus',
  status: 'a',
  year: 0,
  type: 'Discipli',
  score: 0,
};

export type Person = {
  _id: string,
  rank: number,
  family: string,
  name: string,
  society: Society,
  status: Status,
  year: Year,
  type: PersonType,
  score: number,
};

export const statusCollection: { [key in Status]: string } = {
  a: 'α',
  b: 'β',
  g: 'γ',
  d: 'δ',
  e: 'ε',
  '?': '?',
};
