const btn = document.querySelector("#img-btn");
const area = document.querySelector("#img-area");

btn.addEventListener("click", async () => {
  const url = document.querySelector("#img-url").value;
  const imgArea = document.getElementById("img-area");
  imgArea.innerHTML = "Collecting...";
  console.log(url);
  const { imgs } = await fetch("http://localhost:3000", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url }),
  }).then((res) => {
    return res.json();
  });
  let row = document.createElement("div");
  row.classList.add("row");

  for (let i = 0; i < imgs.length; i++) {
    const element = `
            <div class="col-md-4">

    <div class="card mb-4 box-shadow">
                <img
                  class="card-img-top"
                  data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
                  alt="Thumbnail [100%x225]"
                  style="height: auto; width: 100%; display: block;"
                  src=${imgs[i]}
                  data-holder-rendered="true"
                />
                <div class="card-body">
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="btn-group">
                      <a
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        href=${imgs[i]}
                        target = "_blank"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        data-link=${imgs[i]}
                        id="btn-download-one"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
    row.innerHTML += element;
  }
  imgArea.innerHTML = "";
  imgArea.appendChild(row);

  const btnDownloadOnes = document.querySelectorAll("#btn-download-one");

  btnDownloadOnes.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const url = event.target.getAttribute("data-link");
      forceDownload(url, "image.png");
    });
  });

  const downloadBtn = document.getElementById("btn-download");
  downloadBtn.setAttribute("style", "display : content");
  downloadBtn.addEventListener("click", () => {
    imgs.forEach((img, i) => {
      forceDownload(img, `anh${i + 1}.png`);
    });
  });
});

//function to send request download image
function forceDownload(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}
