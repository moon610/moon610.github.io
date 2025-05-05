// 视图管理模块：view-manager.js
import { VirtualScroller } from './virtual-scroller.js';
export class ViewManager {
    constructor(options) {
      this.container = document.querySelector(options.container);
      this.isMobile = false;
      this.currentChapter = 0;
      this.pageSize = 3000; // 默认每页字符数
      this.initUI();
      this.content_container = document.querySelector('.reader-content');
      this.virtualScroller = new VirtualScroller(this.content_container);
    }

    render(data) {
      this.updateLayout();
      this.virtualScroller.loadData(data.cleanText);
      this.setUpUI();
      // window.addEventListener('resize', this.handleResize.bind(this));
    }

    initUI() {
      this.container.innerHTML = `
      <div class="root-view">
        <div class="reader-container">
          <div class="reader-header">
            <div class="progress-bar"></div>
          </div>
          <div class="reader-content"></div>
          <div class="reader-controls">
            <button class="prev-btn">&lt;上一页</button>
            <div class="page-info"></div>
            <button class="next-btn">下一页&gt;</button>
          </div>
        </div>
      </div>
      `;

      this.contentElement = this.container.querySelector('.reader-content');
      this.prevBtn = this.container.querySelector('.prev-btn');
      this.nextBtn = this.container.querySelector('.next-btn');

      // 绑定事件
      this.prevBtn.addEventListener('click', () => this.prevPage());
      this.nextBtn.addEventListener('click', () => this.nextPage());
    }

    setUpUI() {
      document.querySelector('.page-info').textContent = this.virtualScroller.currentPage + 1 + '/' + this.virtualScroller.totalPages;
    }

    updateLayout() {
      this.isMobile = window.innerWidth < 768;
      this.pageSize = this.isMobile ? 1500 : 3000;
      // this.virtualScroller.updatePageSize(this.pageSize);
      this.container.classList.toggle('mobile', this.isMobile);
    }

    prevPage() {
      const pageInfo = this.virtualScroller.prevPage();
      document.querySelector('.page-info').textContent = pageInfo;
      this.updateProgress();
    }

    nextPage() {
      const pageInfo = this.virtualScroller.nextPage();
      document.querySelector('.page-info').textContent = pageInfo;
      this.updateProgress();
    }

    updateProgress() {
      const progress = this.virtualScroller.getProgress();
      this.container.querySelector('.progress-bar').style.width = `${progress}%`;
    }

    on(event, callback){

    }
  }