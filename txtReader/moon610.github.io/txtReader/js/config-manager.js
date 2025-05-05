const defaultConfig = {
    fontSize: 16,
    lineHeight: 1.5,
    theme: 'light',
    // ...其他配置项
};

export class ConfigManager {
    constructor() {
        this.config = { ...defaultConfig };
    }

    update(key, value) {
        this.config[key] = value;
        this.applyConfig();
    }

    applyConfig() {
        document.documentElement.style.setProperty(
            '--font-size', `${this.config.fontSize}px`
        );
        // 应用其他样式配置...
    }

    on(event, callback) {
        // 监听配置项变化事件
    }
}