document.addEventListener("DOMContentLoaded", () => {
    const backgroundMode = document.getElementById("BackgroundMode");
    const body = document.body;

    // 저장된 모드 확인 및 적용
    if (localStorage.getItem("backgroundColor") === "Black") {
        backgroundMode.textContent = '라이트 모드로 변경';
        body.classList.add("background-Dark");
    }

    // 다크모드 토글 기능
    backgroundMode.addEventListener("click", () => {
        body.classList.toggle("background-Dark");

        // 현재 모드 저장
        if (body.classList.contains("background-Dark")) {
            localStorage.setItem("backgroundColor", "Black");
            backgroundMode.textContent = '라이트 모드로 변경';
        } else {
            localStorage.setItem("backgroundColor", "White");
            backgroundMode.textContent = '다크 모드로 변경';
        }
    });
});