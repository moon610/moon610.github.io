// 核心模块：novel-reader.js
import { DataProcessor } from './data-processor.js';
import { ViewManager } from './view-manager.js';
import { EventHandler } from './event-handler.js';
import { ChunkedString } from './chunkedString.js';
import { ConfigManager } from './config-manager.js';
import { Utils } from './util.js';
// import PluginSystem from './plugin-system.js';

class NovelReader {
  constructor(options = {}) {
    this.options = {
      container: '#reader-container',
      chapterRegex: /第[一二三四五六七八九十百千零]+章/g,
      adPatterns: [/欢迎访问.*网站/g, /\(本章完\)/g],
      ...options
    };

    // 初始化核心模块
    this.dataProcessor = new DataProcessor(this.options);
    this.viewManager = new ViewManager(this.options);
    this.eventHandler = new EventHandler(this.options);
    this.configManager = new ConfigManager();
    this.chunkedString = new ChunkedString();
    this.utils = new Utils();
    // this.pluginSystem = new PluginSystem(this);

    // 初始化模块通信
    this.setupModuleCommunication();
    this.setupDefaultEvents();
  }

  async load(content) {
    try {
      // this.chunkedString._init(content);
      const processedData = await this.dataProcessor.process(content);
      this.viewManager.render(processedData);
      // this.viewManager.updateProgress();
    } catch (error) {
      console.error('内容加载失败:', error);
    }
  }

  setupModuleCommunication() {
    // 数据处理完成事件
    this.dataProcessor.on('process-complete', (data) => {
      this.viewManager.render(data);
    });

    // 视图翻页事件
    this.viewManager.on('page-change', (page) => {
      this.currentPage = page;
      this.configManager.update('lastPage', page);
    });

    // 配置变更事件
    this.configManager.on('config-update', (config) => {
      this.viewManager.applyStyles(config);
    });
  }

  setupDefaultEvents() {
    this.eventHandler.on('prePage', () => {
      this.viewManager.prevPage();
    });
    this.eventHandler.on('nextPage', () => {
      this.viewManager.nextPage();
    });

    // 移动端手势
    this.eventHandler.registerSwipe({
      left: () => this.viewManager.nextPage(),
      right: () => this.viewManager.prevPage()
    });
  }
}

const reader = new NovelReader({
  container: '#app',
  chapterRegex: /第[一二三四五六七八九十百千零]+章/g,
});


const url = new URL(location.href)
const searchParams = url.searchParams
const fileUrl = searchParams.get('file')
console.log('url', fileUrl)

// const fileUrl = 'http://localhost:5244/d/local/FTP/%E5%82%AC%E7%9C%A0sm.txt?sign=exq1Y6clcSni9kbbUnhl8su9XEp94fz2AIWzsQTinaM=:0'
if (!fileUrl)
  reader.load('无内容')
else {
  const response = fetch(fileUrl).then((response) => {
    // 检查响应是否成功
    if (!response.ok || response.status !== 200) {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }
    const bookname = fileUrl.match(/.*\/([^.]*)\.txt[\S\s]*$/);
    if (bookname) {
      document.title = bookname[1];
      reader.bookname = bookname[1];
      reader.viewManager.setBookName(bookname[1]);
    }

    // 读取文件内容为文本
    reader.utils.getChar(response).then(data => {
      reader.load(data)
    })
  }).catch(error => {
    console.error('发生错误:', error);
    reader.load('内容加载失败')
  });
}
// reader.load('测试内容');