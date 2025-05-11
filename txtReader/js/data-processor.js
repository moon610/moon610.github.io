// 数据处理模块：data-processor.js
export class DataProcessor {
    constructor(options) {
      this.chapterRegex = options.chapterRegex;
      this.adPatterns = options.adPatterns;
      // this.worker = new DataWorker();
    }

    async process(text) {
      try {
        // if (text.length > 100000) {
        //   return await this.worker.processLargeText(text);
        // }
        return {
          chapters: this.splitChapters(text),
          cleanText: this.filterAds(text)
        };
      } catch (error) {
        throw new Error(`数据处理失败: ${error.message}`);
      }
    }

    splitChapters(text) {
      const chapters = [];
      let lastIndex = 0;
      let match = this.chapterRegex.exec(text);

      if(match === null) {
        console.log('获取章节:', match)
        return [{ title: '未匹配到章节', start: 0, end: text.length }];
      }

      while (match !== null) {
        if (chapters.length > 0) {
          const start = chapters[chapters.length - 1].end;
          chapters.push({
            title: match[0],
            start,
            end: match.index
          });
        } else {
          chapters.push({
            title: '前言',
            start: 0,
            end: match.index
          });
        }
        lastIndex = match.index;
      }

      // 添加最后一章
      if (lastIndex < text.length) {
        chapters.push({
          title: '尾声',
          start: lastIndex,
          end: text.length
        });
      }

      return chapters;
    }

    filterAds(text) {
      return this.adPatterns.reduce((str, pattern) =>
        str.replace(pattern, ''), text);
    }

    on(event, callback) {

    }


  }