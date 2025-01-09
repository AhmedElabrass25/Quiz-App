// https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple
const form = document.querySelector(".quizSec form");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const questionNumber = document.getElementById("questionNumber");
const questionContainer = document.querySelector(".quizSec .questionContainer");
const loading = document.querySelector(".loading");
let showScorePage = document.querySelector(".showScore");
let errorMessage = document.getElementById("errorMessage");
let questions;
let myQuiz;
window.addEventListener("load", () => {
  setTimeout(() => {
    loading.classList.add("d-none");
  }, 3000);
});
form.addEventListener("submit", async (e) => {
  loading.classList.remove("d-none");
  e.preventDefault();
  const qNum = questionNumber.value;
  const categoryVal = category.value;
  const difficultyVal = difficulty.value;
  if (categoryVal != null && difficultyVal != null && qNum.trim() !== "") {
    myQuiz = new Quiz(categoryVal, difficultyVal, qNum, 0);
    questions = await myQuiz.getData();
    console.log(questions);
    form.classList.add("d-none");
    questionContainer.classList.remove("d-none");
    let myQuestion = new Question(0);
    console.log(myQuestion);
    myQuestion.displayQuestion();
    myQuestion.checkAnswer();
  } else {
    errorMessage.classList.remove("d-none");
  }
  loading.classList.add("d-none");

  questionNumber.value = null;
  category.value = null;
  difficulty.value = null;
});
class Quiz {
  constructor(category, difficulty, questionNumber) {
    this.category = category;
    this.difficulty = difficulty;
    this.questionNumber = questionNumber;
    this.score = 0;
  }
  getData = async () => {
    try {
      // Make the fetch request
      loading.classList.remove("d-none");
      let res = await fetch(
        `https://opentdb.com/api.php?amount=${this.questionNumber}&category=${this.category}&difficulty=${this.difficulty}&type=multiple`
      );
      console.log(res);
      // Check if the response was successful
      if (res.ok) {
        let data = await res.json();
        return data.results; // Return the results directly
      } else {
        errorMessage.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessage.classList.remove("d-none");
    }
    loading.classList.add("d-none");
  };

  showScoreFunc = () => {
    questionContainer.classList.add("d-none");
    let cartona = `
    <div class="col-md-4">
                <div class="w-100 dFlex flex-column bg-white px-5 py-4 rounded-2">
                    <h2>${
                      this.score == this.questionNumber
                        ? "<span style='color:rgb(67 55 37);letter-spacing:1.5px'>Congratulation 🎉</span>"
                        : `Your Score is ${this.score} / ${this.questionNumber}`
                    }</h2>
                    <button class="btn tryAgain mt-2">Try Again</button>
                </div>
            </div>
    
    `;
    showScorePage.innerHTML = cartona;
    document.querySelector(".tryAgain").addEventListener("click", (e) => {
      showScorePage.classList.add("d-none");
      form.classList.remove("d-none");
    });
  };
}
class Question {
  constructor(index) {
    this.index = index;
    this.question = questions[index].question;
    this.category = questions[index].category;
    this.difficulty = questions[index].difficulty;
    this.correct_answer = questions[index].correct_answer;
    this.incorrect_answers = questions[index].incorrect_answers;
    this.myAllAnswers = this.getAllAnswers();
    this.isAnswered = false;
  }
  getAllAnswers = () => {
    let allAnswers = [];
    allAnswers.push(...this.incorrect_answers, this.correct_answer);
    allAnswers.sort();
    return allAnswers;
  };
  displayQuestion = () => {
    let cartona = `
     <div class="col-md-6 col-12">
            <div class="question w-100 bg-white shadow p-3 rounded-2">
                <div class="head w-100 dFlex justify-content-between flex-wrap">
                    <span class="cat">${this.category}</span>
                    <span class="numQues">${this.index + 1} 
                    of ${questions.length} Questions</span>
                </div>
                <h3 class="theQ w-100 text-center my-4">
                    ${this.question}
                </h3>
                <div class="answers w-100 dFlex  text-left justify-content-between flex-wrap mb-3">
                ${this.myAllAnswers
                  .map((ques) => `<span>${ques}</span>`)
                  .toString()
                  .replaceAll(",", " ")}
                </div>
                <h2 class="score w-100 text-center">
                    Score : ${myQuiz.score}
                </h2>
            </div>
            </div>
    
    `;
    questionContainer.innerHTML = cartona;
    let answers = document.querySelectorAll(".answers span");
    answers.forEach((answer) => {
      answer.addEventListener("click", (e) => {
        this.checkAnswer(answer);
        this.nextQuestion();
      });
    });
  };
  checkAnswer = (select) => {
    if (this.isAnswered == false) {
      if (select !== undefined) {
        this.isAnswered = true;
        if (select.innerHTML == this.correct_answer) {
          myQuiz.score++;
          select.classList.add("bg-success", "text-white");
        } else {
          select.classList.add("bg-danger", "text-white");
        }
      }
    }
  };
  nextQuestion = () => {
    this.index++;
    setTimeout(() => {
      if (this.index < questions.length) {
        let newQuestion = new Question(this.index);
        console.log(newQuestion);
        newQuestion.displayQuestion();
      } else {
        showScorePage.classList.remove("d-none");
        myQuiz.showScoreFunc();
      }
    }, 2000);
  };
}
