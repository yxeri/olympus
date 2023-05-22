export enum Locale {
  SV = 'sv',
  EN = 'en',
}

const dictionary = {
  common: {
    name: {
      [Locale.SV]: 'Namn',
      [Locale.EN]: 'Name',
    },
    family: {
      [Locale.SV]: 'Familj',
      [Locale.EN]: 'Family',
    },
  },
  auth: {
    password: {
      [Locale.SV]: 'Lösenord',
      [Locale.EN]: 'Password',
    },
    mail: {
      [Locale.SV]: 'E-mail',
      [Locale.EN]: 'Mail',
    },
    mailLabel: {
      [Locale.SV]: 'E-mail används för verifikation, lösenordsåterställning och inloggning med engångslösenord',
      [Locale.EN]: 'Mail is used for verification, password reset and one-time password login',
    },
    repeatMail: {
      [Locale.SV]: 'Repetera e-mail',
      [Locale.EN]: 'Repeat mail',
    },
    register: {
      [Locale.SV]: 'Registrera',
      [Locale.EN]: 'Register',
    },
    login: {
      [Locale.SV]: 'Logga in',
      [Locale.EN]: 'Login',
    },
    otp: {
      [Locale.SV]: 'Skicka engångslösenord',
      [Locale.EN]: 'Send one-time password',
    },
    createUser: {
      [Locale.SV]: 'Skapa ny användare',
      [Locale.EN]: 'Create new user',
    },
    welcome: {
      [Locale.SV]: 'Välkommen',
      [Locale.EN]: 'Welcome',
    },
    registerSuccess: {
      [Locale.SV]: 'Verifiera ditt konto för att kunna logga in',
      [Locale.EN]: 'You have to verify your account to be able to log in'
    },
    existsError: {
      [Locale.SV]: 'Användaren existerar redan',
      [Locale.EN]: 'User already exists'
    },
  },
};
const defaultLocale = Locale.EN;

export const useDictionary = () => ({
  dictionary,
  getDictionaryValue: <G,>(
    group: G & keyof typeof dictionary,
    field: keyof typeof dictionary[G & keyof typeof dictionary],
    locale: Locale = defaultLocale,
  ): string | undefined => {
    // @ts-ignore
    const value = dictionary[group]?.[field]?.[locale]
      // @ts-ignore
      ?? dictionary[group]?.[field]?.[defaultLocale];

    return value;
  },
});