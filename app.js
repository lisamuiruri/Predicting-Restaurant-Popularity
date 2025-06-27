// Prediction formula
function predictPopularity(rating, reviews, price) {
  return (rating * 25) + (reviews * 0.3) + (price * -10);
}

function renderRestaurants(data) {
  const container = document.getElementById("restaurant-list");
  container.innerHTML = "";
  data.forEach(r => {
    const score = predictPopularity(r.rating, r.reviews, r.price_level);
    container.innerHTML += `
      <div class="restaurant">
        <img src="${r.image}" alt="${r.name}" />
        <h2>${r.name}</h2>
        <p><strong>Location:</strong> ${r.location}</p>
        <p><strong>Rating:</strong> ${r.rating}</p>
        <p><strong>Reviews:</strong> ${r.reviews}</p>
        <p><strong>Price Level:</strong> ${r.price_level}</p>
        <p><strong>Predicted Popularity:</strong> ${score.toFixed(1)}</p>
        <p><strong>Summary:</strong> ${r.summary}</p>
      </div>
    `;
  });
}

let popularityChart;

function updateChart(data) {
  const top5 = [...data].sort((a, b) =>
    predictPopularity(b.rating, b.reviews, b.price_level) -
    predictPopularity(a.rating, a.reviews, a.price_level)
  ).slice(0, 5);

  const labels = top5.map(r => r.name);
  const scores = top5.map(r => predictPopularity(r.rating, r.reviews, r.price_level));

  const ctx = document.getElementById("popularityChart").getContext("2d");

  if (popularityChart) {
    popularityChart.destroy();
  }

  popularityChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Predicted Popularity Score",
        data: scores,
        backgroundColor: "#00796b"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Top 5 Restaurants by Predicted Popularity"
        }
      }
    }
  });
}

// Fetch local db.json file
fetch("db.json")
  .then(res => res.json())
  .then(data => {
    const restaurants = data.restaurants.map(r => ({
      ...r,
      score: predictPopularity(r.rating, r.reviews, r.price_level)
    }));

    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    function applyFilters() {
      const keyword = searchInput.value.toLowerCase();
      const sortBy = sortSelect.value;

      let filtered = restaurants.filter(r =>
        r.name.toLowerCase().includes(keyword) ||
        r.location.toLowerCase().includes(keyword)
      );

      filtered.sort((a, b) => b[sortBy] - a[sortBy]);

      renderRestaurants(filtered);
      updateChart(filtered);
    }

    renderRestaurants(restaurants);
    updateChart(restaurants);

    searchInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
  })
  .catch(err => {
    console.error("Fetch error:", err);
    document.getElementById("restaurant-list").innerText = "Failed to load restaurant data.";
  });


