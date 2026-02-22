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

function render(clubs) {
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
  refs.listCount.textContent = `${clubs.length}件のクラブが登録されています。`;
}

async function load() {
  try {
    const response = await fetch("./data/clubs.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    render(data.clubs || []);
  } catch (error) {
    showError(`クラブデータの読み込みに失敗しました: ${error.message}`);
  }
}

load();
