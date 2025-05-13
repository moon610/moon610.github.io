export class ChunkedString {
  constructor( chunkSize = 1024) {
    this.text = '';
    this.chunkSize = chunkSize;
  }

  _init(text) {
    this.text = text;
    this.chunks = this._splitToChunks();
  }

  // 将文本分割为块
  _splitToChunks() {
    const chunks = [];
    for (let i = 0; i < this.text.length; i += this.chunkSize) {
      chunks.push(this.text.slice(i, i + this.chunkSize));
    }
    return chunks;
  }

  // 模拟字符串长度
  get length() {
    return this.text.length;
  }

  // 获取指定索引的字符（模拟字符串charAt）
  charAt(index) {
    if (index < 0 || index >= this.text.length) {
      return '';
    }
    return this.text.charAt(index);
  }

  // 获取子字符串（核心方法）
  substring(start, end = this.text.length) {
    if (start < 0) start = 0;
    if (end > this.text.length) end = this.text.length;

    let result = '';
    const startChunkIndex = Math.floor(start / this.chunkSize);
    const endChunkIndex = Math.floor(end / this.chunkSize);

    for (let i = startChunkIndex; i <= endChunkIndex; i++) {
      const chunkStart = Math.max(start, i * this.chunkSize);
      const chunkEnd = Math.min(end, (i + 1) * this.chunkSize);
      const localStart = chunkStart - i * this.chunkSize;
      const localEnd = chunkEnd - i * this.chunkSize;
      result += this.chunks[i].substring(localStart, localEnd);
    }

    return result;
  }

  // 支持 like String.indexOf
  indexOf(searchValue, fromIndex = 0) {
    return this.text.indexOf(searchValue, fromIndex);
  }

  // 支持 like String.includes
  includes(searchValue, fromIndex = 0) {
    return this.text.includes(searchValue, fromIndex);
  }

  // 转换为完整字符串（用于调试或最终输出）
  toString() {
    return this.text;
  }

  // 支持 JSON.stringify 等场景
  valueOf() {
    return this.text;
  }
}