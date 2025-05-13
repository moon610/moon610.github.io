export class Utils {
    constructor() {

    }

    isUtf8(bytes, sampleSize = 4096) {
        const len = Math.min(bytes.length, sampleSize); // 只检测前 sampleSize 字节
        let i = 0;

        while (i < len) {
            const byte = bytes[i];

            if ((byte & 0x80) === 0x00) {
                // 1-byte (ASCII): 0xxxxxxx
                i += 1;
            } else if ((byte & 0xE0) === 0xC0) {
                // 2-byte: 110xxxxx 10xxxxxx
                if (i + 1 >= len || (bytes[i + 1] & 0xC0) !== 0x80) return false;
                i += 2;
            } else if ((byte & 0xF0) === 0xE0) {
                // 3-byte: 1110xxxx 10xxxxxx 10xxxxxx
                if (i + 2 >= len ||
                    (bytes[i + 1] & 0xC0) !== 0x80 ||
                    (bytes[i + 2] & 0xC0) !== 0x80) return false;
                i += 3;
            } else if ((byte & 0xF8) === 0xF0) {
                // 4-byte: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                if (i + 3 >= len ||
                    (bytes[i + 1] & 0xC0) !== 0x80 ||
                    (bytes[i + 2] & 0xC0) !== 0x80 ||
                    (bytes[i + 3] & 0xC0) !== 0x80) return false;
                i += 4;
            } else {
                // 非法起始字节
                return false;
            }
        }

        return true;
    }

    // async getChar(response) {
    //     const buffer = await response.arrayBuffer();
    //     if (this.isUtf8(new Uint8Array(buffer))) {
    //         const decoder = new TextDecoder('utf-8');
    //         const text = decoder.decode(new Uint8Array(buffer));
    //         return text;
    //     } else {
    //         const decoder = new TextDecoder('gb18030');
    //         const text = decoder.decode(new Uint8Array(buffer));
    //         return text;
    //     }
    // }

    //流式读取
    async getChar(response) {
        const reader = response.body.getReader();
        const chunks = [];
        let totalLength = 0, isUtf8 = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            totalLength += value.length;

            // 如果已读取足够用于编码检测的数据，则提前进行判断
            if (totalLength >= 4096) {
                const firstChunk = this.concatUint8Arrays(chunks);
                isUtf8 = this.isUtf8(firstChunk, 4096);
                console.log('检测编码为 UTF-8:', isUtf8);
                break; // 编码检测完成即可
            }
        }

        // 继续完整读取剩余内容
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const fullData = this.concatUint8Arrays(chunks);
        const decoder = new TextDecoder(isUtf8 ? 'utf-8' : 'gb18030');
        const result = decoder.decode(fullData);
        // 判断是否是乱码
        if (this.isLikelyGarbled(result)) {
            console.warn('检测到疑似乱码，尝试切换编码...');
            try {
                // 尝试反向解码
                const altDecoder = new TextDecoder(isUtf8 ? 'gb18030' : 'utf-8');
                const altResult = altDecoder.decode(fullData);
                return altResult;
            } catch (e) {
                console.error('二次解码失败', e);
            }
        }

        return result;
    }


    concatUint8Arrays(arrays) {
        let totalLength = 0;
        for (let arr of arrays) totalLength += arr.length;

        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (let arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }

        return result;
    }

    isLikelyGarbled(text) {
        if (!text || text.length < 10) return false;
        text = text.slice(0, Math.min(text.length, 2000));

        // 匹配合法字符：中文 + 英文 + 数字 + 标点 + 空格
        const validCharPattern = /[\u4e00-\u9fff\w\s\p{P}]/gu;

        // 替换所有合法字符为空，剩下的是“非法字符”
        const invalidChars = text.replace(validCharPattern, '');

        // 计算非法字符占比
        const invalidRatio = invalidChars.length / text.length;

        // 如果非法字符超过 30%，则认为是乱码
        return invalidRatio > 0.08;
    }
}
