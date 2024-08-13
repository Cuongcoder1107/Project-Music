let mapId = new Map();
let mapMusic = new Map();
let id = 0;
let isSelect = -1;
let player = new Audio();
let showMusicToList = (list, music) => {
  let option = document.createElement("div");
  option.className = "options";
  let wrapAvatar = document.createElement("div");
  wrapAvatar.className = "wrap-avatar-options";
  let avatar = document.createElement("img");
  avatar.src = music.imageSource;
  wrapAvatar.appendChild(avatar);
  let wrapTitle = document.createElement("div");
  wrapTitle.className = "wrap-title-options";
  let h2 = document.createElement("h2");
  h2.innerHTML = music.title;
  wrapTitle.appendChild(h2);
  let audioSource = document.createElement("p");
  audioSource.textContent = music.audioSource;
  audioSource.hidden = true;
  option.appendChild(wrapAvatar);
  option.appendChild(wrapTitle);
  option.appendChild(audioSource);
  list.appendChild(option);
  mapId.set(id, option);
  mapMusic.set(option, id);
  id++;
  option.addEventListener("click", () => {
    player.pause();
    player = null;
    if (isSelect >= 0) {
      let optionPre = mapId.get(isSelect);
      optionPre.style.backgroundColor = "";
    }
    document.getElementById("play-pause").children[0].className =
      "fa-solid fa-play";
    isSelect = mapMusic.get(option);
    option.style.backgroundColor = "#f5d0de";
    let avatarPlay = document.getElementById("avatar");
    avatarPlay.src = avatar.src;
    let titlePlay = document.getElementById("title");
    titlePlay.innerHTML = h2.innerHTML;
    player = new Audio(audioSource.textContent);
    player.onended = () => {
      document.getElementById("play-pause").children[0].className =
        "fa-solid fa-play";
    };
  });
};

let removeAllChild = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

let getAllMusic = () => {
  const getApi = "http://localhost:8080/musics";
  fetch(getApi)
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      let library = document.getElementsByClassName("wrap-library")[0];
      removeAllChild(library);
      mapMusic = new Map();
      mapId = new Map();
      data.forEach((element) => {
        showMusicToList(library, element);
      });
      console.log(mapId.get(0).children[0].children[0].src);
    });
};

document.getElementById("play-pause").addEventListener("click", () => {
  let icon = document.getElementById("play-pause").children[0];
  if (icon.className === "fa-solid fa-play") {
    icon.className = "fa-solid fa-pause";
    player.play();
    document.getElementById("range").max = player.duration;
    setInterval(() => {
      document.getElementById("range").value = player.currentTime;
    }, 0);
  } else {
    icon.className = "fa-solid fa-play";
    player.pause();
  }
});

document.getElementById("button-search").addEventListener("click", () => {
  let keyWord = document.getElementById("input-search").value;
  const searchApi = "http://localhost:8080/musics/search?title=" + keyWord;
  fetch(searchApi)
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      mapId = new Map();
      mapMusic = new Map();
      isSelect = -1;
      id = 0;
      let library = document.getElementsByClassName("wrap-library")[0];
      removeAllChild(library);
      data.forEach((element) => {
        showMusicToList(library, element);
      });
    });
});

document.addEventListener("keypress", (event) => {
  if (
    event.key === "Enter" &&
    document.getElementById("input-search").value.length > 0
  ) {
    let keyWord = document.getElementById("input-search").value;
    const searchApi = "http://localhost:8080/musics/search?title=" + keyWord;
    fetch(searchApi)
      .then((reponse) => {
        return reponse.json();
      })
      .then((data) => {
        mapId = new Map();
        mapMusic = new Map();
        isSelect = -1;
        id = 0;
        let library = document.getElementsByClassName("wrap-library")[0];
        removeAllChild(library);
        data.forEach((element) => {
          showMusicToList(library, element);
        });
      });
  }
});

document.getElementById("input-search").addEventListener("input", () => {
  if (document.getElementById("input-search").value.length == 0) {
    getAllMusic();
  }
});

let selectMusic = (index) => {
  document.getElementById("avatar").src =
    mapId.get(index).children[0].children[0].src;
  document.getElementById("title").innerHTML =
    mapId.get(index).children[1].children[0].innerHTML;
  player.pause();
  player = null;
  player = new Audio(mapId.get(index).children[2].textContent);
  document.getElementById("play-pause").children[0].className =
    "fa-solid fa-play";
  mapId.get(index).style.backgroundColor = "#f5d0de";
};

document.getElementById("forward-step").addEventListener("click", () => {
  mapId.get(isSelect).style.backgroundColor = "";
  if (isSelect == mapId.size - 1) {
    isSelect = 0;
    selectMusic(isSelect);
    return;
  }
  isSelect += 1;
  selectMusic(isSelect);
});

document.getElementById("backward-step").addEventListener("click", () => {
  mapId.get(isSelect).style.backgroundColor = "";
  if (isSelect == 0) {
    isSelect = mapId.size - 1;
    selectMusic(isSelect);
    return;
  }
  isSelect -= 1;
  selectMusic(isSelect);
});

document.getElementById("range").addEventListener("input", () => {
  player.currentTime = document.getElementById("range").value;
});

document.getElementById("mode").addEventListener("change", () => {
  let option = document.getElementById("mode");
  if (option.value == "Online") {
    window.location.href = "/index.html";
  }
});

getAllMusic();
