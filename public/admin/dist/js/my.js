// function initActions(itemType) {
//   document.getElementById("checkAll")?.addEventListener("change", function () {
//     const isChecked = this.checked;
//     document
//       .querySelectorAll(`input[data-item-type="${itemType}"]`)
//       .forEach((checkbox) => {
//         checkbox.checked = isChecked;
//       });
//   });

//   document.querySelectorAll(".deleteBtn").forEach((button) => {
//     button.addEventListener("click", function (event) {
//       event.preventDefault();
//       const itemId = this.getAttribute("data-id");

//       const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
//       confirmDeleteBtn.setAttribute("data-id", itemId);
//       confirmDeleteBtn.setAttribute("data-item-type", itemType);

//       $("#deleteModal").modal("show");
//     });
//   });

//   document
//     .getElementById("confirmDeleteBtn")
//     ?.addEventListener("click", function () {
//       const itemId = this.getAttribute("data-id");

//       if (itemId && itemType) {
//         window.location.href = `/admin/${itemType}/delete/${itemId}`;
//       }
//     });

//   document.querySelectorAll(".update-status-btn").forEach((button) => {
//     button.addEventListener("click", function (event) {
//       event.preventDefault();
//       const itemId = this.getAttribute("data-id");

//       handleFetch(`/admin/${itemType}/update-status/${itemId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((data) => {
//           const icon = this.querySelector("i");
//           icon.classList.toggle("fa-check", data.status === "active");
//           icon.classList.toggle("fa-times", data.status === "inactive");
//           showStatusMessage("success", `Status updated to ${data.status}`);
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           showStatusMessage("error", "Error updating status");
//         });
//     });
//   });

//   document.querySelectorAll(".flash-message").forEach((message) => {
//     message.style.display = "block";
//     setTimeout(() => {
//       message.style.display = "none";
//     }, 5000);
//   });
// }
$(document).ready(function () {
  const url = window.location.href;
  const arrUrl = url.split("/");
  const activeName = arrUrl[4] || "dashboard";
  $(`#${activeName}`).addClass('active');
  $(`#${activeName}`).parent().parent().parent().addClass('menu-open');
});
