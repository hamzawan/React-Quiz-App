import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import questions from "../question.json";
import isEmpty from "../utils/is-empty";
import M from "materialize-css";
import correctNotification from "../assets/audio/correct-answer.wav";
import wrongNotification from "../assets/audio/wrong-answer.wav";
import buttonSound from "../assets/audio/button-clicked.wav";

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: "",
      numberOfQuestions: 0,
      numberOfAnsweredQuestion: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswer: 0,
      wrongAnswer: 0,
      hints: 5,
      previousRandomNumber: [],
      fiftyFifty: 0,
      usedFiftyFifty: 0,
      time: {}
    };

    this.interval = null;
  }

  componentDidMount() {
    this.starttimer();
    const {
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    } = this.state;
    this.displayQuestion(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
  }

  displayQuestion = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) => {
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestion - 1];

      const answer = currentQuestion.answer;
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberOfQuestions: questions.length,
          answer,
          previousRandomNumber: []
        },
        () => {
          this.showOptions();
        }
      );
    }
  };

  handliOptionClick = e => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      setTimeout(() => {
        document.getElementById("correct-sound").play();
      }, 50);
      this.correctAnswer();
    } else {
      setTimeout(() => {
        document.getElementById("wrong-sound").play();
      }, 500);
      this.wrongAnswer();
    }
  };

  handleNextButtonClicked = () => {
    this.playButtonSound();
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1
        }),
        () => {
          this.displayQuestion(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handlePreviousButtonClicked = () => {
    this.playButtonSound();
    if (this.state.previousQuestion !== undefined) {
      this.setState(
        prevState => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1
        }),
        () => {
          this.displayQuestion(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handleQuitButtonClicked = () => {
    this.playButtonSound();
    if (window.confirm("Are you sure you want to quit?")) {
      this.props.history.push("/");
    }
  };

  handleButtonClick = e => {
    switch (e.target.id) {
      case "next-button":
        this.handleNextButtonClicked();
        break;
      case "previous-button":
        this.handlePreviousButtonClicked();
        break;
      case "quit-button":
        this.handleQuitButtonClicked();
        break;
      default:
        break;
    }
  };

  playButtonSound = () => {
    document.getElementById("button-sound").play();
  };

  correctAnswer = () => {
    M.toast({
      html: "Correct Answer!",
      classes: "toast-valid",
      displayLength: 1500
    });

    this.setState(
      prevState => ({
        score: prevState.score + 1,
        correctAnswer: prevState.correctAnswer + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1
      }),
      () => {
        this.displayQuestion(
          this.questions,
          this.currentQuestion,
          this.nextQuestion,
          this.previousQuestion
        );
      }
    );
  };

  wrongAnswer = () => {
    navigator.vibrate(1000);
    M.toast({
      html: "Wrong Answer!",
      classes: "toast-invalid",
      displayLength: 1500
    });

    this.setState(
      prevState => ({
        score: prevState.score - 1,
        wrongAnswer: prevState.wrongAnswer + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1
      }),
      () => {
        this.displayQuestion(
          this.questions,
          this.currentQuestion,
          this.nextQuestion,
          this.previousQuestion
        );
      }
    );
  };

  showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));
    options.forEach(option => {
      option.style.visibility = "visible";
    });
  };

  handleHints = () => {
    if (this.state.hints > 0) {
      const options = Array.from(document.querySelectorAll(".option"));
      let indexOfAnswer;

      options.forEach((option, index) => {
        if (
          option.innerHTML.toLocaleLowerCase() ===
          this.state.answer.toLocaleLowerCase()
        ) {
          indexOfAnswer = index;
        }
      });
      while (true) {
        const randomNumber = Math.round(Math.random() * 3);
        if (
          randomNumber !== indexOfAnswer &&
          !this.state.previousRandomNumber.includes(randomNumber)
        ) {
          options.forEach((option, index) => {
            if (index === randomNumber) {
              option.style.visibility = "hidden";
              this.setState(prevState => ({
                hints: prevState.hints - 1,
                previousRandomNumber: prevState.previousRandomNumber.concat(
                  randomNumber
                )
              }));
            }
          });
          break;
        }
        if (this.state.previousRandomNumber.length >= 3) break;
      }
    }
  };

  starttimer = () => {
    const countDownTime = Date.now() + 30000;
    this.interval = setInterval(() => {
      const now = Date();
      const distance = countDownTime - now;

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0
            }
          },
          () => {
            alert("Quiz has ended!");
            this.props.history.push("/");
          }
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds
          }
        });
      }
    }, 1000);
  };

  render() {
    const { currentQuestion, hints, time } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Quiz Page</title>
        </Helmet>

        <Fragment>
          <audio id="correct-sound" src={correctNotification}></audio>
          <audio id="wrong-sound" src={wrongNotification}></audio>
          <audio id="button-sound" src={buttonSound}></audio>
        </Fragment>
        <div className="questions">
          <h2>Quiz Mode</h2>
          <div className="lifeline-container">
            <p>
              {/* <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>
              <span className="lifeline">2</span> */}
            </p>
            <p>
              <span
                onClick={this.handleHints}
                className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"
              ></span>
              <span className="lifeline">{hints}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="left" style={{ float: "left" }}>
                {this.state.currentQuestionIndex + 1} of{" "}
                {this.state.numberOfQuestions}
              </span>
              <span className="right">
                {time.minutes}:{time.seconds}
                <span className="mdi mdi-clock-outline mdi-24px"></span>
              </span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          <div className="option-container">
            <p onClick={this.handliOptionClick} className="option">
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handliOptionClick} className="option">
              {currentQuestion.optionB}
            </p>
          </div>
          <div className="option-container">
            <p onClick={this.handliOptionClick} className="option">
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handliOptionClick} className="option">
              {currentQuestion.optionD}
            </p>
          </div>
          <div className="button-container">
            <button id="previous-button" onClick={this.handleButtonClick}>
              Previous
            </button>
            <button id="next-button" onClick={this.handleButtonClick}>
              Next
            </button>
            <button id="quit-button" onClick={this.handleButtonClick}>
              Quit
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Play;
