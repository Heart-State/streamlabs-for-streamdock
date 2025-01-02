
if (document.location != undefined && document.location != null && document.location.hash != null && document.location.hash != undefined && document.location.hash != "") {
    console.log(document.location);
    const searchParams = new URLSearchParams(document.location.hash);
    const data = {
        "code": searchParams.get('code'),
    };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    fetch('http://localhost:3000/settings?time=' + Date.now(), requestOptions)
        .then(response => response.json())
        .then(data => {
            if (!data.message) {
                window.location.href = "/404";
            }
            console.log(data.message); // 输出：Hello from Node.js
            // 在新窗口加载完成后，向父窗口发送消息

        })
        .catch(error => console.error('Error:', error));
}

document.querySelectorAll(".en").forEach((item) => {
    if (navigator.language == "zh-CN") {
        item.style.display = "none"
    } else {
        item.style.display = "block"
    }
})
document.querySelectorAll(".zh-CN").forEach((item) => {
    if (navigator.language != "zh-CN") {
        item.style.display = "none"
    } else {
        item.style.display = "block"
    }
})