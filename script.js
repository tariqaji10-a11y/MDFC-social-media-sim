const timeline = document.getElementById("timeline");

// Load memory from localStorage
let memory = JSON.parse(localStorage.getItem("mdfcMemory")) || [];

function addPost(author, text) {
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `<strong>${author}</strong><br>${text}`;
  timeline.prepend(div);
}

function renderMemory() {
  timeline.innerHTML = "";
  memory.slice().reverse().forEach(post => addPost(post.author, post.text));
}

function savePost(author, text) {
  memory.push({ author, text, timestamp: new Date().toISOString() });
  localStorage.setItem("mdfcMemory", JSON.stringify(memory));
}

function sendPost() {
  const text = document.getElementById("mdfcPost").value.trim();
  if (!text) return;

  addPost("@MiltonDeluxFC", text);
  savePost("@MiltonDeluxFC", text);
  document.getElementById("mdfcPost").value = "";

  simulateAI(text);
}

// FAKE AI placeholder for now
function simulateAI(userPost) {
  // Example AI-generated replies/posts
  const aiPosts = [
    {author: "@FabrizioRomano", text: "🚨 Breaking: MDFC situation developing..."},
    {author: "@FanAccount", text: "This club is finished 😭"},
    {author: "@RivalFan", text: "Small club mentality."},
  ];

  aiPosts.forEach(p => {
    addPost(p.author, p.text);
    savePost(p.author, p.text);
  });
}

// Render any memory from previous sessions
renderMemory();
