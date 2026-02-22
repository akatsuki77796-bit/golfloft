const state = {
  clubs: [],
  filtered: [],
  compare: [],
};

const refs = {
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  clubList: document.getElementById("clubList"),
  compareList: document.getElementById("compareList"),
  listCount: document.getElementById("listCount"),
  clearCompareBtn: document.getElementById("clearCompareBtn"),
  clubCardTemplate: document.getElementById("clubCardTemplate"),
  compareCardTemplate: document.getElementById("compareCardTemplate"),
};

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function formatLoft(value) {
  return typeof value === "number" ? `${value}°` : "未確認";
}

function formatCategory(value) {
  if (value === "hybrid") {
    return "UT/ハイブリッド";
  }
  return value || "-";
}

async function loadData() {
  const response = await fetch("./data/clubs.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("データの読み込みに失敗しました。");
  }

  const clubs = await response.json();
  state.clubs = clubs.map((club, index) => ({
    ...club,
    _id: `${club.maker}-${club.model}-${club.year}-${index}`,
  }));
  state.filtered = state.clubs;
}

function applyFilters() {
  const query = normalizeText(refs.searchInput.value.trim());
  const category = refs.categoryFilter.value;

  state.filtered = state.clubs.filter((club) => {
    const matchQuery =
      !query ||
      normalizeText(club.maker).includes(query) ||
      normalizeText(club.model).includes(query);

    const matchCategory = category === "all" || club.category === category;
    return matchQuery && matchCategory;
  });

  renderList();
}

function renderList() {
  refs.clubList.innerHTML = "";

  if (state.filtered.length === 0) {
    refs.clubList.innerHTML = '<p class="empty">条件に一致するクラブがありません。</p>';
    refs.listCount.textContent = "0件";
    return;
  }

  refs.listCount.textContent = `${state.filtered.length}件`;

  const fragment = document.createDocumentFragment();
  state.filtered.forEach((club) => {
    const node = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".model").textContent = club.model;
    node.querySelector(".maker").textContent = club.maker;
    node.querySelector(".category").textContent = formatCategory(club.category);
    node.querySelector(".loft").textContent = formatLoft(club.loft_deg);
    node.querySelector(".year").textContent = club.year || "-";

    const source = node.querySelector(".source");
    source.href = club.source_url || "#";
    source.textContent = club.source_url ? "参照URLを開く" : "参照URLなし";
    if (!club.source_url) {
      source.removeAttribute("target");
      source.removeAttribute("rel");
    }

    node.querySelector(".notes").textContent = club.notes || "-";

    const addBtn = node.querySelector(".add-btn");
    const isSelected = state.compare.some((item) => item._id === club._id);
    addBtn.disabled = isSelected;
    addBtn.textContent = isSelected ? "追加済み" : "比較に追加";
    addBtn.addEventListener("click", () => addToCompare(club._id));

    fragment.appendChild(node);
  });

  refs.clubList.appendChild(fragment);
}

function renderCompare() {
  refs.compareList.innerHTML = "";

  if (state.compare.length === 0) {
    refs.compareList.innerHTML = '<p class="empty">比較対象がありません。クラブ一覧から追加してください。</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  state.compare.forEach((club) => {
    const node = refs.compareCardTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".model").textContent = club.model;
    node.querySelector(".maker").textContent = club.maker;
    node.querySelector(".category").textContent = formatCategory(club.category);
    node.querySelector(".loft").textContent = formatLoft(club.loft_deg);
    node.querySelector(".year").textContent = club.year || "-";
    node.querySelector(".remove-btn").addEventListener("click", () => removeFromCompare(club._id));
    fragment.appendChild(node);
  });

  refs.compareList.appendChild(fragment);
}

function addToCompare(id) {
  if (state.compare.length >= 5) {
    alert("比較できるのは最大5件までです。");
    return;
  }

  const club = state.clubs.find((item) => item._id === id);
  if (!club || state.compare.some((item) => item._id === id)) {
    return;
  }

  state.compare.push(club);
  renderCompare();
  renderList();
}

function removeFromCompare(id) {
  state.compare = state.compare.filter((item) => item._id !== id);
  renderCompare();
  renderList();
}

function initEvents() {
  refs.searchInput.addEventListener("input", applyFilters);
  refs.categoryFilter.addEventListener("change", applyFilters);
  refs.clearCompareBtn.addEventListener("click", () => {
    state.compare = [];
    renderCompare();
    renderList();
  });
}

(async function bootstrap() {
  initEvents();

  try {
    await loadData();
    renderList();
    renderCompare();
  } catch (error) {
    refs.clubList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
})();
