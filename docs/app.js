const state = {
  clubs: [],
  makers: [],
  categories: [],
};

const refs = {
  loftInput: document.getElementById("loftInput"),
  makerFilter: document.getElementById("makerFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  searchBtn: document.getElementById("searchBtn"),
  clubList: document.getElementById("clubList"),
  guideMessage: document.getElementById("guideMessage"),
  listCount: document.getElementById("listCount"),
  errorMessage: document.getElementById("errorMessage"),
  clubCardTemplate: document.getElementById("clubCardTemplate"),
};

function parseLoftInput(rawValue) {
  const normalized = String(rawValue || "")
    .normalize("NFKC")
    .replace(/度|°/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (!normalized) {
    return null;
  }

  const match = normalized.match(/[+-]?\d+(?:\.\d+)?/);
  if (!match) {
    return null;
  }

  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

function showError(message) {
  refs.errorMessage.hidden = false;
  refs.errorMessage.textContent = message;
}

function clearError() {
  refs.errorMessage.hidden = true;
  refs.errorMessage.textContent = "";
}

function initSelect(selectEl, options, allLabel) {
  selectEl.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = allLabel;
  selectEl.append(allOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    selectEl.append(opt);
  });
}

function renderClubs(clubs) {
  refs.clubList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  clubs.forEach((club) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = club.model;
    card.querySelector(".maker").textContent = club.maker;
    card.querySelector(".category").textContent = club.category;
    card.querySelector(".loft").textContent = `${club.loft_deg}°`;
    fragment.append(card);
  });

  refs.clubList.append(fragment);
  refs.clubList.hidden = false;
}

function showGuide(text) {
  refs.guideMessage.hidden = false;
  refs.guideMessage.textContent = text;
  refs.clubList.hidden = true;
  refs.clubList.innerHTML = "";
  refs.listCount.textContent = "";
}

function handleSearch() {
  clearError();

  const loft = parseLoftInput(refs.loftInput.value);
  if (loft === null) {
    showGuide("検索条件が空です。ロフト角を入力してください。");
    return;
  }

  const maker = refs.makerFilter.value;
  const category = refs.categoryFilter.value;

  const matches = state.clubs.filter((club) => {
    const loftMatches = Number(club.loft_deg) === loft;
    const makerMatches = maker === "all" || club.maker === maker;
    const categoryMatches = category === "all" || club.category === category;
    return loftMatches && makerMatches && categoryMatches;
  });

  refs.guideMessage.hidden = true;

  if (!matches.length) {
    showGuide(`ロフト角 ${loft}° に一致するクラブは見つかりませんでした。`);
    return;
  }

  renderClubs(matches);
  refs.listCount.textContent = `${matches.length}件`;
}

async function loadClubs() {
  try {
    const response = await fetch("./data/clubs.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    state.makers = data.makers || [];
    state.categories = data.categories || [];
    state.clubs = data.clubs || [];

    initSelect(refs.makerFilter, state.makers, "すべてのメーカー");
    initSelect(refs.categoryFilter, state.categories, "すべてのカテゴリ");
    showGuide("ロフト角を入力して検索してください。");
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
    showGuide("データを読み込めなかったため検索できません。");
  }
}

refs.searchBtn.addEventListener("click", handleSearch);
loadClubs();
