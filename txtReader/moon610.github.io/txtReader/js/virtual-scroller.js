// 虚拟滚动实现：virtual-scroller.js
export class VirtualScroller {
  constructor(container) {
    this.container = container;
    this.cache = new Map();
    this.visibleRange = [0, 0];
    this.pageSize = 500;
    this.totalPages = 0;
    this.currentPage = 0;
    this.fullText = '无内容';
    this.observer = new IntersectionObserver(this.handleObserve.bind(this));
  }

  loadData(fullText) {
    this.fullText = fullText;
    this.totalPages = Math.ceil(fullText.length / this.pageSize);
    this.currentPage = 0;
    this.renderCurrentPage();
  }

  renderCurrentPage() {
    this.container.innerHTML = ''; // 清空容器
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

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

  getLineHeight() {
    const testLine = document.createElement('div');
    testLine.className = 'page';
    testLine.textContent = '测试行高'; // 设置示例文本
    this.container.appendChild(testLine);
    const height = testLine.offsetHeight;
    this.container.removeChild(testLine); // 移除临时元素
    return height;
  }

  calculatePageSize() {
    const lineHeight = this.getLineHeight(); // 获取单行高度
    const containerHeight = this.container.clientHeight; // 容器总高度
    const linesPerPage = Math.floor(containerHeight / lineHeight); // 每页可容纳的行数

    // 假设每行平均字符数为 30（可根据实际需求进行调整）
    return linesPerPage * 30;
  }

  renderVisibleContent() {
    const startPage = Math.max(0, this.visibleRange[0] - 2);
    const endPage = Math.min(this.totalPages, this.visibleRange[1] + 2);

    // 清理不可见内容
    Array.from(this.container.children).forEach(child => {
      const page = parseInt(child.dataset.page);
      if (page < startPage || page > endPage) {
        this.container.removeChild(child);
        this.cache.delete(page);
      }
    });

    // 添加新内容
    for (let page = startPage; page <= endPage; page++) {
      if (!this.cache.has(page)) {
        const fragment = this.createPageFragment(page);
        this.container.appendChild(fragment);
        this.cache.set(page, fragment);
      }
    }
  }

  createPageFragment(page) {
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    const div = document.createElement('div');
    div.className = 'page';
    div.dataset.page = page;
    div.textContent = this.fullText.slice(start, end);
    this.observer.observe(div);
    return div;
  }

  handleObserve(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const page = parseInt(entry.target.dataset.page);
        this.visibleRange = [
          Math.min(page, this.visibleRange[0]),
          Math.max(page, this.visibleRange[1])
        ];
      }
    });
  }
}