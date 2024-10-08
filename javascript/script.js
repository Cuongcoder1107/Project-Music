const API_KEY = "AIzaSyDalXye2e18ovwHf7oIv3eL1PSFusRAPZ4";
let dataMusic = [];
let listMusic = [];
let list = document.getElementById("list");
let isPlaying = 0;
let count = 0;
let searchMusic = (keyword) => {
  const searchApi = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${keyword}&key=${API_KEY}`;
  fetch(searchApi)
    .then((reponse) => {
      return reponse.json();
    })
    .then((data) => {
      let avatar = document.getElementById("album");
      avatar.src = data.items[0].snippet.thumbnails.medium.url;
      let title = document.getElementById("title");
      title.innerHTML = data.items[0].snippet.title;
      let iFrame = document.getElementsByTagName("iframe")[0];
      iFrame.src =
        "https://www.youtube.com/embed/" +
        data.items[0].id.videoId +
        "?rel=0&enablejsapi=1&autoplay=1&controls=0";
      document.getElementById("play-pause").childNodes[1].className =
        "fa-solid fa-pause";
      while (dataMusic.length > 0) {
        dataMusic.pop();
      }
      while (listMusic.length > 0) {
        listMusic.pop();
      }
      list.innerHTML = "";
      data.items.forEach((element) => {
        dataMusic.push(element);
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.className = "album-of-list";
        img.src = element.snippet.thumbnails.medium.url;
        listMusic.push(img.src);
        div.appendChild(img);
        let h2 = document.createElement("h2");
        h2.innerHTML = element.snippet.title;
        div.appendChild(h2);
        list.appendChild(div);
      });
      list.children[0].style.backgroundColor = "#eb94b5";
      isPlaying = 0;
      list.childNodes[isPlaying].style.backgroundColor = "#eb94b5";
      list.childNodes[isPlaying].style.border = "5px";
      list.childNodes[isPlaying].style.borderRadius = "10px";
      for (let i = 0; i < list.childNodes.length; i++) {
        list.childNodes[i].addEventListener("click", () => {
          selectMusic(listMusic[i]);
        });
      }
    });
};
document
  .getElementById("input-search")
  .addEventListener("keypress", (event) => {
    if (
      event.key === "Enter" &&
      document.getElementById("input-search").value.length > 0
    ) {
      let keyword = document.getElementById("input-search").value;
      searchMusic(keyword);
    }
  });
function selectMusic(url) {
  let index = 0;
  dataMusic.forEach((element) => {
    if (element.snippet.thumbnails.medium.url == url) {
      let avatar = document.getElementById("album");
      avatar.src = url;
      let title = document.getElementById("title");
      title.innerHTML = element.snippet.title;
      list.childNodes[isPlaying].style.backgroundColor = "";
      isPlaying = index;
      let iFrame = document.getElementsByTagName("iframe")[0];
      iFrame.src =
        "https://www.youtube.com/embed/" +
        element.id.videoId +
        "?rel=0&enablejsapi=1&autoplay=1&disablekb=0";
      list.childNodes[isPlaying].style.backgroundColor = "#eb94b5";
      list.childNodes[isPlaying].style.border = "5px";
      list.childNodes[isPlaying].style.borderRadius = "10px";
      document.getElementById("play-pause").childNodes[1].className =
        "fa-solid fa-pause";
    } else {
      index++;
    }
  });
}
document.getElementById("play-pause").addEventListener("click", () => {
  let icon = document.getElementById("play-pause").childNodes[1];
  if (icon.className == "fa-solid fa-play") {
    icon.className = "fa-solid fa-pause";
    controlVideo("playVideo");
    // player.playVideo();
  } else {
    icon.className = "fa-solid fa-play";
    controlVideo("pauseVideo");
    // player.pauseVideo();
  }
});
function controlVideo(vidFunc) {
  var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
  iframe.postMessage(
    '{"event":"command","func":"' + vidFunc + '","args":""}',
    "*"
  );
}
document.getElementById("previous").addEventListener("click", () => {
  if (isPlaying == 0) {
    selectMusic(listMusic[listMusic.length - 1]);
    return;
  }
  selectMusic(listMusic[isPlaying - 1]);
});
document.getElementById("next").addEventListener("click", () => {
  if (isPlaying == listMusic.length) {
    selectMusic(listMusic[0]);
    return;
  }
  selectMusic(listMusic[isPlaying + 1]);
});

document.getElementsByClassName("on-off")[0].addEventListener("change", () => {
  let option = document.getElementById("mode");
  if (option.value == "Offline") {
    window.location.href = "/index2.html";
  }
});
