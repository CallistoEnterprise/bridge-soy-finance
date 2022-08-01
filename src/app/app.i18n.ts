import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ch from '../assets/locales/ch.json';
import en from '../assets/locales/en.json';
import ru from '../assets/locales/ru.json';

export enum Language {
  English = 'en',
  Chinese = 'ch',
  Russian = 'ru'
}

const resources = {
  [Language.English]: {
    translation: en
  },
  [Language.Chinese]: {
    translation: ch
  },
  [Language.Russian]: {
    translation: ru
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Language.English, // Change current language on the end of this file
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

export function getCurrentLanguage(): string {
  return i18n.language.toUpperCase();
}

export type LanguageReturnType = string[];

export function getLanguagesList(): LanguageReturnType[] {
  return [
    ['English', Language.English],
    ['Chinese', Language.Chinese],
    ['Russian', Language.Russian]
  ];
}

export function changeCurrentLanguage(language: Language): void {
  i18n.changeLanguage(language);
}

export function existsLanguageByCode(code: string): boolean {
  const languages: LanguageReturnType[] = getLanguagesList();
  let exists = false;

  languages.forEach((lang) => {
    if (lang[0].toLowerCase() === code.toLowerCase()) {
      exists = true;
      return;
    }
  });

  return exists;
}
