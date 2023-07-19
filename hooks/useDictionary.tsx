export enum Locale {
  SV = 'sv',
  EN = 'en',
}

const dictionary = {
  settings: {
    uploadPortrait: {
      [Locale.SV]: 'Ladda upp självporträtt',
      [Locale.EN]: 'Upload your portrait',
    },
    uploadImages: {
      [Locale.SV]: 'Ladda upp porträtt',
      [Locale.EN]: 'Upload portraits',
    },
    uploadImagesText: {
      [Locale.EN]: 'Each file should have the name of the person with a dash (-) in between the name and family name.',
      [Locale.SV]: 'Varje fil ska ha namnet av personen med en bindestreck (-) mellan namn och familjenamn.',
    },
    uploadImagesExample: {
      [Locale.EN]: 'Don\'t remove any whitespaces or special characters from the name. Examples: kahina-soteira.png'
      + ' (Kahina Soteira) or Tyr\'ahnee-Phonoi.jpg (Tyr\'ahnee Phonoi).',
      [Locale.SV]: 'Ta inte bort några blanksteg eller specialtecken från namnet. Exempel: kahina-soteira.png'
      + ' (Kahina Soteira) eller Tyr\'ahnee-Phonoi.jpg (Tyr\'ahnee Phonoi).',
    }
  },
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
      [Locale.EN]: 'User already exists',
    },
    doesNotExistError: {
      [Locale.SV]: 'Personen existerar inte',
      [Locale.EN]: 'Person does not exist',
    },
  },
};
const defaultLocale: Locale = Locale.EN;

type Dictionary = {
  [group in keyof typeof dictionary]: {
    [field in keyof typeof dictionary[group]]: {
      [locale in Locale]: string;
    };
  };
};

export const useDictionary = () => ({
  dictionary: (dictionary as Dictionary),
  getDictionaryValue: <G, >(
    group: G & keyof Dictionary,
    field: keyof Dictionary[G & keyof Dictionary],
    locale: Locale = defaultLocale,
  ): string | undefined => (dictionary as Dictionary)?.[group]?.[field]?.[locale]
    ?? (dictionary as Dictionary)?.[group]?.[field]?.[defaultLocale],
});
