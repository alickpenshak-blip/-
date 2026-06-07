import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;

if (api_key && api_key !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found. Running in mock fallback mode.");
}

// Unsplash high quality curated photos to map profile styles
interface ImageTheme {
  avatar: string;
  posts: string[];
}

const THEME_IMAGES: Record<string, ImageTheme> = {
  lifestyle: {
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=600&auto=format&fit=crop"
    ]
  },
  tech: {
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop"
    ]
  },
  fitness: {
    avatar: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop"
    ]
  },
  travel: {
    avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1433832565846-4874c2b6e72a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472214222551-29a2a2ff87f0?q=80&w=600&auto=format&fit=crop"
    ]
  },
  food: {
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop"
    ]
  },
  beauty: {
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500840216050-6ffa99d7cd76?q=80&w=600&auto=format&fit=crop"
    ]
  },
  gaming: {
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=600&auto=format&fit=crop",
    posts: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"
    ]
  }
};

// Map fallback names generator helper
function getFallbackProfile(username: string): any {
  // Determine standard categories based on username matches
  const un = username.toLowerCase();
  let theme: keyof typeof THEME_IMAGES = "lifestyle";
  let category = "Личный блог / Lifestyle";
  let fullName = username.charAt(0).toUpperCase() + username.slice(1);

  if (un.includes("fit") || un.includes("gym") || un.includes("sport") || un.includes("coach")) {
    theme = "fitness";
    category = "Спорт и фитнес / Тренер";
  } else if (un.includes("tech") || un.includes("code") || un.includes("dev") || un.includes("crypto") || un.includes("ai")) {
    theme = "tech";
    category = "Технологии / Разработка / IT";
  } else if (un.includes("travel") || un.includes("photo") || un.includes("world") || un.includes("trip")) {
    theme = "travel";
    category = "Путешествия и фото";
  } else if (un.includes("food") || un.includes("chef") || un.includes("cook") || un.includes("eat") || un.includes("recept")) {
    theme = "food";
    category = "Кулинария / Рецепты";
  } else if (un.includes("beauty") || un.includes("makeup") || un.includes("style") || un.includes("fashion") || un.includes("cosmetic")) {
    theme = "beauty";
    category = "Красота и косметика / Мода";
  } else if (un.includes("game") || un.includes("play") || un.includes("stream") || un.includes("esport")) {
    theme = "gaming";
    category = "Гейминг / Стриминг";
  }

  // Pre-generate nice stats
  const followersCount = (Math.floor(Math.random() * 450) + 10).toString() + "K";
  const followingCount = (Math.floor(Math.random() * 800) + 100).toString();
  const postsCount = (Math.floor(Math.random() * 300) + 40).toString();
  const engagementRate = (Math.random() * 4 + 1).toFixed(1) + "%";

  const selectedTheme = THEME_IMAGES[theme];

  return {
    username: username.replace("@", "").trim(),
    fullName: fullName,
    followersCount,
    followingCount,
    postsCount,
    bio: `✨ Здесь могла бы быть ваша реклама либо официальная биография аккаунта ${fullName}.\n📸 Контент про ${category.split(" / ")[0].toLowerCase()}.\n⚡️ Подписывайтесь на ежедневные обновления!`,
    category,
    avatarUrl: selectedTheme.avatar,
    location: "Москва, Россия",
    contactEmail: `contact@${username.replace("@", "").trim()}.com`,
    engagementRate,
    recentPosts: [
      {
        id: "post_1",
        imageUrl: selectedTheme.posts[0],
        caption: "Начинаем неделю продуктивно! Какие у вас планы? 😉 #motivation #newday",
        likes: (Math.floor(Math.random() * 50) + 10).toString() + "K",
        comments: (Math.floor(Math.random() * 1000) + 50).toString(),
        date: "1 день назад"
      },
      {
        id: "post_2",
        imageUrl: selectedTheme.posts[1],
        caption: "Один из лучших моментов за последнее время. Делюсь эстетикой с вами! 🌿✨ #vibes #lifestyle",
        likes: (Math.floor(Math.random() * 50) + 10).toString() + "K",
        comments: (Math.floor(Math.random() * 1000) + 50).toString(),
        date: "3 дня назад"
      },
      {
        id: "post_3",
        imageUrl: selectedTheme.posts[2],
        caption: "Новый пост уже в профиле, не забудьте поставить лайк и сохранить. Больше контента в сторис! 🔥",
        likes: (Math.floor(Math.random() * 50) + 10).toString() + "K",
        comments: (Math.floor(Math.random() * 1000) + 50).toString(),
        date: "1 неделя назад"
      }
    ]
  };
}

