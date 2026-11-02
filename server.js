const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8899;
const RANK_DIR = __dirname;
const PARENT_DIST_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// Helper: JSON response with CORS
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, token, uiLang, apifoxToken'
  });
  res.end(JSON.stringify(data));
}

// User's logged in ranking info
const myRanking = {
  rank: 4,
  name: "Burak",
  avatar: "/assets/user_avatar-f62c9345.webp",
  uid: "uuid_burak",
  funid: 10086,
  coins: 350000,
  level: 28,
  svipLevel: 3
};

// 1. Zenginlik / En Çok Hediye Gönderenler (Gifter)
const gifterUsers = [
  {
    rank: 1,
    name: "Online Coins Bank",
    avatar: "/assets/user_avatar_2-6aec244f.webp",
    uid: "2f8ee5fb-4da1-417b-b8c8-bd1d1123f0df",
    funid: 10001,
    coins: 500000,
    level: 100,
    svipLevel: 6,
    roomId: "1165"
  },
  {
    rank: 2,
    name: "Elif_Sultan",
    avatar: "/assets/user_avatar-f62c9345.webp",
    uid: "10002",
    funid: 10002,
    coins: 420000,
    level: 62,
    svipLevel: 4
  },
  {
    rank: 3,
    name: "Boran_Bey",
    avatar: "/assets/default_avatar_masti-0f63644f.webp",
    uid: "10003",
    funid: 10003,
    coins: 380000,
    level: 48,
    svipLevel: 3
  },
  {
    rank: 4,
    name: "Burak",
    avatar: "/assets/user_avatar-f62c9345.webp",
    uid: "uuid_burak",
    funid: 10086,
    coins: 350000,
    level: 28,
    svipLevel: 3
  },
  {
    rank: 5,
    name: "Yıldız_Prenses",
    avatar: "/assets/user_avatar_2-6aec244f.webp",
    uid: "10005",
    funid: 10005,
    coins: 210000,
    level: 35,
    svipLevel: 2
  },
  {
    rank: 6,
    name: "Can_Can",
    avatar: "/assets/default_avatar_masti-0f63644f.webp",
    uid: "10006",
    funid: 10006,
    coins: 180000,
    level: 29,
    svipLevel: 1
  }
];

// 2. Cazibe / En Çok Hediye Alanlar (Receive)
const receiveUsers = [
  {
    rank: 1,
    name: "Melis_Star",
    avatar: "/assets/user_avatar_2-6aec244f.webp",
    uid: "20001",
    funid: 20001,
    coins: 2450000,
    level: 82,
    svipLevel: 6
  },
  {
    rank: 2,
    name: "Deniz_Kızı",
    avatar: "/assets/user_avatar-f62c9345.webp",
    uid: "20002",
    funid: 20002,
    coins: 1780000,
    level: 70,
    svipLevel: 5
  },
  {
    rank: 3,
    name: "Gülce_Ses",
    avatar: "/assets/default_avatar_masti-0f63644f.webp",
    uid: "20003",
    funid: 20003,
    coins: 1120000,
    level: 55,
    svipLevel: 3
  },
  {
    rank: 4,
    name: "Burak",
    avatar: "/assets/user_avatar-f62c9345.webp",
    uid: "uuid_burak",
    funid: 10086,
    coins: 540000,
    level: 28,
    svipLevel: 3
  },
  {
    rank: 5,
    name: "Ece_Naz",
    avatar: "/assets/user_avatar_2-6aec244f.webp",
    uid: "20005",
    funid: 20005,
    coins: 390000,
    level: 33,
    svipLevel: 2
  }
];

// 3. En Çok Hediye Alan Odalar (Room)
const roomUsers = [
  {
    rank: 1,
    name: "Gece Muhabbetleri 🎙️",
    avatar: "/assets/bg-1-16fa8703.png",
    roomId: "1165",
    uid: "1165",
    funid: 1165,
    coins: 3800000,
    level: 50,
    openRoomLevel: true
  },
  {
    rank: 2,
    name: "Canlı Müzik & Akustik 🎸",
    avatar: "/assets/bg-2-f49cef9a.png",
    roomId: "9002",
    uid: "9002",
    funid: 9002,
    coins: 2900000,
    level: 42,
    openRoomLevel: true
  },
  {
    rank: 3,
    name: "Dost Meclisi & Oyun 🎮",
    avatar: "/assets/bg-3-5f33b71f.png",
    roomId: "9003",
    uid: "9003",
    funid: 9003,
    coins: 1850000,
    level: 35,
    openRoomLevel: true
  },
  {
    rank: 4,
    name: "Burak'ın Odası 🔥",
    avatar: "/assets/bg-1-16fa8703.png",
    roomId: "10086",
    uid: "10086",
    funid: 10086,
    coins: 950000,
    level: 28,
    openRoomLevel: true
  }
];

