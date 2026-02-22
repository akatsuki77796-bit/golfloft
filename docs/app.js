const CATEGORY_LABELS = {
  utility: "ユーティリティ",
  hybrid: "ユーティリティ",
  wood: "ウッド",
  iron: "アイアン",
};

const MAKER_DISPLAY_MAP = {
  Titleist: "タイトリスト",
  PING: "ピン",
  TaylorMade: "テーラーメイド",
  Callaway: "キャロウェイ",
  Mizuno: "ミズノ",
  HONMA: "本間ゴルフ",
};

const state = {
  clubs: [],
  makers: [],
  categoryLabels: [],
  loftOptions: [],
};

const refs = {
  loftSelect: document.getElementById("loftSelect"),
  makerFilter: document.getElementById("makerFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  searchBtn: document.getElementById("searchBtn"),
  clubList: document.getElementById("clubList"),
  guideMessage: document.getElementById("guideMessage"),
  listCount: document.getElementById("listCount"),
  errorMessage: document.getElementById("errorMessage"),
  clubCardTemplate: document.getElementById("clubCardTemplate"),
};

function toCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function toMakerLabel(maker) {
  return MAKER_DISPLAY_MAP[maker] || maker;
}

function parseLoftInput(rawValue) {
  const value = Number(rawValue);
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

function initSelect(selectEl, options, allLabel, labelResolver = (option) => option) {
  selectEl.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = allLabel;
  selectEl.append(allOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = labelResolver(option);
    selectEl.append(opt);
  });
}

function initLoftSelect(lofts) {
  refs.loftSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "ロフト角を選択してください";
  refs.loftSelect.append(placeholderOption);

  lofts.forEach((loft) => {
    const option = document.createElement("option");
    option.value = formatLoft(loft);
    option.textContent = `${formatLoft(loft)}°`;
    refs.loftSelect.append(option);
  });
}

function getOtherLoftsForModel(club, searchedLoft) {
  const otherLofts = state.clubs
    .filter((item) => item.model === club.model && Number(item.loft_deg) !== searchedLoft)
    .map((item) => Number(item.loft_deg));

  return [...new Set(otherLofts)].sort((a, b) => a - b);
}

function renderClubs(clubs, searchedLoft) {
  refs.clubList.innerHTML = "";

  const fragment = document.createDocumentFragment();
  clubs.forEach((club) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = club.model;
    card.querySelector(".maker").textContent = toMakerLabel(club.maker);
    card.querySelector(".category").textContent = toCategoryLabel(club.category);

    const releaseWrap = card.querySelector(".release-date-row");
    if (club.release_date && String(club.release_date).trim() !== "") {
      card.querySelector(".release-date").textContent = club.release_date;
      releaseWrap.hidden = false;
    }

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

  const loft = parseLoftInput(refs.loftSelect.value);
  if (loft === null) {
    showGuide("検索条件が空です。ロフト角を選択してください。");
    return;
  }

  const maker = refs.makerFilter.value;
  const categoryLabel = refs.categoryFilter.value;

  const matches = state.clubs.filter((club) => {
    const loftMatches = Number(club.loft_deg) === loft;
    const makerMatches = maker === "all" || club.maker === maker;
    const categoryMatches = categoryLabel === "all" || toCategoryLabel(club.category) === categoryLabel;
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
    state.clubs = data.clubs || [];
    state.loftOptions = [...new Set(state.clubs.map((club) => Number(club.loft_deg)).filter(Number.isFinite))].sort(
      (a, b) => a - b,
    );
    state.categoryLabels = [...new Set(state.clubs.map((club) => toCategoryLabel(club.category)))].sort((a, b) =>
      a.localeCompare(b, "ja"),
    );

    state.makers = [...new Set((data.makers || state.clubs.map((club) => club.maker)).filter(Boolean))].sort((a, b) =>
      toMakerLabel(a).localeCompare(toMakerLabel(b), "ja"),
    );

    initSelect(refs.makerFilter, state.makers, "すべてのメーカー", toMakerLabel);
    initSelect(refs.categoryFilter, state.categoryLabels, "すべてのクラブ種別");
    initLoftSelect(state.loftOptions);
    showGuide("ロフト角を選択して検索してください。");
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
    showGuide("データを読み込めなかったため検索できません。");
  }
}

refs.searchBtn.addEventListener("click", handleSearch);
loadClubs();
