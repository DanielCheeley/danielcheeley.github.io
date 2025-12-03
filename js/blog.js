const searchBar = document.getElementById("search");
let allPosts = Array.from(document.querySelectorAll(".full-width"));
let filteredPosts = [...allPosts];

const postsPerPage = 3;
let currentPage = 1;

// --- Re-render the list based on what posts are filtered ---
function renderPage(page) {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Fix page bounds
  currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // Hide ALL posts first
  allPosts.forEach(p => p.style.display = "none");

  // Figure out which ones to show
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;

  filteredPosts.slice(start, end).forEach(p => {
    p.style.display = "";
  });

  renderPaginationControls(totalPages);
}

// --- Pagination buttons ---
function renderPaginationControls(totalPages) {
  const container = document.getElementById("paginationControls");
  container.innerHTML = "";

  // Hide pagination entirely when no posts
  if (filteredPosts.length === 0) return;

  if (currentPage > 1) {
    const backBtn = document.createElement("button");
    backBtn.textContent = "← Previous";
    backBtn.onclick = () => renderPage(currentPage - 1);
    container.appendChild(backBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.onclick = () => renderPage(currentPage + 1);
    container.appendChild(nextBtn);
  }
}

// --- SEARCH LOGIC (LIVE) ---
searchBar.addEventListener("input", function () {
  let query = searchBar.value.toLowerCase();

  // Filter posts by title/date
  filteredPosts = allPosts.filter(post => {
    let title = post.dataset.title.toLowerCase();
    let date = post.dataset.date.toLowerCase();
    return title.includes(query) || date.includes(query);
  });

  // Reset to page 1 when searching
  currentPage = 1;

  renderPage(currentPage);
});

// Initial load
renderPage(1);
