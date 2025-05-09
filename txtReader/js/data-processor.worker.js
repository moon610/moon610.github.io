// Web Worker实现：data-processor.worker.js
self.onmessage = function(e) {
    const { text, chapterRegex, adPatterns } = e.data;

    const splitChapters = (text) => {
      // 实现与主线程相同的章节分割逻辑
    };

    const filterAds = (text) => {
      return adPatterns.reduce((str, pattern) =>
        str.replace(new RegExp(pattern.source, pattern.flags), ''));
    };

    const result = {
      chapters: splitChapters(text),
      cleanText: filterAds(text)
    };

    self.postMessage(result);
  };

