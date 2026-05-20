/* 
   ==========================================================================
   ✨ LUXURY WEDDING INVITATION - LOVE STORY QUIZ ENGINE (quiz.js) ✨
   Interactive Trivia Game For Guests about the Bride & Groom
   ========================================================================== 
*/

const QUIZ_QUESTIONS = [
    {
        question: "Жаш жубайлар алгачкы жолу кайсы жерде жолугушкан?",
        options: ["Бишкек паркында", "Ысык-Көлдүн жээгинде", "Кофеканада", "Университетте"],
        answerIndex: 1 // Ысык-Көлдүн жээгинде
    },
    {
        question: "Алихан Айымга сүйүү сунушун кылууда кайсы гүлдү тартуулаган?",
        options: ["Кызыл Роза", "Ак Жоогазын", "Назик Пиондор", "Ромашка"],
        answerIndex: 2 // Назик Пиондор
    },
    {
        question: "Күйөө бала Алихандын эң негизги романтикалык өнөрү же хоббиси кайсы?",
        options: ["Футбол ойноо", "Сүрөт тартуу", "Тоого саякаттоо", "Гитара чертүү"],
        answerIndex: 3 // Гитара чертүү
    },
    {
        question: "Жаш жубайлар бал айын кайсы жерде өткөрүүнү кыялданышат?",
        options: ["Мальдив аралдарында", "Түркияда", "Ысык-Көлдө", "Дубайда"],
        answerIndex: 0 // Мальдив аралдарында
    }
];

let quizCurrentIndex = 0;
let quizUserScore = 0;

document.addEventListener("DOMContentLoaded", () => {
    initQuizGame();
});

function initQuizGame() {
    quizCurrentIndex = 0;
    quizUserScore = 0;
    
    const quizWrapper = document.getElementById("quiz-question-wrapper");
    const resultWrapper = document.getElementById("quiz-result-wrapper");
    
    if (quizWrapper) quizWrapper.style.display = "block";
    if (resultWrapper) resultWrapper.style.display = "none";
    
    renderCurrentQuizQuestion();
}

function renderCurrentQuizQuestion() {
    const stepEl = document.getElementById("quiz-step");
    const contentEl = document.getElementById("quiz-question-content");
    const optionsBox = document.getElementById("quiz-options-box");
    
    if (!stepEl || !contentEl || !optionsBox) return;
    
    const activeData = QUIZ_QUESTIONS[quizCurrentIndex];
    
    stepEl.textContent = `Суроо: ${quizCurrentIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    contentEl.textContent = activeData.question;
    optionsBox.innerHTML = "";
    
    activeData.options.forEach((optText, index) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option-btn";
        btn.textContent = optText;
        btn.addEventListener("click", () => handleSelectedAnswer(index, btn));
        optionsBox.appendChild(btn);
    });
}

function handleSelectedAnswer(selectedIndex, clickedBtn) {
    const activeData = QUIZ_QUESTIONS[quizCurrentIndex];
    const optionsBox = document.getElementById("quiz-options-box");
    
    if (!optionsBox) return;
    
    // Play sound click feedback
    if (typeof playClickSoundEffect === "function") {
        playClickSoundEffect();
    }
    
    // Freeze other button selections
    const allButtons = optionsBox.querySelectorAll(".quiz-option-btn");
    allButtons.forEach((b) => b.style.pointerEvents = "none");
    
    const isCorrect = (selectedIndex === activeData.answerIndex);
    
    if (isCorrect) {
        clickedBtn.classList.add("correct");
        quizUserScore++;
    } else {
        clickedBtn.classList.add("incorrect");
        // Also highlight correct answer for educational purpose
        allButtons[activeData.answerIndex].classList.add("correct");
    }
    
    // Smooth delay before proceeding to the next step
    setTimeout(() => {
        quizCurrentIndex++;
        if (quizCurrentIndex < QUIZ_QUESTIONS.length) {
            renderCurrentQuizQuestion();
        } else {
            showFinalQuizResults();
        }
    }, 1800);
}

function showFinalQuizResults() {
    const quizWrapper = document.getElementById("quiz-question-wrapper");
    const resultWrapper = document.getElementById("quiz-result-wrapper");
    const scoreNum = document.getElementById("quiz-score-num");
    const evaluationText = document.getElementById("quiz-evaluation");
    
    if (quizWrapper) quizWrapper.style.display = "none";
    if (resultWrapper) resultWrapper.style.display = "block";
    
    if (scoreNum) {
        scoreNum.textContent = `${quizUserScore} / ${QUIZ_QUESTIONS.length}`;
    }
    
    if (evaluationText) {
        if (quizUserScore === QUIZ_QUESTIONS.length) {
            evaluationText.innerHTML = "Укмуш! 💖 Сиз биздин эң жакын адамыбызсыз! Биз жөнүндө баарын билет экенсиз!";
        } else if (quizUserScore >= 2) {
            evaluationText.innerHTML = "Азаматсыз! ✨ Биздин жашообуз тууралуу жакшы билет экенсиз. Тойдо дагы жакындан таанышабыз!";
        } else {
            evaluationText.innerHTML = "Жакшы аракет! 😉 Биздин тоюбузга келип, биз жөнүндө кызыктуу маалыматтарды көбүрөөк билип кетиңиз!";
        }
    }
}

window.restartQuiz = function() {
    if (typeof playClickSoundEffect === "function") {
        playClickSoundEffect();
    }
    initQuizGame();
};
