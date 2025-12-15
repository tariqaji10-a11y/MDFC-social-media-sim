const timeline = document.getElementById("timeline");

// ---- Memory ----
let memory = JSON.parse(localStorage.getItem("mdfcMemory")) || [];

// ---- Realistic Accounts ----
const accounts = [
  // Football News
  { author: "Fabrizio Romano", handle: "@FabrizioRomano", type: "news" },
  { author: "433", handle: "@433", type: "news" },
  { author: "Goal", handle: "@Goal", type: "news" },

  // Rival Clubs Official
  { author: "Liverpool FC", handle: "@LFC", type: "rival" },
  { author: "Manchester United", handle: "@ManUtd", type: "rival" },

  // Player Accounts
  { author: "Mohamed Salah", handle: "@MoSalah", type: "player" },
  { author: "Cristiano Ronaldo", handle: "@Cristiano", type: "player" },

  // Fan Accounts
  { author: "RedFan123", handle: "@RedFan123", type: "fan" },
  { author: "SoccerLover", handle: "@SoccerLover", type: "fan" },

  // Meme / Random
  { author: "FootballMemeGuy", handle: "@MemeGuy", type: "meme" },
  { author: "WorldNews", handle: "@WorldNews", type: "news" }
];

// ---- Add Post ----
function addPost(handle, text, type = "", replies = []) {
  const div = document.createElement("div");
  div.className = "post " + type;

  const account = accounts.find(a => a.handle === handle);
  const displayName = account ? account.author : handle;

  div.innerHTML = `<strong>${displayName} (${handle})</strong><br>${text}`;

  if (replies.length > 0) {
    const replyDiv = document.createElement("div");
    replyDiv.style.marginLeft = "15px";
    replies.forEach(r => {
      const rDiv = document.createElement("div");
      rDiv.className = "post " + r.type;
      const rAccount = accounts.find(a => a.handle === r.author);
      const rDisplay = rAccount ? rAccount.author : r.author;
      rDiv.innerHTML = `<strong>${rDisplay} (${r.author})</strong><br>${r.text}`;
      replyDiv.appendChild(rDiv);
    });
    div.appendChild(replyDiv);
  }

  timeline.prepend(div);
}

// ---- Save Post to Memory ----
function savePost(author, text, type = "", replies = []) {
  memory.push({ author, text, type, replies, timestamp: new Date().toISOString() });
  localStorage.setItem("mdfcMemory", JSON.stringify(memory));
}

// ---- Render Memory ----
function renderMemory() {
  timeline.innerHTML = "";
  memory.slice().reverse().forEach(post => addPost(post.author, post.text, post.type, post.replies));
}

// ---- MDFC User Post ----
function sendPost() {
  const text = document.getElementById("mdfcPost").value.trim();
  if (!text) return;

  addPost("@MiltonDeluxFC", text, "user");
  savePost("@MiltonDeluxFC", text, "user");
  document.getElementById("mdfcPost").value = "";

  simulateAI(text); // Trigger AI reactions
}

// ---- Gemini API Integration ----
async function simulateAI(userPost) {
  const apiKey = "AIzaSyBQgYmZ-yfdRd142ns17S9fTy8SFsJLpy4"; // Replace with your Gemini API key

  const prompt = `
Simulate a chaotic football social media feed.
RULES:
- The user posts only as @MiltonDeluxFC
- Generate 5-8 posts from other accounts (news, rival clubs, players, fans, memes)
- Each post can have 0-2 replies
- Use account personalities: Fabrizio Romano=factual, 433=hype, Goal=broad news
- Fans=emotional, players=impulsive, rivals=critical, meme=funny
- Follow MDFC master system prompt rules (drama, rival logic, storylines)
- Include real account handles and names.
User post: "${userPost}"
Memory: ${JSON.stringify(memory)}
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse AI response into posts & replies
    const lines = text.split("\n").filter(l => l.trim());
    lines.forEach(line => {
      // Expected format: "Author (@handle): post text"
      const match = line.match(/^(.+)\s\((@.+)\):\s(.+)$/);
      if (match) {
        const authorName = match[1];
        const handle = match[2];
        const postText = match[3];

        // Determine type from accounts list
        const account = accounts.find(a => a.handle === handle) || { type: "fan" };

        addPost(handle, postText, account.type);
        savePost(handle, postText, account.type);
      }
    });

  } catch (error) {
    console.error("Gemini API error:", error);
  }
}

// ---- Initialize ----
renderMemory();}

// Handle MDFC user posting
function sendPost() {
  const text = document.getElementById("mdfcPost").value.trim();
  if (!text) return;

  addPost("@MiltonDeluxFC", text, "user");
  savePost("@MiltonDeluxFC", text, "user");
  document.getElementById("mdfcPost").value = "";

  simulateAI(text);
}

// Simulate AI posts and replies
function simulateAI(userPost) {
  const accounts = [
    { author: "@FabrizioRomano", type: "news" },
    { author: "@433", type: "news" },
    { author: "@Goal", type: "news" },
    { author: "@RivalFC_Official", type: "rival" },
    { author: "@RivalFan", type: "rival" },
    { author: "@Player1", type: "player" },
    { author: "@Player2", type: "player" },
    { author: "@FanAccount1", type: "fan" },
    { author: "@FanAccount2", type: "fan" },
    { author: "@MemeLord", type: "meme" },
    { author: "@WorldNews", type: "news" }
  ];

  const messages = [
    "MDFC in hot water after last match.",
    "Fans are furious about the coach decisions!",
    "Rumors are flying about a big transfer.",
    "Another stunning goal from MDFC!",
    "Supporters are rallying online with #MDFCUnite.",
    "Players are speaking out after training.",
    "Rival fans can't stop trolling #MDFCFail",
    "Breaking: unexpected lineup changes!"
  ];

  const numPosts = Math.floor(Math.random() * 4) + 5; // 5-8 AI posts
  for (let i = 0; i < numPosts; i++) {
    const account = accounts[Math.floor(Math.random() * accounts.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    const numReplies = Math.floor(Math.random() * 3); // 0-2 replies
    const replies = [];
    for (let j = 0; j < numReplies; j++) {
      const rAccount = accounts[Math.floor(Math.random() * accounts.length)];
      const rMessage = messages[Math.floor(Math.random() * messages.length)];
      replies.push({ author: rAccount.author, text: rMessage, type: rAccount.type });
    }

    addPost(account.author, message, account.type, replies);
    savePost(account.author, message, account.type, replies);
  }
}

// Render memory on page load
renderMemory();
