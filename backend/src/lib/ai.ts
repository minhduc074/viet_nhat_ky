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
          const response: GeminiResponse = JSON.parse(body.toString());
          
          if (response.candidates && response.candidates.length > 0) {
            const text = response.candidates[0].content.parts[0].text;
            resolve(text);
          } else {
            reject(new Error('Không nhận được phản hồi từ AI'));
          }
        } catch (error) {
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

  const contents: GeminiMessage[] = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  try {
    const response = await callGeminiAI(contents);
    return response;
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error('Không thể tạo báo cáo từ AI');
  }
}
