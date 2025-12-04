
//get search box
const searchBar = document.getElementById("search");
//get all posts, since all posts use the .full-width class
let allPosts = Array.from(document.querySelectorAll(".full-width"));
//makes a copy of the original list so that it can be changed(for when filters are active)
let filteredPosts = [...allPosts];

//change the amount of posts per page and set current page
const postsPerPage = 3;
let currentPage = 1;

//Re-render the list based on what posts are filtered
function renderPage(page) {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Fix page bounds
  currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // Hide all posts first
  allPosts.forEach(p => p.style.display = "none");

  // Figure out which ones to show
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;

  filteredPosts.slice(start, end).forEach(p => {
    p.style.display = "";
  });

  renderPaginationControls(totalPages);
}

//Pagination buttons
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

// Badge logic
let badges = document.querySelectorAll(".badgeItem");

badges.forEach(badge => {
  badge.addEventListener("click", function () {
    let clickedBadge = badge.dataset.badge.toLowerCase();

    filteredPosts = allPosts.filter(post => {
      let postBadge = (post.dataset.badge || "").toLowerCase();
      return postBadge.includes(clickedBadge);
    });

    currentPage = 1;
    renderPage(currentPage);
  });
});


//SEARCH LOGIC (LIVE)
searchBar.addEventListener("input", function () {
  let query = searchBar.value.toLowerCase();

  //Filter posts by title/date
  filteredPosts = allPosts.filter(post => {
    let title = post.dataset.title.toLowerCase();
    let date = post.dataset.date.toLowerCase();
    return title.includes(query) || date.includes(query);
  });

  // Reset to page 1 when searching
  currentPage = 1;

  renderPage(currentPage);
});

// --- CLEAR ALL FILTERS ---
document.getElementById("clearFilters").addEventListener("click", function () {
  // Reset search bar
  searchBar.value = "";

  // Reset filtered posts to show everything
  filteredPosts = [...allPosts];

  // Reset page
  currentPage = 1;

  // Re-render the full list
  renderPage(currentPage);
});


//Popup logic
let openBtn = document.getElementById("openPopup");
let closeBtn = document.getElementById("closePopup");
let overlay = document.getElementById("popupOverlay");

openBtn.addEventListener("click", () => {
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.remove("active");
});

// Click outside popup closes it
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("active");
  }
});





// Initial load
renderPage(1);


