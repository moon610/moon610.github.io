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
      chapterRegex: /^[ 　\\t]{0,4}(?:序章|序言|卷首语|扉页|楔子|正文(?!完|结)|终章|后记|尾声|番外|第?\\s{0,4}[\\d〇零一二两三四五六七八九十百千万壹贰叁肆伍陆柒捌玖拾佰仟]+?\\s{0,4}(?:章|节(?!课)|卷|集(?![合和])|部(?![分赛游])|篇(?!张))).{0,30}$/g,
      adPatterns: [/欢迎访问.*网站/g, /\(本章完\)/g],
      ...options
    };

    // 初始化核心模块
    this.eventHandler = new EventHandler(this.options);
    this.viewManager = new ViewManager(this.options);
    this.configManager = new ConfigManager();
    // this.chunkedString = new ChunkedString();
    this.dataProcessor = new DataProcessor(this.options);
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
    // this.dataProcessor.on('process-complete', (data) => {
    //   this.viewManager.render(data);
    // });

    // 视图翻页事件
    // this.viewManager.on('page-change', (page) => {
    //   this.currentPage = page;
    //   this.configManager.update('lastPage', page);
    // });

    // 配置变更事件
    // this.configManager.on('config-update', (config) => {
    //   this.viewManager.applyStyles(config);
    // });
    // 新增监听：重新划分章节
    this.viewManager.on('reprocess-chapters', async () => {
      const content = await this.utils.fetchContentAgain(); // 假设你有方法重新获取内容
      const processedData = await this.dataProcessor.process(content);
      this.viewManager.render(processedData);
    });
  }

  setupDefaultEvents() {
    const loadingIndicator = document.querySelector('.loading');
    let lastCallbackTime = performance.now();
    const checkForLag = () => {
      const now = performance.now();
      const timeSinceLastCheck = now - lastCallbackTime;

      // 如果超过 500ms 没有进入 idle 回调，则认为卡顿
      if (timeSinceLastCheck > 500) {
        loadingIndicator.style.visibility = 'visible';
      } else {
        loadingIndicator.style.visibility = 'hidden';
      }
      // 更新最后检查时间
      lastCallbackTime = now;

      // 使用 setTimeout 作为兜底
      setTimeout(() => {
        requestIdleCallback(checkForLag, { timeout: 1000 });
      }, 200); // 每 200ms 尝试一次 idle callback
    };

    // 启动首次检测
    // requestIdleCallback(checkForLag, { timeout: 1000 });

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