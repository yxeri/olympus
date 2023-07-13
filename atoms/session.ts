import { Session } from '@supabase/supabase-js';
import { atom } from 'recoil';

export const sessionAtom = atom<null | Session>({
  key: 'session',
  default: null,
});
