// 视图管理模块：view-manager.js
import { VirtualScroller } from './virtual-scroller.js';
import { EventHandler } from './event-handler.js';
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
    this.updateMenuList(data.chapters);
    this.virtualScroller.loadData(data);
    this.setUpUI();
    // window.addEventListener('resize', this.handleResize.bind(this));
  }

  initUI() {
    this.container.innerHTML = `
      <div class="root-view">
        <div class="reader-container">
          <div class="reader-header">
            <div class="chapter-name">第一章</div>
          </div>
          <div class="reader-content">
            <div class="page"></div>
          </div>
          <div class="reader-controls">
            <button class="prev-btn">&lt;上一页</button>
            <div class="book-name"></div>
            <div class="page-info"></div>
            <button class="next-btn">下一页&gt;</button>
          </div>
          <div class="menu">
            <div class="menu-catalogue"></div>
          </div>
          <div class="modal notshow">
            <section  class="modal-container">
              <ul class="menu-list">
               <form class="search-form">
                <input type="number" class="search-input">
                <input type="submit"  value = "跳转" class="search-btn">
                </form>
              </ul>
            </section>
          </div>
        </div>
      </div>
      `;

    this.contentElement = this.container.querySelector('.reader-content');
    this.prevBtn = this.container.querySelector('.prev-btn');
    this.nextBtn = this.container.querySelector('.next-btn');
    this.menuCatalogueBtn = this.container.querySelector('.menu-catalogue');
    // this.reSplitChapterBtn = this.container.querySelector('.re-split-chapter-btn');
    this.modal = document.querySelector('.modal');
    this.modalFormBtn = this.container.querySelector('.search-btn');

    // 绑定事件
    this.prevBtn.addEventListener('click', () => this.prevPage());
    this.nextBtn.addEventListener('click', () => this.nextPage());
    // this.menuCatalogueBtn.addEventListener('click', this.menuCatalogueBtnClick);
    this.menuCatalogueBtn.addEventListener('touchstart', this.menuCatalogueBtnClick);
    // this.reSplitChapterBtn.addEventListener('click', () => this.on('reSplitChapter', null));
    EventHandler.getInstance().registerClick(this.modalFormBtn, () => this.submitForm());
  }

  setBookName(name) {
    this.container.querySelector('.book-name').textContent = name;
  }

  setUpUI(options) {
    const menuList = document.querySelector('.menu-list');
    // menuList.addEventListener('touchend', (e) => {
    //   if (e.target.classList.contains('menu-lsititem')) {
    //     const index = e.target.dataset.index;
    //     this.virtualScroller.jumpToChar(index);
    //   }
    // });
    EventHandler.getInstance().registerClick(menuList, (e) => {
      if (e.target.classList.contains('menu-listitem')) {
        const index = e.target.dataset.index;
        this.virtualScroller.jumpToChar(index);
      }
    });
    const modal = document.querySelector('.modal');
    window.addEventListener('click', (e) => {

      if (e.target.classList.contains('menu-catalogue')) {
        if (modal.classList.contains('notshow')) {
          modal.classList.remove('notshow');
        } else {
          modal.classList.add('notshow');
        }
      } else if (!modal.classList.contains('notshow') && !modal.contains(e.target)) {
        modal.classList.add('notshow');
      }
    })

    const page = document.querySelector('.page');
    //滚轮事件
    EventHandler.getInstance().registerWheel(page, {
      wheelUp: () => { this.nextPage(); this.hideMenu() },
      wheelDown: () => { this.prevPage(); this.hideMenu() },
      // up: () => this.showMenu(),
      // down: () => this.hideMenu(),
    });

    EventHandler.getInstance().registerClick(page, () => {
      this.hideMenu()
    });

    // 移动端手势

    EventHandler.getInstance().registerSwipe(page, {
      swipeLeft: () => { this.nextPage(); this.hideMenu() },
      swipeRight: () => { this.prevPage(); this.hideMenu() },
      swipeUp: () => this.showMenu(),
      swipeDown: () => this.hideMenu(),
    });
  }

  updateLayout() {
    this.isMobile = window.innerWidth < 768;
    this.pageSize = this.isMobile ? 1500 : 3000;
    // this.virtualScroller.updatePageSize(this.pageSize);
    this.container.classList.toggle('mobile', this.isMobile);
  }

  prevPage() {
    const pageInfo = this.virtualScroller.prevPage();
    // this.updateProgress();
  }

  nextPage() {
    const pageInfo = this.virtualScroller.nextPage();
    // this.updateProgress();
  }

  showMenu() {
    // const menu = document.querySelector('.menu');
    // menu.style.bottom = '0';
    const modal = document.querySelector('.modal');
    if (modal.classList.contains('notshow')) {
      modal.classList.remove('notshow');
    }
  }

  hideMenu() {
    // const menu = document.querySelector('.menu');
    // const menuStyle = window.getComputedStyle(menu);
    // if (menuStyle.bottom === '0px') {
    //   menu.style.bottom = '-100px';
    // }

    const modal = document.querySelector('.modal');
    if (!modal.classList.contains('notshow')) {
      modal.classList.add('notshow');
    }


  }

  updateProgress() {
    // const progress = this.virtualScroller.getProgress();
    // this.container.querySelector('.progress-bar').style.width = `${progress}%`;
  }

  menuCatalogueBtnClick() {
    console.log('menuCatalogueBtnClick');
    const menuCatalogueBtn = document.querySelector('.menu-catalogue');
    const modal = document.querySelector('.modal');
    console.log('menuCatalogueBtnClick')
    // if (modal.classList.contains('notshow')) {
    //   modal.classList.remove('notshow');
    // } else {
    //   modal.classList.add('notshow');
    // }
  }

  updateMenuList(chapters) {
    const menuList = document.querySelector('.menu-list');
    chapters.forEach(chapter => {
      const li = document.createElement('li');
      li.textContent = chapter.title;
      li.dataset.index = chapter.start;
      li.classList.add('menu-listitem');
      menuList.appendChild(li);

    });

  }

  submitForm(event) {
    const input = document.querySelector('.search-input');
    const value = Number(input.value) - 1;
    this.virtualScroller.goToPage(value < 0 ? 0 : value);
    console.log(value);
    input.value = '';
    this.modal.classList.add('notshow');

  }


  on(event, callback) {

  }
}