const refs = {
  pageTitle: document.getElementById("pageTitle"),
  pageLead: document.getElementById("pageLead"),
  listCount: document.getElementById("listCount"),
  modelList: document.getElementById("modelList"),
  errorMessage: document.getElementById("errorMessage"),
  modelCardTemplate: document.getElementById("modelCardTemplate"),
};

function formatLoft(loft) {
  return Number.isInteger(loft) ? String(loft) : String(loft);
}

function showError(message) {
  refs.errorMessage.hidden = false;
  refs.errorMessage.textContent = message;
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

function renderModels(makerName, models) {
  refs.pageTitle.textContent = makerName;
  document.title = `${makerName} 登録クラブ一覧`;
  refs.pageLead.textContent = `${makerName}の登録済みモデルとロフト角一覧です。`;
  refs.modelList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  const visibleModels = document.body.dataset.verifiedOnly === "true"
    ? models.filter((model) => model.source_url && String(model.source_url).trim() !== "")
    : models;

  const sortedModels = [...visibleModels].sort((a, b) => {
    const releaseA = String(a?.release_date || "").trim();
    const releaseB = String(b?.release_date || "").trim();

    if (!releaseA && !releaseB) {
      return String(a?.model || "").localeCompare(String(b?.model || ""), "ja");
    }

    if (!releaseA) {
      return 1;
    }

    if (!releaseB) {
      return -1;
    }

    if (releaseA === releaseB) {
      return String(a?.model || "").localeCompare(String(b?.model || ""), "ja");
    }

    return releaseB.localeCompare(releaseA);
  });

  sortedModels.forEach((model) => {
    const card = refs.modelCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = normalizeModelName(model.model);
    card.querySelector(".category").textContent = normalizeTypeJa(model);
    const loftValues = (model.lofts || []).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
    const loftText = loftValues.map((loft) => `${formatLoft(loft)}°`).join(" / ");
    const needsReview = !loftValues.length || (model.notes && String(model.notes).includes("要確認"));
    card.querySelector(".lofts").textContent = loftText || "要確認";

    if (needsReview) {
      const review = document.createElement("p");
      review.className = "muted";
      review.textContent = model.notes && String(model.notes).trim() !== "" ? model.notes : "要確認";
      card.append(review);
    }

    const releaseWrap = card.querySelector(".release-date-row");
    if (model.release_date && String(model.release_date).trim() !== "") {
      card.querySelector(".release-date").textContent = model.release_date;
      releaseWrap.hidden = false;
    }

    const sourceLink = card.querySelector(".source-link");
    if (model.source_url) {
      sourceLink.href = model.source_url;
      sourceLink.textContent = "参照ページ";
    } else {
      const sourceText = document.createElement("span");
      sourceText.className = "source-text";
      sourceText.textContent = "参照元URL未登録";
      sourceLink.replaceWith(sourceText);
    }

    fragment.append(card);
  });

  refs.modelList.append(fragment);
  refs.listCount.textContent = `${sortedModels.length}件の型番`;
}

async function loadMakerPage() {
  const makerKey = document.body.dataset.makerKey;
  const initialMakerName = document.body.dataset.makerNameJa || makerKey;

  refs.pageTitle.textContent = initialMakerName;
  document.title = `${initialMakerName} 登録クラブ一覧`;
  refs.pageLead.textContent = `${initialMakerName}のデータを読み込み中です...`;
  refs.listCount.textContent = "読み込み中...";

  try {
    const [makersResponse, makerDataResponse] = await Promise.all([
      fetch("../data/makers.json", { cache: "no-store" }),
      fetch(`../data/makers/${makerKey}.json`, { cache: "no-store" }),
    ]);

    if (!makersResponse.ok || !makerDataResponse.ok) {
      throw new Error(`HTTP ${makersResponse.status}/${makerDataResponse.status}`);
    }

    const makersData = await makersResponse.json();
    const makerData = await makerDataResponse.json();
    const makerInfo = (makersData.makers || []).find((maker) => maker.key === makerKey);
    const makerName = makerInfo ? makerInfo.name_ja : makerData.maker_name_ja || makerKey;

    renderModels(makerName, makerData.models || []);
  } catch (error) {
    showError(`メーカー別データの読み込みに失敗しました: ${error.message}`);
  }
}

loadMakerPage();
