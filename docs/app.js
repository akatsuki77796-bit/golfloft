const MAKER_ALIAS_MAP = {
  ping: ["ピン", "ぴん"],
  titleist: ["タイトリスト", "たいとりすと"],
  callaway: ["キャロウェイ", "きゃろうぇい"],
  taylormade: ["テーラーメイド", "てーらーめいど"],
  cobra: ["コブラ", "こぶら"],
  mizuno: ["ミズノ", "みずの"],
  srixon: ["スリクソン", "すりくそん"],
  bridgestone: ["ブリヂストン", "ぶりぢすとん", "ブリジストン", "ぶりじすとん"],
  honma: ["ホンマ", "ほんま"],
  yamaha: ["ヤマハ", "やまは"],
};

const state = {
  clubs: [],
  filtered: [],
  compare: [],
  submittedFilter: {
    maker: "",
    model: "",
    category: "all",
  },
};

const refs = {
  makerInput: document.getElementById("makerInput"),
  modelInput: document.getElementById("modelInput"),
  makerCandidates: document.getElementById("makerCandidates"),
  modelCandidates: document.getElementById("modelCandidates"),
  searchBtn: document.getElementById("searchBtn"),
  categoryFilter: document.getElementById("categoryFilter"),
  clubList: document.getElementById("clubList"),
  compareList: document.getElementById("compareList"),
  listCount: document.getElementById("listCount"),
  clearCompareBtn: document.getElementById("clearCompareBtn"),
  errorMessage: document.getElementById("errorMessage"),
  clubCardTemplate: document.getElementById("clubCardTemplate"),
  compareCardTemplate: document.getElementById("compareCardTemplate"),
};

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function toHiragana(value) {
  return String(value || "").replace(/[ァ-ン]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

function normalizeForSearch(value) {
  const normalized = normalizeText(value);
  return {
    base: normalized,
    hira: toHiragana(normalized),
  };
}

function includesKeyword(target, keyword) {
  if (!keyword.base) {
    return true;
  }
  const normalizedTarget = normalizeForSearch(target);
  return normalizedTarget.base.includes(keyword.base) || normalizedTarget.hira.includes(keyword.hira);
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

function showError(message) {
  refs.errorMessage.textContent = message;
  refs.errorMessage.hidden = false;
}

function hideError() {
  refs.errorMessage.hidden = true;
  refs.errorMessage.textContent = "";
}

function buildMakerTokens(maker) {
  const base = normalizeText(maker);
  const aliases = MAKER_ALIAS_MAP[base] || [];
  return [maker, ...aliases].filter(Boolean);
}

function buildSearchTokens(club) {
  return [...buildMakerTokens(club.maker), club.model];
}

function populateCandidates() {
  const makerSet = new Set();
  const modelSet = new Set();

  state.clubs.forEach((club) => {
    makerSet.add(club.maker);
    modelSet.add(club.model);
  });

  refs.makerCandidates.innerHTML = "";
  refs.modelCandidates.innerHTML = "";

  [...makerSet].sort((a, b) => a.localeCompare(b, "ja")).forEach((maker) => {
    const option = document.createElement("option");
    option.value = maker;
    refs.makerCandidates.appendChild(option);
  });

  [...modelSet].sort((a, b) => a.localeCompare(b, "ja")).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    refs.modelCandidates.appendChild(option);
  });
}

async function loadData() {
  const response = await fetch("./data/clubs.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("データの読み込みに失敗しました。時間をおいて再読み込みしてください。");
  }

  const clubs = await response.json();
  state.clubs = clubs.map((club, index) => ({
    ...club,
    _id: `${club.maker}-${club.model}-${club.year}-${index}`,
    _searchTokens: buildSearchTokens(club),
  }));
  state.filtered = state.clubs;
}

function applyFilters() {
  const makerQuery = normalizeForSearch(state.submittedFilter.maker);
  const modelQuery = normalizeForSearch(state.submittedFilter.model);
  const category = state.submittedFilter.category;

  state.filtered = state.clubs.filter((club) => {
    const matchMaker = club._searchTokens.some((token) => includesKeyword(token, makerQuery));
    const matchModel = includesKeyword(club.model, modelQuery);
    const matchCategory = category === "all" || club.category === category;
    return matchMaker && matchModel && matchCategory;
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

function submitFilters() {
  state.submittedFilter = {
    maker: refs.makerInput.value,
    model: refs.modelInput.value,
    category: refs.categoryFilter.value,
  };
  applyFilters();
}

function initEvents() {
  refs.searchBtn.addEventListener("click", submitFilters);
  refs.makerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitFilters();
    }
  });
  refs.modelInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitFilters();
    }
  });

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
    populateCandidates();
    hideError();
    applyFilters();
    renderCompare();
  } catch (error) {
    showError(error.message);
    refs.clubList.innerHTML = '<p class="empty">データを表示できませんでした。</p>';
    refs.listCount.textContent = "0件";
  }
})();
