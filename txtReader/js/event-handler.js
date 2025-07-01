let instance = null;

export class EventHandler {
    constructor(options) {
        if (instance) return instance;
        this.container = document.querySelector(options.container);
        this.handlers = new Map();
        this.init();
        instance = this;
    }

    init() {
        this.cancelDefaultEvents();
        this.registerCoreEvents();
        // this.registerGestures();
    }

    static getInstance() {
        return instance;
    }

    /**
  * 注册默认事件（键盘 + 触摸）
  */
    registerCoreEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.emit('prePage');
            if (e.key === 'ArrowRight') this.emit('nextPage');
        });
        //鼠标滚轮事件
        // window.addEventListener('wheel', (e) => {
        //      const page = document.querySelector('.page');
        //      if (page.contains(e.target)) {
        //          if (e.deltaY > 0) this.emit('nextPage');
        //          else this.emit('prePage');
        //      }
        // });


    }

    /**
     * 注册鼠标滚轮事件（可选）
     */
    registerWheel(triggerContainer, handler) {
        triggerContainer.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) handler.wheelUp();
            else handler.wheelDown();
        });
    }

    /**
     * 注册触摸与点击事件（可选）
        * @param {Function} handler - 触摸事件的处理函数
        *
     */
    registerClick(triggerContainer, handler) {
        let touchStartX = 0, touchEndX = 0,
            touchStartY = 0, touchEndY = 0,
            touchStartTime = 0, touchEndTime = 0;

        let isTouching = false;

        triggerContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isTouching = true;
        });

        triggerContainer.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaT = Date.now() - touchStartTime;
            if (deltaT < 300 && deltaX < 10 && deltaY < 10) {
                handler(e);
                // console.log('touch click')
            }
            isTouching = false;
        })

        triggerContainer.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.isMobile) {
                return;
            }
            handler(e);
        })
    }


    /**
    * 注册滑动事件
    * @param {Function} handler - 滑动事件处理函数
    */
    registerSwipe(triggerContainer, handler) {
        let touchStartX = 0, touchEndX = 0,
            touchStartY = 0, touchEndY = 0;
        let touchStartTime = 0, touchEndTime = 0;

        triggerContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        });

        triggerContainer.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
            touchEndTime = Date.now();
            // console.log(touchEndX)
        });

        triggerContainer.addEventListener('touchend', (e) => {
            // console.log(e.target)
            const deltaX = touchEndX - touchStartX
            const deltaY = touchEndY - touchStartY;
            const deltaT = touchEndTime - touchStartTime;
            const touchSpeedX = deltaX / deltaT;
            const touchSpeedY = deltaY / deltaT;
            if (touchSpeedX > 0.2 && Math.abs(touchSpeedX) > Math.abs(touchSpeedY)) {
                handler.swipeRight();
            }
            if (touchSpeedX < -0.2 && Math.abs(touchSpeedX) > Math.abs(touchSpeedY)) {
                handler.swipeLeft();
            }
            if (touchSpeedY > 0.2 && Math.abs(touchSpeedY) > Math.abs(touchSpeedX)) {
                handler.swipeDown();
            }
            if (touchSpeedY < -0.2 && Math.abs(touchSpeedY) > Math.abs(touchSpeedX)) {
                handler.swipeUp();
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
        const html = document.querySelector('body');
        [ 'touchstart','touchend','click', 'submit'].forEach((event) => {
            document.addEventListener(event, (e) => {
                if(!e.target.classList.contains('menu-lsititem')) {
                    e.preventDefault();
                }

            }, { passive: false });
        });
    }

}