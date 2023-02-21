var textArea = document.querySelector(".textarea");
var upperCase = document.getElementById("uppercase");
var copy = document.getElementById("copy");
var download = document.getElementById("download");
var commonIcon = document.querySelector(".common-icon");
var search = document.querySelector(".search .replace__input");
var searchBtn = document.querySelector(".search__btn");
var replace = document.querySelector(".replace .replace__input");
var replaceBtn = document.querySelector(".replace__btn");
var shortenLinkBtn = document.querySelector(".shorten-link__btn");
var longUrl = document.querySelector(".shorten-link__input");

var curElement = textArea;

// Đặt con trỏ chuột vào textarea khi load trang
document.addEventListener("DOMContentLoaded", () => {
  textArea.select();
});

// Lưu lại nội dung bài viết khi thoát
if (localStorage.getItem("text-history") !== "") {
  textArea.value = localStorage.getItem("text-history");
}
textArea.oninput = function () {
  localStorage.setItem("text-history", textArea.value);
};

// Chuyển tiêu đề thành chữ in hoa
upperCase.onclick = function () {
  var start = textArea.selectionStart;
  var finish = textArea.selectionEnd;
  if (start === finish) {
    var sel = textArea.value.substring(0, finish);
    var textBeforeSelection = "";
  } else {
    var sel = textArea.value.substring(start, finish);
    var textBeforeSelection = textArea.value.substring(0, start);
  }

  var upperCaseSelection = "[" + sel.toUpperCase() + "]";
  var textAfterSelection = textArea.value.substring(finish);

  textArea.value =
    textBeforeSelection + upperCaseSelection + textAfterSelection;
};

// Copy toàn bộ văn bản
copy.onclick = function () {
  textArea.select();
  navigator.clipboard.writeText(textArea.value);
};

// Download bài viết
download.onclick = function () {
  var text = textArea.value;
  text = text.replace(/\n/g, "\r\n");
  var blob = new Blob([text], { type: "text/plain" });
  var anchor = document.createElement("a");
  anchor.download = "baiviet.txt";
  anchor.href = window.URL.createObjectURL(blob);
  anchor.target = "_blank";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

// Lấy đối tượng chứa con trỏ chuột
textArea.onblur = function () {
  curElement = this;
};

search.onblur = function () {
  curElement = this;
};

replace.onblur = function () {
  curElement = this;
};

// Chèn icon vào textarea, input
commonIcon.onclick = function (event) {
  var icon = document.getElementById(event.target.id).value;

  var start = curElement.selectionStart;
  var finish = curElement.selectionEnd;

  var textBeforeSelection = curElement.value.substring(0, start);
  var textAfterSelection = curElement.value.substring(finish);
  curElement.value = textBeforeSelection + icon + textAfterSelection;
  curElement.selectionEnd = start + 1;
  curElement.focus();
};

// Rút gọn link
shortenLinkBtn.onclick = async function (error) {
  var url = longUrl.value;
  var token = "e56661cfa91564f8d267b18daa397498536d8a5d";

  try {
    var response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: url,
        domain: "bit.ly",
        group_guid: "",
      }),
    });
    var data = await response.json();
    longUrl.value = data.link;
    longUrl.select();
    navigator.clipboard.writeText(longUrl.value);
    var text = document.createTextNode("Đã sao chép");
    shortenLinkBtn.removeChild(shortenLinkBtn.firstChild);
    shortenLinkBtn.appendChild(text);
    curElement.focus();
  } catch (error) {
    console.log("Token hết hạn");
  }
};

// Khôi phục nút rút gọn
longUrl.onclick = function () {
  var text = document.createTextNode("Rút gọn");
  shortenLinkBtn.removeChild(shortenLinkBtn.firstChild);
  shortenLinkBtn.appendChild(text);
  longUrl.select();
};

longUrl.oninput = function () {
  var text = document.createTextNode("Rút gọn");
  shortenLinkBtn.removeChild(shortenLinkBtn.firstChild);
  shortenLinkBtn.appendChild(text);
};

// Tìm kiếm từ khóa
var currentFinish = 0;
searchBtn.onclick = function () {
  searchFunc();
};

function searchFunc() {
  var start = textArea.value.indexOf(search.value, currentFinish);
  var finish = start + search.value.length;
  if (start > -1) {
    textArea.selectionStart = start;
    textArea.selectionEnd = finish;
    currentFinish = finish;
  }
  textArea.focus();
}

// Reset biến lưu vị trí cũ của từ đã tìm kiếm
search.onclick = function () {
  currentFinish = 0;
  search.select();
};

search.oninput = function () {
  currentFinish = 0;
};

// Thay thế từ đã chọn
replaceBtn.onclick = function () {
  var start = textArea.selectionStart;
  var finish = textArea.selectionEnd;
  if (start !== finish && replace.value) {
    var textBeforeSelection = textArea.value.substring(0, start);
    var textAfterSelection = textArea.value.substring(finish);
    textArea.value = textBeforeSelection + replace.value + textAfterSelection;
    textArea.selectionEnd = start + replace.value.length;
  }
  textArea.focus();
  searchFunc();
  currentFinish += replace.value.length - search.value.length;
};

replace.onclick = function () {
  replace.select();
};
