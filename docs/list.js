const CATEGORY_LABELS = {
  utility: "ユーティリティ",
  hybrid: "ユーティリティ",
  wood: "ウッド",
  iron: "アイアン",
};

const refs = {
  clubList: document.getElementById("clubList"),
  listCount: document.getElementById("listCount"),
  errorMessage: document.getElementById("errorMessage"),
  clubCardTemplate: document.getElementById("clubCardTemplate"),
};

function showError(message) {
  refs.errorMessage.hidden = false;
  refs.errorMessage.textContent = message;
}

function formatLoft(loft) {
  return Number.isInteger(loft) ? String(loft) : String(loft);
}

function toCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function groupClubsByModel(clubs) {
  const grouped = new Map();

  clubs.forEach((club) => {
    const key = club.model;
    if (!grouped.has(key)) {
      grouped.set(key, {
        model: club.model,
        maker: club.maker,
        category: club.category,
        lofts: [],
      });
    }
    grouped.get(key).lofts.push(Number(club.loft_deg));
  });

  return [...grouped.values()].map((item) => ({
    ...item,
    lofts: [...new Set(item.lofts)].filter(Number.isFinite).sort((a, b) => a - b),
  }));
}

function render(clubs) {
  refs.clubList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  clubs.forEach((club) => {
    const card = refs.clubCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".model").textContent = club.model;
    card.querySelector(".maker").textContent = club.maker;
    card.querySelector(".category").textContent = toCategoryLabel(club.category);
    card.querySelector(".lofts").textContent = club.lofts.map((loft) => `${formatLoft(loft)}°`).join(" / ");
    fragment.append(card);
  });

  refs.clubList.append(fragment);
  refs.listCount.textContent = `${clubs.length}件の型番が登録されています。`;
}

async function load() {
  try {
    const response = await fetch("./data/clubs.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const groupedClubs = groupClubsByModel(data.clubs || []);
    render(groupedClubs);
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
  }
}

load();
