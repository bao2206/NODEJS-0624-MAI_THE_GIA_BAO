function initializeCKEditor(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    CKEDITOR.replace(element);
  });
}


const css = `
    /* CSS cho phần tử hiển thị giá trị */
    .range-value {
        position: absolute;
        // top: 10px;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 5px;
        border-radius: 3px;
        font-size: 14px;
        visibility: hidden; /* Mặc định ẩn giá trị */
    }
    
    /* Hiển thị giá trị khi hover vào thanh trượt */
    input[type="range"]:hover + .range-value {
        visibility: visible;
    }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;

// Thêm thẻ <style> vào phần <head> của tài liệu
document.head.appendChild(styleSheet);

// document.getElementById("vol").addEventListener("input", function() {
//   const volValue = document.getElementById("vol-value"); // Phần tử chứa giá trị của thanh trượt
//   volValue.textContent = this.value;  // Cập nhật giá trị khi thanh trượt thay đổi

//   // Cập nhật vị trí phần tử giá trị dựa trên vị trí thanh trượt
//   const range = this.getBoundingClientRect(); // Lấy vị trí của thanh trượt
//   const thumbWidth = 20; // Chiều rộng của thanh trượt (điều chỉnh nếu cần)
//   const valuePosition = (this.value / this.max) * range.width; // Tính toán vị trí

//   volValue.style.left = (range.left + valuePosition - thumbWidth / 2) + "px"; // Di chuyển phần tử giá trị
//   volValue.style.top = range.top - 100 + "px"; // Điều chỉnh giá trị này để phần tử giá trị nằm ngay trên thanh trượt
//   volValue.style.visibility = 'visible';
 
// });