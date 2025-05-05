export class EventHandler {
    constructor() {
        this.handlers = new Map();
    }

    init() {
        this.registerCoreEvents();
        this.registerGestures();
    }

    registerCoreEvents() {
        // PC端事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.emit('prevPage');
            if (e.key === 'ArrowRight') this.emit('nextPage');
        });

        // 移动端手势
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

    register(eventName, callback) {
    }

    registerSwipe(event) {
    }
}