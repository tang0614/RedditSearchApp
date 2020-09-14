const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

function truncateText(text, limit) {
  const short = text.indexOf("", limit);
  if (short == -1) {
    return text;
  }
  return text.substring(0, short);
}
function showMessage(message, className) {
  //create div
  const div = document.createElement("div");
  //Add classes
  div.className = `alert ${className}`;
  //Add text
  div.appendChild(document.createTextNode(message));
  //get parent
  const parentContainer = document.getElementById("search-container");

  //get child
  const childContainer = document.getElementById("search");
  parentContainer.insertBefore(div, childContainer);

  //Timeout alert
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  const sortBy = document.querySelector(`input[name='sortby']:checked`).value;
  const searchLimit = document.getElementById(`limit`).value;

  if (searchTerm === "") {
    showMessage("Please add a serach term", "alert-danger");
  }
  searchInput.value = "";
  //search Reddit

  fetch(`http://www.reddit.com/search.json?q=${searchTerm}&$sort=${sortBy}
    &limit=${searchLimit}`)
    .then((res) => res.json())
    .then((data) => {
      const result = data.data.children.map((r) => {
        console.log(r.data);
        return r.data;
      });
      return result;
    })
    .then((results) => {
      let output = `<div>`;

      results.forEach((r) => {
        let image = r.preview
          ? r.preview.images[0].source.url
          : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";

        output += `<div class="card">
            <div class="card-body">
              <h5 class="card-title">${r.title}</h5>
              <p class="card-text">${truncateText(r.selftext, 400)}</p>
              <a href="${r.url}" class="btn btn-primary">Read More</a>
             <span class='badge badge-secondary> Subreddit: ${
               r.subreddit
             }</span>
             <span class='badge badge-dark> Score: ${r.score}</span>
            </div>
          </div>`;
      });
      output += `</div>`;
      document.getElementById("results").innerHTML = output;
    })
    .catch((err) => err);
});
