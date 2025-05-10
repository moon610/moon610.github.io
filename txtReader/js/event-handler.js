export class EventHandler {
    constructor(options) {
        this.container = document.querySelector(options.container);
        this.handlers = new Map();
        this.init();
    }

    init() {
        this.cancelDefaultEvents();
        // this.registerCoreEvents();
        // this.registerGestures();
    }

    /**
  * 注册核心事件（键盘 + 触摸）
  */
    registerCoreEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.emit('prevPage');
            if (e.key === 'ArrowRight') this.emit('nextPage');
        });

        // 触摸事件（用于移动端滑动翻页）
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 50) {
                this.emit(deltaX > 0 ? 'prevPage' : 'nextPage');
            }
        });
    }

    /**
     * 注册鼠标滚轮事件（可选）
     */
    registerWheel(handler) {
        window.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) this.emit('nextPage');
            else this.emit('prevPage');
        });
    }

    /**
     * 注册触摸事件（可选）
        * @param {Function} handler - 触摸事件的处理函数
        *
     */
    registerTouch(handler) {
        window.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        window.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        });

        window.addEventListener('touchend', (e) => {
            const deltaX = this.touchEndX - this.touchStartX
        })
    }

    /**
     * 注册滑动事件
     * @param {Function} handler - 滑动事件处理函数
     */
    registerSwipe(handler) {
        let touchStartX = 0, touchEndX = 0;
        let touchStartTime  = 0, touchEndTime = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
        });

        window.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
            touchEndTime = Date.now();
            // console.log(touchEndX)
        });

        window.addEventListener('touchend', (e) => {
            const deltaX = touchEndX - touchStartX
            const deltaT = touchEndTime - touchStartTime;
            const touchSpeed = deltaX / deltaT;
            if (touchSpeed > 0.5) {
                handler.right();
            } else if (touchSpeed < -0.5) {
                handler.left();
            }
            // console.log(touchSpeed)
        })
    }

    /**
     * 注册自定义事件监听
     * @param {string} eventName
     * @param {function} callback
     */
    on(eventName, callback) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName).push(callback);
    }

    /**
     * 移除某个事件的监听
     * @param {string} eventName
     */
    off(eventName) {
        this.handlers.delete(eventName);
    }

    /**
     * 触发指定事件
     * @param {string} eventName
     * @param  {...any} args
     */
    emit(eventName, ...args) {
        if (this.handlers.has(eventName)) {
            this.handlers.get(eventName).forEach((handler) => handler(...args));
        }
    }

    /**
     * 禁用浏览器默认行为（如页面滚动、拖拽）
     */
    cancelDefaultEvents() {
        ['touchmove', 'touchstart', 'wheel'].forEach((event) => {
            window.addEventListener(event, (e) => {
                e.preventDefault();
            }, { passive: false });
        });
    }

}