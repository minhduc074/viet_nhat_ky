import https from 'https';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// ChatGPT RapidAPI format (simple text response)
interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTResponse {
  text?: string;
  finish_reason?: string;
  model?: string;
  server?: string;
}

interface EntryData {
  date: Date;
  moodScore: number;
  note?: string | null;
  tags: string[];
}

/**
 * Call Gemini Pro AI via RapidAPI
 */
export async function callGeminiAI(contents: GeminiMessage[]): Promise<string> {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY không được cấu hình');
  }

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'gemini-pro-ai.p.rapidapi.com',
      port: null,
      path: '/',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'gemini-pro-ai.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, function (res) {
      const chunks: Buffer[] = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        try {
          const body = Buffer.concat(chunks);
          const bodyString = body.toString();
          
          console.log('AI Response:', bodyString);
          
          const response: GeminiResponse = JSON.parse(bodyString);
          
          if (response.candidates && response.candidates.length > 0) {
            const text = response.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            console.error('Invalid AI response structure:', response);
            reject(new Error(`Không nhận được phản hồi từ AI. Response: ${bodyString.substring(0, 200)}`));
          }
        } catch (error) {
          console.error('Parse error:', error);
          reject(error);
        }
      });
    });

    req.on('error', function (error) {
      reject(error);
    });

    req.write(JSON.stringify({ contents }));
    req.end();
  });
}

// Call ChatGPT RapidAPI (chatgpt-api8)
export async function callChatGPTAPI(prompt: string): Promise<string> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY không được cấu hình');
  }

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'chatgpt-api8.p.rapidapi.com',
      port: null,
      path: '/',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'chatgpt-api8.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, function (res) {
      const chunks: Buffer[] = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        try {
          const body = Buffer.concat(chunks).toString();
          console.log('ChatGPT Response:', body);

          const parsed: ChatGPTResponse = JSON.parse(body);

          if (parsed && parsed.text) {
            resolve(parsed.text);
          } else {
            console.error('Invalid ChatGPT response:', parsed);
            reject(new Error(`Không nhận được phản hồi từ ChatGPT. Response: ${body.substring(0, 200)}`));
          }
        } catch (err) {
          console.error('ChatGPT parse error:', err);
          reject(err);
        }
      });
    });

    req.on('error', function (error) {
      reject(error);
    });

    const messages: ChatGPTMessage[] = [
      { role: 'system', content: 'Bạn là một chuyên gia tâm lý học nói tiếng Việt, thân thiện và ấm áp.' },
      { role: 'user', content: prompt },
    ];

    req.write(JSON.stringify(messages));
    req.end();
  });
}

// Generic wrapper: choose provider via AI_PROVIDER env var ("chatgpt" or "gemini")
export async function callAI(prompt: string): Promise<string> {
  const provider = (process.env.AI_PROVIDER || 'chatgpt').toLowerCase();

  // Primary attempt
  try {
    if (provider === 'gemini') {
      const contents = [{ role: 'user', parts: [{ text: prompt }] }];
      return await callGeminiAI(contents as any);
    }

    return await callChatGPTAPI(prompt);
  } catch (primaryError) {
    console.error(`Primary provider (${provider}) failed:`, primaryError);

    // Fallback to the other provider
    const fallback = provider === 'chatgpt' ? 'gemini' : 'chatgpt';
    try {
      console.log(`Attempting fallback provider: ${fallback}`);
      if (fallback === 'gemini') {
        const contents = [{ role: 'user', parts: [{ text: prompt }] }];
        return await callGeminiAI(contents as any);
      }
      return await callChatGPTAPI(prompt);
    } catch (fallbackError) {
      console.error('Fallback provider also failed:', fallbackError);
      // Throw the original error for better debugging
      if (primaryError instanceof Error) throw primaryError;
      throw new Error('Cả hai provider AI đều thất bại');
    }
  }
}

/**
 * Generate monthly insights from user entries
 */
export async function generateMonthlyInsights(
  entries: EntryData[],
  month: string // Format: YYYY-MM or "Tháng 1/2026"
): Promise<string> {
  if (entries.length === 0) {
    return 'Bạn chưa có bản ghi nào trong tháng này. Hãy bắt đầu ghi chép cảm xúc để nhận được lời khuyên từ AI nhé! 💙';
  }

  // Format mood labels
  const moodLabels: Record<number, string> = {
    1: 'Rất tệ 😢',
    2: 'Tệ 😔',
    3: 'Bình thường 😐',
    4: 'Tốt 😊',
    5: 'Tuyệt vời 😄',
  };

  // Calculate statistics
  const totalDays = entries.length;
  const avgMood = entries.reduce((sum, e) => sum + e.moodScore, 0) / totalDays;
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.moodScore] = (acc[e.moodScore] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Find most common mood
  const mostCommonMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Collect all tags
  const allTags = entries.flatMap((e) => e.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  // Format all notes with emotions for each day
  const allNotes = entries.map((e) => {
    const dateStr = e.date.toLocaleDateString('vi-VN');
    const noteText = e.note && e.note.trim().length > 0 ? ` - "${e.note}"` : '';
    return `- ${dateStr}: ${moodLabels[e.moodScore]}${noteText}`;
  });

  // Build prompt for AI
  const prompt = `Bạn là một chuyên gia tâm lý học, hãy phân tích nhật ký cảm xúc của người dùng trong ${month} và đưa ra lời khuyên, góp ý chân thành, ấm áp.

**Dữ liệu:**
- Tổng số ngày ghi nhật ký: ${totalDays} ngày
- Điểm cảm xúc trung bình: ${avgMood.toFixed(2)}/5.0
- Cảm xúc phổ biến nhất: ${moodLabels[parseInt(mostCommonMood[0])]} (${mostCommonMood[1]} ngày)
- Các chủ đề (tags) thường gặp: ${topTags.length > 0 ? topTags.join(', ') : 'Không có'}

**Nhật ký cảm xúc từng ngày:**
${allNotes.join('\n')}

**Yêu cầu:**
1. Đánh giá tổng quan trạng thái tinh thần trong tháng (ngắn gọn, 2-3 câu)
2. Phân tích xu hướng cảm xúc (có những biến động gì đáng chú ý không?)
3. Đưa ra 3-4 lời khuyên thực tế, dễ thực hiện để cải thiện tinh thần
4. Gửi lời động viên, khích lệ

**Lưu ý:** 
- Viết bằng tiếng Việt, giọng điệu thân thiện, ấm áp như một người bạn
- Không dài quá 400 từ
- Sử dụng emoji phù hợp để tạo cảm giác gần gũi`;

  try {
    const response = await callAI(prompt);
    return response;
  } catch (error) {
    console.error('AI Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    if (error instanceof Error) {
      throw new Error(`Không thể tạo báo cáo từ AI: ${error.message}`);
    }
    throw new Error('Không thể tạo báo cáo từ AI');
  }
}