// REST API for fetching instagram info
app.post("/api/instagram/fetch", async (req, res) => {
  const { urlOrUsername } = req.body;

  if (!urlOrUsername) {
    return res.status(400).json({ error: "Пожалуйста, введите ссылку или никнейм" });
  }

  // Extract clean username from input
  let username = urlOrUsername.trim();
  if (username.includes("instagram.com/")) {
    const parts = username.split("instagram.com/");
    if (parts[1]) {
      username = parts[1].split("/")[0].split("?")[0];
    }
  }
  username = username.replace(/[@/]/g, "").trim();

  if (!username) {
    return res.status(400).json({ error: "Не удалось распознать имя пользователя" });
  }

  // Fallback profile if Gemini fails or is not present
  const fallback = getFallbackProfile(username);

  if (!ai) {
    console.log("No Gemini API connection. Serving realistic placeholder.");
    return res.json({ profile: fallback, source: "mocked" });
  }

  try {
    const prompt = `Сгенерируй реалистичную информацию для Instagram аккаунта: "${username}". 
Ты должен вернуть структурированный JSON ответ. 
Если это известный личный аккаунт, бренд, блогер (напр. cristiano, selenagomez, nike, techcrunch), используй свои реальные знания. 
Если аккаунт неизвестный, то сгенерируй очень качественную правдоподобную информацию, соответствующую логике его имени (например, если в имени есть "fit", сделай спортивный профиль; если "beauty" - бьюти профиль; в остальных случаях - качественный лайфстайл или бренд).

Ты обязан вернуть строго валидный JSON в таком формате:
{
  "username": "${username}",
  "fullName": "Имя Фамилия или Название бренда (на русском)",
  "followersCount": "Количество подписчиков (например '1.2M', '58K', '250', и т.д.)",
  "followingCount": "Количество подписок (например '420')",
  "postsCount": "Количество постов (например '128')",
  "bio": "Настоящая или сгенерированная стильная биография (БИО) на русском языке с эмодзи",
  "category": "Категория профиля (на русском, например 'Спортсмен', 'Предприниматель', 'Бренд одежды', 'Фотограф', 'Техноблог', 'Личный блог')",
  "location": "Город, страна или локация (например 'Москва, Россия' или null)",
  "contactEmail": "Контактный email или null",
  "engagementRate": "Коэффициент вовлеченности (например '3.4%' или '1.8%')",
  "suggestedTheme": "Один из подходящих стилей строго из списка: [lifestyle, tech, fitness, travel, food, beauty, gaming]",
  "recentPosts": [
    {
      "caption": "Реалистичное (или придуманное по теме) описание первого свежего поста с эмодзи и хэштегами на русском",
      "likes": "Лайки (например '12K', '340' и т.д.)",
      "comments": "Комменты (например '480', '12' и т.д.)",
      "date": "1 день назад"
    },
    {
      "caption": "Реалистичное описание второго поста с хэштегами на русском",
      "likes": "Лайки",
      "comments": "Комменты",
      "date": "3 дня назад"
    },
    {
      "caption": "Реалистичное описание третьего поста с хэштегами на русском",
      "likes": "Лайки",
      "comments": "Комменты",
      "date": "1 неделя назад"
    }
  ]
}`;

    // Get response from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            username: { type: Type.STRING },
            fullName: { type: Type.STRING },
            followersCount: { type: Type.STRING },
            followingCount: { type: Type.STRING },
            postsCount: { type: Type.STRING },
            bio: { type: Type.STRING },
            category: { type: Type.STRING },
            location: { type: Type.STRING },
            contactEmail: { type: Type.STRING },
            engagementRate: { type: Type.STRING },
            suggestedTheme: { type: Type.STRING },
            recentPosts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  likes: { type: Type.STRING },
                  comments: { type: Type.STRING },
                  date: { type: Type.STRING }
                },
                required: ["caption", "likes", "comments", "date"]
              }
            }
          },
          required: ["username", "fullName", "followersCount", "followingCount", "postsCount", "bio", "category", "suggestedTheme", "recentPosts"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Пустой ответ от ИИ");
    }

    const aiResult = JSON.parse(textOutput.trim());
    
    // Map avatar and post images from the approved theme list to ensure beautiful visual quality
    const themeKey = (aiResult.suggestedTheme || "lifestyle").toLowerCase();
    const mappedTheme = THEME_IMAGES[themeKey] || THEME_IMAGES.lifestyle;

    const finalProfile = {
      username: aiResult.username || username,
      fullName: aiResult.fullName || fallback.fullName,
      followersCount: aiResult.followersCount || fallback.followersCount,
      followingCount: aiResult.followingCount || fallback.followingCount,
      postsCount: aiResult.postsCount || fallback.postsCount,
      bio: aiResult.bio || fallback.bio,
      category: aiResult.category || fallback.category,
      location: aiResult.location || fallback.location,
      contactEmail: aiResult.contactEmail || fallback.contactEmail,
      engagementRate: aiResult.engagementRate || fallback.engagementRate,
      avatarUrl: mappedTheme.avatar,
      recentPosts: aiResult.recentPosts.map((post: any, idx: number) => ({
        id: `ai_post_${idx + 1}`,
        imageUrl: mappedTheme.posts[idx % mappedTheme.posts.length],
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        date: post.date
      }))
    };

    return res.json({ profile: finalProfile, source: "gemini" });
  } catch (error) {
    console.error("Gemini failed, falling back to mock:", error);
    return res.json({ profile: fallback, source: "mocked" });
  }
});

// Configure full-stack dev/production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
