import type { TextInputProps } from 'react-native';

/** Empêche Gboard / le gestionnaire de mots de passe de traiter le champ comme un login. */
export const autofillOffProps: Pick<
  TextInputProps,
  'autoComplete' | 'textContentType' | 'importantForAutofill' | 'secureTextEntry'
> = {
  autoComplete: 'off',
  textContentType: 'none',
  importantForAutofill: 'no',
  secureTextEntry: false,
};

export const autofillNameProps: Pick<
  TextInputProps,
  'autoComplete' | 'textContentType' | 'importantForAutofill' | 'secureTextEntry'
> = {
  autoComplete: 'name',
  textContentType: 'none',
  importantForAutofill: 'no',
  secureTextEntry: false,
};
