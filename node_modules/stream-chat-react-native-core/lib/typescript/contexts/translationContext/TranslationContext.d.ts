import React from 'react';
import type { TranslationLanguages } from 'stream-chat';
import { TranslatorFunctions } from './types';
export declare const DEFAULT_USER_LANGUAGE: TranslationLanguages;
export type TranslationContextValue = TranslatorFunctions & {
    userLanguage: TranslationLanguages;
};
export declare const TranslationContext: React.Context<TranslationContextValue>;
type Props = React.PropsWithChildren<{
    value: TranslationContextValue;
}>;
export declare const TranslationProvider: ({ children, value }: Props) => React.JSX.Element;
export declare const useTranslationContext: () => TranslationContextValue;
export {};
//# sourceMappingURL=TranslationContext.d.ts.map