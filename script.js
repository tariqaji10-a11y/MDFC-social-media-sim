const timeline = document.getElementById("timeline");

// Load memory from localStorage
let memory = JSON.parse(localStorage.getItem("mdfcMemory")) || [];

// Add a post to timeline
function addPost(author, text, type = "", replies = []) {
  const div = document.createElement("div");
  div.className = "post " + type;
  div.innerHTML = `<strong>${author}</strong><br>${text}`;

  if (replies.length > 0) {
    const replyDiv = document.createElement("div");
    replyDiv.style.marginLeft = "15px";
    replies.forEach(r => {
      const rDiv = document.createElement("div");
      rDiv.className = "post " + r.type;
      rDiv.innerHTML = `<strong>${r.author}</strong><br>${r.text}`;
      replyDiv.appendChild(rDiv);
    });
    div.appendChild(replyDiv);
  }

  timeline.prepend(div);
}

// Render all memory
function renderMemory() {
  timeline.innerHTML = "";
  memory.slice().reverse().forEach(post => addPost(post.author, post.text, post.type, post.replies));
}

// Save a post to memory
function savePost(author, text, type = "", replies = []) {
  memory.push({ author, text, type, replies, timestamp: new Date().toISOString() });
  localStorage.setItem("mdfcMemory", JSON.stringify(memory));
}

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
