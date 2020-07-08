import { ApolloError } from "apollo-server-express";
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { Option } from "../entity/Option";
import { Question } from "../entity/Question";
import { Quiz } from "../entity/Quiz";

import { GradingInput } from "../Inputs/GradingInput";
import { QuizInput } from "../Inputs/QuizInput";
import { Results } from "../entity/Results";
import { isAuth } from "../Utilities/auth";

@Resolver()
export class QuizResolver {
  @Query(() => [Quiz])
  getQuizzes() {
    return Quiz.find();
  }

  @Query(() => Quiz)
  @UseMiddleware(isAuth)
  async getQuiz(@Arg("id", () => Int) id: number) {
    try {
      let quiz = await Quiz.findOne({ id });
      if (!quiz) {
        throw new ApolloError("Quiz not found");
      }
      return quiz;
    } catch (err) {
      console.log(err);
      throw new ApolloError("Quiz not found");
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createQuiz(@Arg("quiz") quiz: QuizInput): Promise<Boolean> {
    console.log(JSON.stringify(quiz));
    try {
      const newQuiz = new Quiz();
      newQuiz.theme = quiz.theme;
      newQuiz.userUsername = quiz.author;
      newQuiz.numberOfQuestions = quiz.numberOfQuestion;
      newQuiz.questions = quiz.questions.map((x) => {
        let question = new Question();
        question.content = x.content;
        question.relativeID = x.relativeId;
        question.numOfOptions = x.numOptions;
        question.type = x.type;
        question.points = x.points;
        question.answer = x.answer.map((x) => x + 1);
        question.options = x.options.map((x, index) => {
          let qoption = new Option();
          qoption.content = x.content;
          qoption.relativeid = index + 1;
          return qoption;
        });
        return question;
      });
      await Quiz.save(newQuiz);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async grading(
    @Arg("user") user: string,
    @Arg("answers") answers: GradingInput
  ) {
    const quiz = await Quiz.findOne({ where: { id: answers.quizid } });
    if (!quiz) {
      throw new ApolloError("This quiz does not exists ");
    }
    const score = answers.answers
      .map((answer) => {
        const question = quiz.questions.find(
          (x) => x.id === answer.questionid
        )!;
        const correctAnswer: number[] = question.answer;
        let pointsPerCorrectAnswer = question.points / correctAnswer.length;
        let cont = 0;
        correctAnswer.forEach((x) => {
          for (let i = 0; i < answer.selected.length; i++) {
            if (answer.selected[i] - x === 0) {
              cont++;
              break;
            }
          }
        });
        return cont * pointsPerCorrectAnswer;
      })
      .reduce((acc, score) => {
        return acc + score;
      }, 0);
    const result = new Results();
    result.quizId = quiz.id;
    result.userUsername = user;
    result.score = score;
    try {
      await Results.save(result);
      return true;
    } catch (e) {
      return false;
    }
  }
}
