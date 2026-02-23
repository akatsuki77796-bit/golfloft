const refs = {
  makerList: document.getElementById("makerList"),
  listCount: document.getElementById("listCount"),
  errorMessage: document.getElementById("errorMessage"),
  makerCardTemplate: document.getElementById("makerCardTemplate"),
};

function showError(message) {
  refs.errorMessage.hidden = false;
  refs.errorMessage.textContent = message;
}

function renderMakers(makers) {
  refs.makerList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  makers.forEach((maker) => {
    const card = refs.makerCardTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector(".maker-name").textContent = maker.name_ja;
    const link = card.querySelector(".maker-link");
    link.href = maker.page_url;
    link.textContent = `${maker.name_ja}の登録モデルを表示`;
    fragment.append(card);
  });

  refs.makerList.append(fragment);
  refs.listCount.textContent = `${makers.length}メーカー`;
}

async function loadMakers() {
  try {
    const response = await fetch("./data/makers.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const makers = [...(data.makers || [])].sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
    renderMakers(makers);
  } catch (error) {
    showError(`メーカー一覧の読み込みに失敗しました: ${error.message}`);
  }
}

loadMakers();
