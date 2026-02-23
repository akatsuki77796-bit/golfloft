const state = {
  records: [],
  makers: [],
  typeLabels: [],
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

function formatLoft(loft) {
  return Number.isInteger(loft) ? String(loft) : String(loft);
}

function parseLoftInput(rawValue) {
  const value = Number(rawValue);
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

function initSelect(selectEl, options, allLabel, valueResolver = (option) => option, labelResolver = (option) => option) {
  selectEl.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = allLabel;
  selectEl.append(allOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = valueResolver(option);
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

function showGuide(text) {
  refs.guideMessage.hidden = false;
  refs.guideMessage.textContent = text;
  refs.clubList.hidden = true;
  refs.clubList.innerHTML = "";
  refs.listCount.textContent = "";
}

function renderResults(matches, searchedLoft) {
  refs.clubList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  matches.forEach((record) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = record.model;
    card.querySelector(".maker").textContent = record.maker_name_ja;
    card.querySelector(".category").textContent = record.type_ja;

    const releaseWrap = card.querySelector(".release-date-row");
    if (record.release_date && String(record.release_date).trim() !== "") {
      card.querySelector(".release-date").textContent = record.release_date;
      releaseWrap.hidden = false;
    }

    const loftEl = card.querySelector(".loft");
    loftEl.textContent = `${formatLoft(searchedLoft)}°`;
    loftEl.classList.add("highlight-loft");

    const otherLofts = (record.lofts || []).filter((loft) => Number(loft) !== searchedLoft).sort((a, b) => a - b);
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

function handleSearch() {
  clearError();
  const loft = parseLoftInput(refs.loftSelect.value);

  if (loft === null) {
    showGuide("検索条件が空です。ロフト角を選択してください。");
    return;
  }

  const makerKey = refs.makerFilter.value;
  const typeJa = refs.categoryFilter.value;

  const matches = state.records.filter((record) => {
    const loftMatches = (record.lofts || []).map(Number).includes(loft);
    const makerMatches = makerKey === "all" || record.maker_key === makerKey;
    const typeMatches = typeJa === "all" || record.type_ja === typeJa;
    return loftMatches && makerMatches && typeMatches;
  });

  refs.guideMessage.hidden = true;

  if (!matches.length) {
    showGuide(`ロフト角 ${formatLoft(loft)}° に一致するクラブは見つかりませんでした。`);
    return;
  }

  renderResults(matches, loft);
  refs.listCount.textContent = `${matches.length}件`;
}

async function loadData() {
  try {
    const [makersResponse, indexResponse] = await Promise.all([
      fetch("./data/makers.json", { cache: "no-store" }),
      fetch("./data/search_index.json", { cache: "no-store" }),
    ]);

    if (!makersResponse.ok || !indexResponse.ok) {
      throw new Error(`HTTP ${makersResponse.status}/${indexResponse.status}`);
    }

    const makersData = await makersResponse.json();
    const indexData = await indexResponse.json();

    state.records = indexData.records || [];
    state.makers = [...(makersData.makers || [])].sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
    state.loftOptions = [...new Set(state.records.flatMap((record) => (record.lofts || []).map(Number)).filter(Number.isFinite))].sort(
      (a, b) => a - b,
    );
    state.typeLabels = [...new Set(state.records.map((record) => record.type_ja).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "ja"),
    );

    initLoftSelect(state.loftOptions);
    initSelect(state.makerFilter, state.makers, "すべてのメーカー", (maker) => maker.key, (maker) => maker.name_ja);
    initSelect(state.categoryFilter, state.typeLabels, "すべてのクラブ種別");
    showGuide("ロフト角を選択して検索してください。");
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
    showGuide("データを読み込めなかったため検索できません。");
  }
}

refs.searchBtn.addEventListener("click", handleSearch);
loadData();
