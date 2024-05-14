settingsBtn = document.querySelector("#settings-btn");
modal = document.querySelector("#myModal");
settingsBtn.onclick = function () {
  modal.style.display = "block";
};

window.click = function (event) {
  if (event.target == modal) {
    modal.style.disploay;
  }
};