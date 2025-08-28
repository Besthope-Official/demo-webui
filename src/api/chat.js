// src/api/chat.js

export async function* streamHandler(response) {
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export async function streamChat(message) {
  const chatId = Date.now().toString();
  const messageId = Date.now().toString();

  const payload = {
    rag_enable: false,
    chat_id: chatId,
    message_id: messageId,
    query: [
      {
        role: 'user',
        content: message
      }
    ]
  };

  console.log('Sending payload:', payload);

  try {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
