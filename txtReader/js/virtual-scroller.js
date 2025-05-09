// 虚拟滚动实现：virtual-scroller.js
export class VirtualScroller {
  constructor(container) {
    this.container = container;
    this.fullText = '无内容';
    this.cache = new Map();
    this.pages = [[0, 10]];
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

  loadData(fullText) {
    this.fullText = fullText;
    this.pages = this.calculateEveryPageSize(fullText);
    this.totalPages = this.pages.length;
    this.renderCurrentPage();
  }

  renderCurrentPage() {
    this.container.innerHTML = ''; // 清空容器
    document.querySelector('.page-info').textContent = this.currentPage + 1 + '/' + this.totalPages;

    const start = this.pages[this.currentPage][0];
    const end = this.pages[this.currentPage][1];

    const pageElement = document.createElement('div');
    pageElement.className = 'page';
    pageElement.textContent = this.fullText.slice(start, end);

    this.container.appendChild(pageElement);
  }

  goToPage(pageNumber) {
    if (pageNumber < 0 || pageNumber >= this.totalPages) return this.currentPage + 1 + '/' + this.totalPages;
    this.currentPage = pageNumber;
    this.renderCurrentPage();
    return this.currentPage + 1 + '/' + this.totalPages;
  }

  prevPage() {
    return this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  getProgress() {
    //获取阅读进度
  }

  calculateMaxCharsInContainer(text) {
    //🔒 安全判断 1: 容器高度为 0，避免死循环
    const style = window.getComputedStyle(this.container);
    const containerHeight = this.container.offsetHeight - style.paddingTop.replace('px', '') - style.paddingBottom.replace('px', '');
    const containerWidth = this.container.offsetWidth - style.paddingLeft.slice(0, -2) - style.paddingRight.slice(0, -2);
    if (containerHeight <= 0) {
      console.warn('容器高度为 0，跳过字符数计算');
      return 0;
    }
    const temp = document.createElement('div');

    // 设置样式以匹配 .page 的显示效果
    temp.style.position = 'absolute';
    temp.style.width = `${containerWidth * 0.85}px`;
    // temp.style.height = `${containerHeight}px`;
    // temp.style.overflow = 'hidden';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'pre-wrap';
    temp.style.wordBreak = 'break-all';
    temp.style.fontFamily = style.fontFamily;
    temp.style.letterSpacing = style.letterSpacing;
    temp.style.fontSize = style.fontSize;
    temp.style.lineHeight = style.lineHeight;
    temp.style.fontFamily = style.fontFamily;


    this.container.parentNode.appendChild(temp);

    let low = 0;
    // let high = text.length;
    let high =  Math.min(text.length, 1000);
    let best = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      temp.textContent = text.slice(0, mid);
      const contentHeight = temp.offsetHeight;

      if (contentHeight <= containerHeight - 5) {
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

  calculateEveryPageSize(content) {
    //计算每页切片
    const pages = [];
    let start = 0, end = 0;
    while (content.length > 0) {
      end = this.calculateMaxCharsInContainer(content);
      content = content.slice(end);
      pages.push([start, start += end])
    }
    console.log(pages);
    return pages;
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
          requestAnimationFrame(() => {
            this.pages = this.calculateEveryPageSize(this.fullText);
            this.totalPages = this.pages.length;
            this.renderCurrentPage();
          });
        }
      }, this.debounceDelay); // 2秒后执行
    }
  }

}