// 4. CP / Çiftler Sıralaması (Couples)
const cpCouples = [
  {
    rank: 1,
    relationshipId: "c5653127-991b-417a-8f7b-9273c82d415b",
    name: "SUDE × ZAGROS",
    avatar: "/assets/user_avatar-f62c9345.webp",
    coins: 247000,
    level: 45,
    svipLevel: 4,
    startedAt: "2026-10-12T18:20:27Z",
    requester: {
      uid: "uuid_sude",
      name: "SUDE",
      avatar: "/assets/user_avatar-f62c9345.webp"
    },
    partner: {
      uid: "uuid_zagros",
      name: "ZAGROS",
      avatar: "/assets/user_avatar_2-6aec244f.webp"
    }
  },
  {
    rank: 2,
    relationshipId: "a1234567-89ab-cdef-0123-456789abcdef",
    name: "LEYLA × MECNUN",
    avatar: "/assets/user_avatar_2-6aec244f.webp",
    coins: 198000,
    level: 38,
    svipLevel: 3,
    startedAt: "2026-09-15T12:00:00Z",
    requester: {
      uid: "uuid_leyla",
      name: "LEYLA",
      avatar: "/assets/user_avatar_2-6aec244f.webp"
    },
    partner: {
      uid: "uuid_mecnun",
      name: "MECNUN",
      avatar: "/assets/default_avatar_masti-0f63644f.webp"
    }
  },
  {
    rank: 3,
    relationshipId: "b9876543-21ba-fedc-ba98-76543210fedc",
    name: "KEREM × ASLI",
    avatar: "/assets/default_avatar_masti-0f63644f.webp",
    coins: 154000,
    level: 32,
    svipLevel: 2,
    startedAt: "2026-10-01T20:30:00Z",
    requester: {
      uid: "uuid_kerem",
      name: "KEREM",
      avatar: "/assets/default_avatar_masti-0f63644f.webp"
    },
    partner: {
      uid: "uuid_asli",
      name: "ASLI",
      avatar: "/assets/user_avatar-f62c9345.webp"
    }
  },
  {
    rank: 4,
    relationshipId: "c8888888-4444-2222-1111-000000000000",
    name: "BURAK × AYŞE",
    avatar: "/assets/user_avatar-f62c9345.webp",
    coins: 112000,
    level: 28,
    svipLevel: 3,
    startedAt: "2026-10-20T14:10:00Z",
    requester: {
      uid: "uuid_burak",
      name: "BURAK",
      avatar: "/assets/user_avatar-f62c9345.webp"
    },
    partner: {
      uid: "uuid_ayse",
      name: "AYŞE",
      avatar: "/assets/user_avatar_2-6aec244f.webp"
    }
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, token, uiLang, apifoxToken'
    });
    return res.end();
  }

  // API 1: /new/ranking/gifter (Hediye Gönderenler / Onur)
  if (pathname === '/new/ranking/gifter') {
    console.log('[API] GET /new/ranking/gifter called, query:', query);
    return sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        duration: "14:22:10",
        more: false,
        myRanking: myRanking,
        users: gifterUsers,
        couples: []
      }
    });
  }

  // API 2: /new/ranking/receive (Hediye Alanlar / Cazibe)
  if (pathname === '/new/ranking/receive') {
    console.log('[API] GET /new/ranking/receive called, query:', query);
    return sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        duration: "14:22:10",
        more: false,
        myRanking: myRanking,
        users: receiveUsers,
        couples: []
      }
    });
  }

  // API 3: /new/ranking/room (Odalar)
  if (pathname === '/new/ranking/room') {
    console.log('[API] GET /new/ranking/room called, query:', query);
    return sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        duration: "14:22:10",
        more: false,
        myRanking: roomUsers[3],
        users: roomUsers,
        couples: []
      }
    });
  }

  // API 4: /new/ranking/cp (CP / Çiftler)
  if (pathname === '/new/ranking/cp') {
    console.log('[API] GET /new/ranking/cp called, query:', query);
    return sendJson(res, 200, {
      code: 200,
      message: "success",
      data: {
        duration: "14:22:10",
        more: false,
        myRanking: {
          rank: 4,
          name: "BURAK × AYŞE",
          avatar: "/assets/user_avatar-f62c9345.webp",
          uid: "uuid_burak",
          funid: 10086,
          coins: 112000,
          level: 28,
          svipLevel: 3,
          requester: {
            uid: "uuid_burak",
            name: "BURAK",
            avatar: "/assets/user_avatar-f62c9345.webp"
          },
          partner: {
            uid: "uuid_ayse",
            name: "AYŞE",
            avatar: "/assets/user_avatar_2-6aec244f.webp"
          }
        },
        users: [],
        couples: cpCouples
      }
    });
  }

  // API: Telemetry
  if (pathname === '/v2/client-event/report') {
    return sendJson(res, 200, { code: 200, message: "ok", data: null });
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(RANK_DIR, safePath);

  // If not found in RANK, check parent assets folder (for avatars, svgs, etc.)
  if (!fs.existsSync(filePath)) {
    const parentPath = path.join(PARENT_DIST_DIR, safePath);
    if (fs.existsSync(parentPath)) {
      filePath = parentPath;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏆 HAPI RANK (Liderlik Sıralaması) Test Server Başlatıldı!`);
  console.log(`🌐 Test URL (Türkçe & Yerel Backend):`);
  console.log(`   http://localhost:${PORT}/index.html?mockUrl=http%3A%2F%2Flocalhost%3A${PORT}&token=test1234&lang=tr`);
  console.log(`====================================================`);
});
