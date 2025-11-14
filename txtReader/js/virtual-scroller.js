// 虚拟滚动实现：virtual-scroller.js
export class VirtualScroller {
  constructor(container) {
    this.container = container;
    this.fullText = '无内容';
    this.cache = new Map();
    this.pages = [];
    this.totalPages = 1;
    this.currentPage = 0;

    // 添加 resize 监听
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(document.body);

    // 节流 & 尺寸变化检测
    this.lastResizeTime = 0;
    this.resizeInterval = 2000; // 最小触发间隔
    this.lastWidth = 0;
    this.lastHeight = 0;
    this.sizeThreshold = 10 // 容器尺寸变化超过这个值才重新计算
    // 防抖相关
    this.resizeDebounceTimer = null;
    this.debounceDelay = 2000; // 2秒防抖延迟

  }

  _init() {

  }

  async loadData(data) {
    this.bookName = document.querySelector('.book-name').textContent;
    this.fullText = data.cleanText;
    this.chapters = data.chapters;
    // console.log(data.cleanText.substring(data.chapters[3].start, data.chapters[3].end))
    // this.pages = this.calculateEveryPageSize(fullText);
    // this.totalPages = this.pages.length;
    this.pages = await this.calculateNextPageSize(this.fullText);
    console.log('pages', this.pages)
    this.getProgress(this.bookName);
    await this.renderCurrentPage();
  }

  async renderCurrentPage() {

    // this.container.innerHTML = ''; // 清空容器
    if (this.currentPage >= this.pages.length) {
      await this.calculateNextPageSize(this.fullText, this.currentPage - this.pages.length + 1);
      this.currentPage >= this.pages.length && (this.currentPage = this.pages.length - 1);
    }
    document.querySelector('.page-info').textContent = this.currentPage + 1 + '/' + this.totalPages;


    const start = this.pages[this.currentPage][0];
    const end = this.pages[this.currentPage][1];

    const pageElement = document.querySelector('.reader-content .page');
    // pageElement.className = 'page';
    // pageElement.textContent = this.fullText.slice(start, end);
    pageElement.innerHTML = '';
    const textContent = this.fullText.slice(start, end).split('\n');
    textContent.forEach((line, index) => {
      const lineElement = document.createElement('p');
      lineElement.textContent = line;
      pageElement.appendChild(lineElement);
    });

    //计算当前在哪一章节并修改顶端标题名
    for (const [index, chapter] of this.chapters.entries()) {
      if (end >= chapter.start && end <= chapter.end) {
        document.querySelector('.chapter-name').textContent = chapter.title;
        // EventHandler.getInstance().emit('chapterChange', index);
        this.currentChapter = index;
        break;
      }
    }
    this.saveProgress(this.bookName, start);
    // this.container.appendChild(pageElement);
  }

  goToPage(pageNumber) {
    pageNumber = Number(pageNumber);
    if (pageNumber < 0 || pageNumber >= this.totalPages) return this.currentPage + 1 + '/' + this.totalPages;
    if (!this.pages[pageNumber] && this.pages.at(-1)[1] !== this.fullText.length) {
      this.calculateNextPageSize(this.fullText);
    }
    //todo 使用set每次修改currentPage时自动刷新页面
    this.currentPage = pageNumber;
    this.renderCurrentPage();
    return this.currentPage;
  }

  jumpToChar(charNum) {
    const charNumToPage = this.charToPage(charNum);
    // console.log('charNumToPage', charNumToPage, this.pages);
    this.goToPage(charNumToPage);

  }

  charToPage(charNum) {
    if (charNum <= 0) {
      charNum = 1;
    }
    if (charNum >= this.fullText.length) {
      charNum = this.fullText.length - 1;
    }
    let charNumToPage = 0, n = this.pages.length - 1;
    while (charNum > this.pages[charNumToPage][1]) {
      charNumToPage++;
      if (charNumToPage >= n) {
        this.calculateNextPageSize(this.fullText);
        n = this.pages.length - 1;
      }
    }
    return charNumToPage;
  }

