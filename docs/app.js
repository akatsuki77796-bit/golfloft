const state = {
  clubs: [],
  makers: [],
  categories: [],
  loftOptions: [],
};

const refs = {
  loftInput: document.getElementById("loftInput"),
  loftOptions: document.getElementById("loftOptions"),
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

function formatLoft(loft) {
  return Number.isInteger(loft) ? String(loft) : String(loft);
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

function initLoftOptions(lofts) {
  refs.loftOptions.innerHTML = "";
  lofts.forEach((loft) => {
    const option = document.createElement("option");
    option.value = formatLoft(loft);
    refs.loftOptions.append(option);
  });
}

function getOtherLoftsForModel(club, searchedLoft) {
  const otherLofts = state.clubs
    .filter((item) => item.model === club.model && Number(item.loft_deg) !== searchedLoft)
    .map((item) => Number(item.loft_deg));

  const uniqueSorted = [...new Set(otherLofts)].sort((a, b) => a - b);
  return uniqueSorted;
}

function renderClubs(clubs, searchedLoft) {
  refs.clubList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  clubs.forEach((club) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = club.model;
    card.querySelector(".maker").textContent = club.maker;
    card.querySelector(".category").textContent = club.category;

    const loftEl = card.querySelector(".loft");
    loftEl.textContent = `${formatLoft(club.loft_deg)}°`;
    if (Number(club.loft_deg) === searchedLoft) {
      loftEl.classList.add("highlight-loft");
    }

    const otherLofts = getOtherLoftsForModel(club, searchedLoft);
    if (otherLofts.length > 0) {
      const otherWrap = card.querySelector(".other-lofts");
      const otherValues = card.querySelector(".other-lofts-values");
      otherValues.textContent = otherLofts.map((loft) => `${formatLoft(loft)}°`).join(" / ");
      otherWrap.hidden = false;
    }

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
    showGuide(`ロフト角 ${formatLoft(loft)}° に一致するクラブは見つかりませんでした。`);
    return;
  }

  renderClubs(matches, loft);
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
    state.loftOptions = [...new Set(state.clubs.map((club) => Number(club.loft_deg)).filter(Number.isFinite))].sort(
      (a, b) => a - b,
    );

    initSelect(refs.makerFilter, state.makers, "すべてのメーカー");
    initSelect(refs.categoryFilter, state.categories, "すべてのカテゴリ");
    initLoftOptions(state.loftOptions);
    showGuide("ロフト角を入力して検索してください。");
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
    showGuide("データを読み込めなかったため検索できません。");
  }
}

refs.searchBtn.addEventListener("click", handleSearch);
loadClubs();
