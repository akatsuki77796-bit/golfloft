const state = {
  records: [],
  makers: [],
  typeLabels: [],
  loftOptions: [],
};

const refs = {
  loftSelect: null,
  makerFilter: null,
  categoryFilter: null,
  searchBtn: null,
  clubList: null,
  guideMessage: null,
  listCount: null,
  errorMessage: null,
  clubCardTemplate: null,
  makerLinks: null,
};

function formatLoft(loft) {
  return Number.isInteger(loft) ? String(loft) : String(loft);
}

function parseLoftInput(rawValue) {
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function normalizeTypeJa(record) {
  if (record?.type_ja && String(record.type_ja).trim() !== "") {
    return record.type_ja;
  }

  return record?.type === "hybrid" ? "ユーティリティ" : "";
}

function normalizeModelName(modelName) {
  if (!modelName) {
    return "";
  }

  return String(modelName)
    .replace(/\s*(?:Hybrid|ハイブリッド|ユーティリティ|Utility)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseReleaseDateValue(rawDate) {
  if (!rawDate || String(rawDate).trim() === "") {
    return Number.NEGATIVE_INFINITY;
  }

  const normalized = String(rawDate).trim().replace(/\//g, "-");
  const match = normalized.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) {
    return Number.NEGATIVE_INFINITY;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = match[3] ? Number(match[3]) : 1;

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return Number.NEGATIVE_INFINITY;
  }

  return Date.UTC(year, month - 1, day);
}

function showError(message) {
  if (refs.errorMessage) {
    refs.errorMessage.hidden = false;
    refs.errorMessage.textContent = message;
    return;
  }

  console.error(message);
}

function clearError() {
  if (!refs.errorMessage) {
    return;
  }

  refs.errorMessage.hidden = true;
  refs.errorMessage.textContent = "";
}

function initSelect(selectEl, options, placeholderLabel, valueResolver = (option) => option, labelResolver = (option) => option) {
  if (!selectEl) {
    console.error(`セレクト要素が見つからないため初期化できません: ${placeholderLabel}`);
    return;
  }

  selectEl.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholderLabel;
  selectEl.append(placeholderOption);

  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = valueResolver(option);
    opt.textContent = labelResolver(option);
    selectEl.append(opt);
  });
}

function initLoftSelect(lofts) {
  if (!refs.loftSelect) {
    console.error("ロフト角セレクト要素が見つからないため初期化できません。");
    return;
  }

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
  if (!refs.guideMessage || !refs.clubList || !refs.listCount) {
    console.error("ガイド表示先要素が見つからないためガイドメッセージを更新できません。");
    return;
  }

  refs.guideMessage.hidden = false;
  refs.guideMessage.textContent = text;
  refs.clubList.hidden = true;
  refs.clubList.innerHTML = "";
  refs.listCount.textContent = "";
}

function renderResults(matches, searchedLoft) {
  if (!refs.clubList || !refs.clubCardTemplate) {
    console.error("検索結果表示先要素が見つからないため結果を描画できません。");
    return;
  }

  refs.clubList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  matches.forEach((record) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = normalizeModelName(record.model);
    card.querySelector(".maker").textContent = record.maker_name_ja;
    card.querySelector(".category").textContent = normalizeTypeJa(record);

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

function renderMakerLinks(makers) {
  if (!refs.makerLinks) {
    console.error("メーカーリンク表示先要素が見つからないためリンクを描画できません。");
    return;
  }

  refs.makerLinks.innerHTML = "";
  const fragment = document.createDocumentFragment();

  makers.forEach((maker) => {
    const link = document.createElement("a");
    link.className = "subtle-link maker-inline-link";
    link.href = maker.page_url;
    link.textContent = maker.name_ja;
    fragment.append(link);
  });

  refs.makerLinks.append(fragment);
}

function handleSearch() {
  clearError();

  if (!refs.loftSelect || !refs.makerFilter || !refs.categoryFilter || !refs.guideMessage || !refs.listCount) {
    showError("検索に必要な画面要素が見つからないため処理を実行できません。");
    return;
  }

  const loft = parseLoftInput(refs.loftSelect.value);

  if (loft === null) {
    showGuide("検索条件が空です。ロフト角を選択してください。");
    return;
  }

  const makerKey = refs.makerFilter.value;
  const typeJa = refs.categoryFilter.value;

  const matches = state.records.filter((record) => {
    const loftMatches = (record.lofts || []).map(Number).includes(loft);
    const makerMatches = makerKey === "" || record.maker_key === makerKey;
    const typeMatches = typeJa === "" || normalizeTypeJa(record) === typeJa;
    return loftMatches && makerMatches && typeMatches;
  });

  refs.guideMessage.hidden = true;

  matches.sort((a, b) => parseReleaseDateValue(b.release_date) - parseReleaseDateValue(a.release_date));

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
    state.typeLabels = [...new Set(state.records.map((record) => normalizeTypeJa(record)).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "ja"),
    );

    initLoftSelect(state.loftOptions);
    initSelect(refs.makerFilter, state.makers, "選択してください", (maker) => maker.key, (maker) => maker.name_ja);
    initSelect(refs.categoryFilter, state.typeLabels, "選択してください");
    renderMakerLinks(state.makers);
    showGuide("ロフト角を選択して検索してください。");
  } catch (error) {
    const message = `クラブデータの読み込みに失敗しました: ${error.message}`;
    if (refs.errorMessage) {
      showError(message);
    } else {
      console.error(message);
    }
    showGuide("データを読み込めなかったため検索できません。");
  }
}

function collectRefs() {
  refs.loftSelect = document.getElementById("loftSelect");
  refs.makerFilter = document.getElementById("makerFilter");
  refs.categoryFilter = document.getElementById("categoryFilter");
  refs.searchBtn = document.getElementById("searchBtn");
  refs.clubList = document.getElementById("clubList");
  refs.guideMessage = document.getElementById("guideMessage");
  refs.listCount = document.getElementById("listCount");
  refs.errorMessage = document.getElementById("errorMessage");
  refs.clubCardTemplate = document.getElementById("clubCardTemplate");
  refs.makerLinks = document.getElementById("makerLinks");
}

function validateRefs() {
  const required = [
    ["loftSelect", refs.loftSelect],
    ["makerFilter", refs.makerFilter],
    ["categoryFilter", refs.categoryFilter],
    ["searchBtn", refs.searchBtn],
    ["clubList", refs.clubList],
    ["guideMessage", refs.guideMessage],
    ["listCount", refs.listCount],
    ["clubCardTemplate", refs.clubCardTemplate],
  ];

  const missingIds = required.filter(([, value]) => !value).map(([id]) => id);
  if (missingIds.length === 0) {
    return true;
  }

  showError(`初期化に失敗しました。必要なDOM要素が見つかりません: ${missingIds.join(", ")}`);
  console.error("初期化に失敗しました。必要なDOM要素が見つかりません。", missingIds);
  return false;
}

function bootstrap() {
  collectRefs();
  if (!validateRefs()) {
    return;
  }

  refs.searchBtn.addEventListener("click", handleSearch);
  loadData();
}

document.addEventListener("DOMContentLoaded", bootstrap);
