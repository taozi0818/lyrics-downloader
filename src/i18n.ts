const EN = {
  'example.case': 'content of example',
  'main.desc': 'Lyrics downloader',
  'info.desc': 'display information of this tool',
  'lyrics.desc_download': 'Download lyrics',
  'lyrics.download_success': 'download successfully',
  'lyrics.download_failed': 'download failed',
};

type LangCase = {
  [key in keyof typeof EN]: string;
};

export type I18nKey = keyof typeof EN;

const ZH: LangCase = {
  'example.case': '示例',
  'main.desc': '歌词下载器',
  'info.desc': '显示工具信息',
  'lyrics.desc_download': '下载歌词',
  'lyrics.download_success': '下载成功',
  'lyrics.download_failed': '下载失败',
};

const languageMap = {
  en: EN,
  zh: ZH,
  // alias
  cn: ZH,
  us: EN,
};

function getLang(lang = 'en') {
  return languageMap[lang] || languageMap.en;
}

/**
 * Simple i18n, support for displaying help information in chinese, to help some CLI user.
 */
export default class I18n {
  private readonly lang: LangCase;

  constructor(lang = 'en') {
    const p = lang.toLowerCase();
    this.lang = getLang();
  }

  public t(key: I18nKey) {
    return this.lang[key];
  }
}

export function t(lang = 'en', key: I18nKey) {
  return getLang(lang)[key];
}