  prevPage() {
    return this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  getProgress(bookName) {
    //获取阅读进度
    const progressCharNum = JSON.parse(localStorage.getItem('read-progress'))?.[bookName] || 1;
    console.log('进度', progressCharNum, localStorage.getItem('read-progress'));
    this.currentPage = this.charToPage(progressCharNum);
    return this.currentPage;
  }

  saveProgress(bookName, index = 0) {
    //通过localstorage保存阅读进度
    const progress = JSON.parse(localStorage.getItem('read-progress')) || {};
    progress[bookName] = index + 1
    localStorage.setItem('read-progress', JSON.stringify(progress));

  }

  calculateMaxCharsInContainer(text) {
    //🔒 安全判断 1: 容器高度为 0，避免死循环
    const container = document.querySelector('.page');
    const style = window.getComputedStyle(container);
    const containerHeight = container.offsetHeight - style.paddingTop.replace('px', '') - style.paddingBottom.replace('px', '');
    const containerWidth = container.offsetWidth - style.paddingLeft.slice(0, -2) - style.paddingRight.slice(0, -2);
    if (containerHeight <= 0) {
      console.warn('容器高度为 0，跳过字符数计算');
      return 0;
    }
    const temp = document.createElement('div');

    // 设置样式以匹配 .page 的显示效果
    temp.style.position = 'absolute';
    temp.style.width = `${containerWidth}px`;
    // temp.style.height = `${containerHeight}px`;
    // temp.style.overflow = 'hidden';
    temp.style.visibility = 'hidden';
    // temp.style.whiteSpace = 'pre-wrap';
    temp.style.textIndent = style.textIndent;
    temp.style.wordBreak = 'break-all';
    temp.style.fontFamily = style.fontFamily;
    temp.style.letterSpacing = style.letterSpacing;
    temp.style.fontSize = style.fontSize;
    temp.style.lineHeight = style.lineHeight;
    temp.style.fontFamily = style.fontFamily;


    this.container.parentNode.appendChild(temp);

    let low = 0;
    // let high = text.length;
    let high = Math.min(text.length, 1000);
    let best = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      // temp.textContent = text.slice(0, mid);
      temp.innerHTML = '';
      const textContent = text.slice(0, mid).split('\n');
      textContent.forEach((line, index) => {
        const lineElement = document.createElement('p');
        lineElement.textContent = line;
        temp.appendChild(lineElement);
      });
      const contentHeight = temp.offsetHeight;

      if (contentHeight <= containerHeight - 10) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }

      // 🔒 安全判断 3: 如果 mid 没有变化，跳出循环防止死循环
      if (high < low) break;
    }

    this.container.parentNode.removeChild(temp);
    return best;
  }

  calculateNextPageSize(text, nextPageCount = 5) {
    //计算后面5页页切片
    // if(this.pages.length - this.currentPage > 1) {
    //   return this.pages;
    // }
    const maxCharsEveryPage = 1500;
    // const nextPageCount = 5;
    let maxText = '', start = 0, end = 0;
    if (this.pages.length === 0) {
      maxText = text.slice(0, maxCharsEveryPage * nextPageCount);
    } else {
      start = this.pages.at(-1)[1];
      maxText = text.slice(start, start + maxCharsEveryPage * nextPageCount);
    }
    for (let i = 0; i < nextPageCount && maxText.length !== 0; i++) {
      end = this.calculateMaxCharsInContainer(maxText);
      maxText = maxText.slice(end);
      this.pages.push([start, start += end]);
    }
    this.totalPages = Math.ceil(this.pages.length + (this.fullText.length - this.pages.at(-1)[1]) / (this.pages.at(-1)[1] / this.pages.length));

    return this.pages;
  }

  handleResize() {
    const containerRect = this.container.getBoundingClientRect();
    const widthChanged = Math.abs(containerRect.width - this.lastWidth) > this.sizeThreshold;
    const heightChanged = Math.abs(containerRect.height - this.lastHeight) > this.sizeThreshold;

    if (widthChanged || heightChanged) {
      // 清除之前的定时器
      clearTimeout(this.resizeDebounceTimer);

      // 设置新的定时器，2秒后执行
      this.resizeDebounceTimer = setTimeout(() => {
        this.lastWidth = containerRect.width;
        this.lastHeight = containerRect.height;

        if (this.fullText && this.fullText !== '无内容') {
          const currentChapter = this.pages[this.currentPage][0] + 1;
          requestAnimationFrame(async () => {
            this.pages = []
            this.pages = await this.calculateNextPageSize(this.fullText);
            this.jumpToChar(currentChapter);
            console.log('resize calc');
          });
        }
      }, this.debounceDelay); // 2秒后执行
    }
  }

}