const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const n8nWebhookUrl = 'https://automation.guitarjkp.me/webhook/33256a88-dc76-4f8a-bfb8-a117fe433f8a/chat'; // **สำคัญ:** เปลี่ยนเป็น URL Webhook ของคุณ

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        displayUserMessage(messageText);
        messageInput.value = '';

        // ส่งข้อความไปยัง n8n backend
        fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: messageText, // ส่งข้อความภายใต้ key 'text' (ปรับเปลี่ยนได้)
                // คุณสามารถส่งข้อมูลอื่นๆ เพิ่มเติมได้ที่นี่ เช่น sessionId
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // **สำคัญ:** ตรวจสอบโครงสร้างของข้อมูลที่ n8n ส่งกลับมา
            // สมมติว่า n8n ส่งกลับมาในรูปแบบ { reply: "ข้อความตอบกลับจากบอท" }
           if (data && data.response) { // เปลี่ยนจาก data.reply เป็น data.response
                displayBotMessage(data.response);
            } else {
                displayBotMessage('บอทไม่สามารถตอบกลับได้ในขณะนี้');
                console.error('รูปแบบการตอบกลับจาก n8n ไม่ถูกต้อง:', data);
            }
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการส่งข้อความไปยัง n8n:', error);
            displayBotMessage('ขออภัย มีข้อผิดพลาดในการสื่อสารกับบอท');
        });
    }
}

function displayUserMessage(message) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    userDiv.textContent = message;
    chatMessages.appendChild(userDiv);
    scrollToBottom();
}

function displayBotMessage(message) {
    const botDiv = document.createElement('div');
    botDiv.classList.add('message', 'bot-message');
    botDiv.textContent = message;
    chatMessages.appendChild(botDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
