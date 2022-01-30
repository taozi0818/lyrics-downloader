import { t, I18nKey } from '../i18n';

export function enAndZh(key: I18nKey) {
  const content = t('en', key);

  return content ? `${content} - ${t('zh', key)}` : '';
}
