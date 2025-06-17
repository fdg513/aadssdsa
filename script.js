document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const statusDiv = document.getElementById('status');

    // 从 Vercel 环境变量中获取 API URL
    // 在本地测试时，你可以直接替换成你的 API 地址
    const apiUrl = process.env.VITE_API_URL || 'https://chat.minimax.io/v1/api/files/request_policy';

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];

        if (!file) {
            statusDiv.textContent = '请先选择一个文件！';
            statusDiv.className = 'status error';
            return;
        }

        statusDiv.textContent = '正在上传...';
        statusDiv.className = 'status';

        try {
            // 准备请求体
            const formData = new FormData();
            formData.append('file', file);

            // 发送请求到 Minimax API
            const response = await fetch(apiUrl, {
                method: 'POST',
                // 注意：使用 FormData 时，浏览器会自动设置正确的 Content-Type
                // 你不需要手动设置 headers['Content-Type']
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                statusDiv.textContent = '上传成功！';
                statusDiv.className = 'status success';
                console.log('文件 URL:', result.file_url); // 在控制台打印文件 URL
            } else {
                statusDiv.textContent = `上传失败: ${result.base_resp.status_msg || '未知错误'}`;
                statusDiv.className = 'status error';
            }
        } catch (error) {
            console.error('上传过程中发生错误:', error);
            statusDiv.textContent = '上传过程中发生网络错误。';
            statusDiv.className = 'status error';
        }
    });
});
