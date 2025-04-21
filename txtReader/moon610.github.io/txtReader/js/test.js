const url = new URL(location.href)
const searchParams = url.searchParams
const fileUrl = searchParams.get('file')
console.log('url', fileUrl)

// const fileUrl = 'http://localhost:5244/d/local/FTP/%E5%82%AC%E7%9C%A0sm.txt?sign=exq1Y6clcSni9kbbUnhl8su9XEp94fz2AIWzsQTinaM=:0'

const response = fetch(fileUrl).then((response) => {
    // 检查响应是否成功
    if (!response.ok) {
        throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }

    // 读取文件内容为文本
    const contentDiv = document.querySelector('.main')
    response.text().then(data => {
        // 将内容显示到页面中
        contentDiv.textContent = data;
    });


});

