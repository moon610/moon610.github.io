// 数据处理模块：data-processor.js
import { EventHandler } from "./event-handler.js";
export class DataProcessor {
  constructor(options) {
    this.chapterRegex = options.chapterRegex;
    this.adPatterns = options.adPatterns;
    // this.worker = new DataWorker();
  }

 process(text, options = { chapterRegex: this.chapterRegex }) {
    try {
      // if (text.length > 100000) {
      //   return await this.worker.processLargeText(text);
      // }
      text = this.filterAds(text);
      let lastEnd = 0;
      const chapters = this.splitChapters(text, options.chapterRegex)
      .map((cur, i) => {
        const index = cur.content.indexOf('\n');
        if (index !== -1) {
          cur.content = cur.content.slice(0, index) + '\n' + cur.content.slice(index) + '\n\n\n';
        }
        const resullt =  {
          title: cur.title,
          start: lastEnd,
          end: lastEnd + cur.content.length,
          content: cur.content
        }
        lastEnd = resullt.end;
        return resullt;
      });

      const result= {
        chapters: chapters.map(cur => {
          return {
            title: cur.title,
            start: cur.start,
            end: cur.end,
          };
        }),
        cleanText: chapters.reduce((acc, cur) => {
          return acc + cur.content;
        }, '')
      };
      console.log('result', chapters)
      return result;
    } catch (error) {
      throw new Error(`数据处理失败: ${error.message}`);
    }
  }

  splitChapters(text, chapterRegex = this.chapterRegex) {
    const chapters = [];
    let lastIndex = 0;
    let match = chapterRegex.exec(text);

    if (match === null) {
      return [{ title: '未匹配到章节', start: 0, end: text.length, content: text }];
    }

    while (match !== null) {
      if (chapters.length === 0 && match.index > 0) {
        chapters.push({
          title: '前言',
          start: 0,
          end: match.index,
          content: text.substring(0, match.index)
        });
        chapterRegex.lastIndex = 0;
      } else if (chapters.length === 0 && match.index === 0) {
        const start = 0;
        chapters.push({
          title: this.getTitle(text, start),
          start: start,
          end: match.index + match[0].length,
          content: text.substring(start, match.index)
        });
      } else {
        const lastChapter = chapters.at(-1);
        lastChapter.end = match.index;
        lastChapter.content = text.substring(lastChapter.start, match.index);

        const start = match.index;
        chapters.push({
          title: this.getTitle(text, match.index),
          start,
          end: match.index + match[0].length,
          content: text.substring(start, match.index + match[0].length)
        });
      }
      // console.log(chapterRegex.lastIndex)
      lastIndex = match.index;
      // chapterRegex.lastIndex = match.index + match[0].length;
      match = chapterRegex.exec(text);
    }
    // 添加最后一章
    if (match === null) {
      const lastChapter = chapters.at(-1);
      lastChapter.end = text.length;
      lastChapter.content = text.substring(lastChapter.start, text.length);
    }
    // console.log(chapters)

    return chapters;
  }

  filterAds(text) {

    const paragraphs = text.split(/\n\s*\n/);

    // 5. 首行缩进 + 清洗每段前后空格
    return paragraphs
      .filter(p => p.trim().length > 0)
      .map(p => `　　${p.trim()}`).join('\n');

    // return this.adPatterns.reduce((str, pattern) =>
    //   str.replace(pattern, ''), text);
  }

  on(event, callback) {

  }

  getTitle(text, startIndex) {
    const endIndex = text.indexOf('\n', startIndex);
    text.indexOf('/n', startIndex);
    if (endIndex === -1) {
      return text.substring(startIndex);
    }
    return text.substring(startIndex, endIndex);
  }


}