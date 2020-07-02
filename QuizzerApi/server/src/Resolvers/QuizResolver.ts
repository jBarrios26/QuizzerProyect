import { ApolloError } from 'apollo-server-express';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Option } from '../entity/Option';
import { Question } from '../entity/Question';
import { Quiz } from '../entity/Quiz';
import { Results } from '../entity/Results';
import { GradingInput } from '../Inputs/GradingInput';
import { QuizInput } from '../Inputs/QuizInput';

@Resolver()
export class QuizResolver {
  @Query(() => [Quiz])
  getQuizzes() {
    return Quiz.find();
  }

  @Query(() => Quiz)
  async getQuiz(@Arg("id") id: number) {
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
  async createQuiz(@Arg("quiz") quiz: QuizInput): Promise<Boolean> {
    try {
      const newQuiz = new Quiz();
      newQuiz.theme = quiz.theme;
      newQuiz.userUsername = quiz.author;
      newQuiz.numberOfQuestions = quiz.numberOfQuestion;
      newQuiz.questions = quiz.questions.map((x) => {
        let question = new Question();
        question.content = x.content;
        question.relativeID = x.relativeid;
        question.numOfOptions = x.numOptions;
        question.type = x.type;
        question.points = x.points;
        question.options = x.options.map((x, index) => {
          let qoption = new Option();
          qoption.content = x.content;
          qoption.relativeid = index + 1;
          return qoption;
        });
        return question;
      });
      Quiz.save(newQuiz);
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
    const quiz = await Quiz.findOne({ id: answers.quizid });
    if (!quiz) {
      throw new ApolloError("Quiz not found");
    }
    const score = quiz.questions.reduce((accumulator, question) => {
      const correctAnswers = question.options.filter((x) => x.relativeid);
      const selected = answers.answers.find(
        (x) => x.questionid === question.id
      )!.selected;
      let points = selected.reduce((accum, option) => {
        let partialPoints = correctAnswers.find((x) => option === x.id)
          ? question.points / correctAnswers.length
          : 0;
        return accum + partialPoints;
      }, 0);
      return accumulator + points;
    }, 0);
    try {
      let result = new Results();
      result.quizId = quiz.id;
      result.userUsername = user;
      result.score = score;
      await Results.save(result);
      return true;
    } catch (error) {
      console.log(error);
      throw new ApolloError("Error when grading");
      return false;
    }
  }
}
