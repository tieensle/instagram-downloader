const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btn = $("#search-btn");
const imgGallery = $(".image-gallery");
const btnDownloadAll = $(".all-download-btn");

btn.addEventListener("click", async (event) => {
  event.preventDefault();
  const url = $("#url").value;
  if (!url) {
    return;
  }
  imgGallery.innerHTML = `
    <p class="collecting-txt">Collecting</p>
  `;
  const { imgs, err } = await fetch("/img", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      //TODO: HANDLE ERROR
    });
  imgGallery.innerHTML = "";
  btnDownloadAll.style.setProperty("display", "block");

  for (let i = 0; i < imgs.length; i++) {
    const element = `
        <div class="image" style="background-image: url(${imgs[i]})">
              <div class="download-btn">Download</div>
        </div>
    `;
    imgGallery.innerHTML += element;
  }

  const singleDownBtn = $$(".download-btn");

  singleDownBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const url = event.target.getAttribute("data-link");
      forceDownload(url, "image.png");
    });
  });

  btnDownloadAll.addEventListener("click", () => {
    let index = 0;
    const timer = setInterval(() => {
      if (index == imgs.length - 1) clearInterval(timer);
      forceDownload(imgs[index], `image${++index}.png`);
    }, 100);
    // }
  });
});

//function to send request download image
function forceDownload(url, fileName) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

const contentArea = $(".content");

const disabledItems = $$(".disabled-item");
disabledItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    contentArea.innerHTML = `<p class="coming-soon-txt">Coming soon...</p>`;
  });
});

const itemInfo = $(".item-info");
const downloadFbBtn = $("#download-fb");
downloadFbBtn.addEventListener("click", (e) => {
  e.preventDefault();
  itemInfo.innerHTML = `
    <div class="item-title">DOWNLOADER FOR FACEBOOK</div>
    <div class="item-description">
      Use Downloader for Facebook to save Facebook photos and videos
      from your Facebook account or any public one.
    </div>
  `;
});

const items = $$(".menu-item");
const downloadItems = $$(".menu-download-item");
items.forEach((item) => {
  item.addEventListener("click", (e) => {
    items.forEach((item) => {
      item.classList.remove("is-active");
    });
    item.classList.add("is-active");
  });
});

downloadItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    downloadItems.forEach((item) => {
      item.classList.remove("is-active-download");
    });
    item.classList.add("is-active-download");
  });
});
