import withAuth from "graphql-auth";
import { PubSub, withFilter } from "graphql-subscriptions";
import QuizStates from "@gqlapp/quiz-common/constants/QuizState";

const QUIZZES_SUBSCRIPTION = "quizzes_subscription";
const QUIZ_SUBSCRIPTION = "quiz_subscription";

export default (pubsub: any) => ({
  Query: {
    // async quiz(obj, {id}, {Quiz}) {
    //   const quiz = await Quiz.getQuiz(id);
    //   // console.log('user profile', userProfile);

    //   if (quiz) {
    //     return null;
    //   }

    //   return quiz;
    // },
    async quizzes(obj: any, { filter }: any, context: any) {
      return context.Quiz.getQuizzes(filter);
    },

    async quiz(obj: any, { id }: any, context: any) {
      return context.Quiz.getQuiz(id);
    },
    async addQuizQuery(obj: any, { userId }: any, context: any) {
      try {
        var quiz = await context.Quiz.getCurrentQuiz(userId);
        console.log("current quiz exists", quiz);
        if (!quiz) {
          const quizData = {
            userId,
            state: QuizStates.CURRENT,
          };
          quiz = await context.Quiz.addCurrentQuiz(quizData);
          console.log("current quiz added", quiz);
        }
        return quiz;
      } catch (e) {
        return e;
      }
    },
    async quizWithAnswers(obj: any, { id, userId }: any, context: any) {
      const quiz = await context.Quiz.getQuizWithAnswersByUser(id, userId);
      console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqq", quiz);
      return quiz;
    },
    // async answer(obj: any, { input }: any, context: any) {
    //   return context.Quiz.getAnswerByParams(input);
    // },
    // async answers(obj: any, { userId, quizId }: any, context: any) {
    //   const quiz = await context.Quiz.getQuiz(quizId);
    //   let questionIdArray = [];
    //   quiz && quiz.questions.map((question, key) => {
    //     questionIdArray.push(question.id);
    //   });
    //   console.log("ggggg", questionIdArray);
    //   let resultsArray = [];
    //   const params = { userId: userId, questionIdArray: questionIdArray };
    //   const result = await context.Quiz.getAnswersByParams(params);
    //   console.log("ggggggggggggg", result);

    //   return {
    //     answers: result,
    //   };
    // },
    async getAttendees(obj: any, { id }: any, context: any) {
      const quiz = await context.Quiz.getQuiz(id);
      let questionIdArray = [];
      quiz &&
        quiz.sections &&
        quiz.sections.map((sect) => {
          sect &&
            sect.questions &&
            sect.questions.map((question, key) => {
              questionIdArray.push(question.id);
            });
        });
      console.log("ggggg", questionIdArray);

      const params = { questionIdArray: questionIdArray };
      const result = await context.Quiz.getAnswersByQuestionArray(params);
      console.log("ggggggggggggg", result);
      let userIdArray = [];
      result.map((item, key) => {
        const found = userIdArray.find((id) => id === item.userId);
        console.log("found", found);
        if (!found || (found && found.length === 0)) {
          userIdArray.push(item.userId);
        }
      });
      console.log("userIddd", userIdArray);
      const users = await context.User.getUsersWithIdArray(userIdArray);
      console.log("usersss", users);
      return {
        users: users,
      };
    },
    async getUserWiseResult(obj: any, { id, groupId }: any, context: any) {
      const quiz = await context.Quiz.getQuizWithAnswers(id, groupId);

      // let questionIdArray = [];
      // quiz.questions.map((question, key) => {
      //   questionIdArray.push(question.id);
      // });
      // console.log("ggggg", questionIdArray);

      // const params = { questionIdArray: questionIdArray };
      var result = [];
      let userIdArray = [];
      quiz &&
        quiz.sections &&
        quiz.sections.map((section) => {
          section &&
            section.questions &&
            section.questions.map((ques) => {
              ques &&
                ques.answers &&
                ques.answers.map((ans) => {
                  result.push(ans);
                });
            });
        });
      console.log("ggggggggggggg", result);
      result.map((item, key) => {
        const found = userIdArray.find((id) => id === item.userId);
        console.log("found", found);
        if (!found || (found && found.length === 0)) {
          userIdArray.push(item.userId);
        }
      });
      console.log("userIddd", userIdArray);
      const users = await context.User.getUsersWithIdArray(userIdArray);
      console.log("usersss", users);
      let quizOut = {
        id: quiz.id,
        userId: quiz.userId,
        sections: quiz.sections,
        attendees: { users: users },
      };
      // quizOut.questions &&
      //   quizOut.questions.length !== 0 &&
      //   quizOut.questions.map((question, key1) => {
      //     question.results= [];
      //     result.map((re, key) => {
      //       if (re.questionId === question.id) {
      //         question.results.push(re);
      //       }
      //       quiz.questions[key1].question = question;
      //       console.log('result pushed', quiz.questions[key1].results);
      //     });
      //   });
      console.log("quizOut", quizOut);
      return quizOut;
    },
    async getQuizCount(obj: any, { id }: any, context: any) {
      try {
        let quiz = await context.Quiz.getQuizWithChoiceAnswers(id);
        console.log(quiz);
        quiz &&
          quiz.sections &&
          quiz.sections.map((sec, secI) => {
            sec &&
              sec.questions &&
              sec.questions.map((qu, quI) => {
                qu &&
                  qu.choices &&
                  qu.choices.map((cho, choI) => {
                    // cho &&
                    //   cho.answers &&
                    //   cho.answers.map((answerItem, anInt) => {
                    //     var ansCount = false;
                    //     const repeatAns = cho.answers.filter(
                    //       (anI) =>
                    //         anI.choiceId === answerItem.choiceId &&
                    //         anI.questionId === answerItem.questionId &&
                    //         anI.userId === answerItem.userId
                    //     );
                    //     repeatAns.map((repeA, repI) => {
                    //       if (repI !== 0) {
                    //         cho.answers.pop(repeA);
                    //       }
                    //     });
                    //   });
                    quiz.sections[secI].questions[quI].choices[choI].count =
                      cho && cho.answers && cho.answers.length;
                    delete quiz.sections[secI].questions[quI].choices[choI]
                      .answers;
                  });
              });
          });
        return quiz;
      } catch (e) {
        return null;
      }
    },
  },
  Mutation: {
    async addQuiz(obj: any, { input }: any, { Quiz, User }: any) {
      console.log("input in res", input);
      const id = await Quiz.addQuiz(input);
      console.log("quiz added", id);
      var newQuiz = await Quiz.getQuiz(id);
      const getUser = await User.getUserForQuizSubscription(newQuiz.userId);
      newQuiz.user = getUser;
      console.log("neee", newQuiz);
      // const quiz = await Quiz.getQuiz(id);
      // console.log('user profile', userProfile);
      pubsub.publish(QUIZZES_SUBSCRIPTION, {
        quizzesUpdated: {
          mutation: "CREATED",
          node: newQuiz,
        },
      });
      if (id) {
        return newQuiz;
      } else {
        return null;
      }
    },

    async addSection(obj: any, { quizId }: any, { Quiz, User }: any) {
      try {
        console.log("input in res", quizId);
        const section = await Quiz.addSection(quizId);
        // if (section) {
        //   await Quiz.changeQuizState(quizId, QuizStates.UPDATED);
        // }
        // const id = await Quiz.addQuiz(input);
        // console.log("quiz added", id);
        // console.log("neee", newQuiz);
        // const quiz = await Quiz.getQuiz(id);
        // console.log('user profile', userProfile);
        var newQuiz = await Quiz.getQuiz(quizId);
        const getUser = await User.getUserForQuizSubscription(newQuiz.userId);
        newQuiz.user = getUser;
        pubsub.publish(QUIZ_SUBSCRIPTION, {
          quizUpdated: {
            mutation: "UPDATED",
            id: newQuiz && newQuiz.id,
            node: newQuiz,
          },
        });
        return section;
      } catch (e) {
        return null;
      }
    },

    async submitQuestion(obj: any, { input }: any, { Quiz, User }: any) {
      try {
        console.log("input in res", input);
        const questionSubmitted = await Quiz.submitQuestion(input);
        const sectionItem = await Quiz.getSection(
          questionSubmitted && questionSubmitted.sectionId
        );

        // if (section) {
        //   await Quiz.changeQuizState(quizId, QuizStates.UPDATED);
        // }
        // const id = await Quiz.addQuiz(input);
        // console.log("quiz added", id);
        // console.log("neee", newQuiz);
        // const quiz = await Quiz.getQuiz(id);
        // console.log('user profile', userProfile);
        var newQuiz = await Quiz.getQuiz(sectionItem && sectionItem.quizId);
        const getUser = await User.getUserForQuizSubscription(newQuiz.userId);
        newQuiz.user = getUser;
        pubsub.publish(QUIZ_SUBSCRIPTION, {
          quizUpdated: {
            mutation: "UPDATED",
            id: newQuiz && newQuiz.id,
            node: newQuiz,
          },
        });
        return questionSubmitted;
      } catch (e) {
        return e;
      }
    },

    deleteQuiz: withAuth(async (obj: any, { id }: any, { Quiz }: any) => {
      try {
        const data = await Quiz.getQuiz(id);
        await Quiz.deleteQuiz(id);
        pubsub.publish(QUIZZES_SUBSCRIPTION, {
          quizzesUpdated: {
            mutation: "DELETED",
            node: data,
          },
        });
        return data;
      } catch (e) {
        return e;
      }
    }),

    async deleteSection(obj: any, { id }: any, { Quiz, User }: any) {
      try {
        const data = await Quiz.getSection(id);
        await Quiz.deleteSection(id);
        var newQuiz;
        if (data) {
          newQuiz = await Quiz.getQuiz(data.quizId);
          const getUser = await User.getUserForQuizSubscription(
            newQuiz && newQuiz.userId
          );
          newQuiz.user = getUser;
        }
        pubsub.publish(QUIZ_SUBSCRIPTION, {
          quizUpdated: {
            mutation: "UPDATED",
            id: newQuiz && newQuiz.id,
            node: newQuiz,
          },
        });
        return data;
      } catch (e) {
        return e;
      }
    },

    async deleteQuestion(obj: any, { id }: any, { Quiz, User }: any) {
      try {
        const data = await Quiz.getQuestionItem(id);
        await Quiz.deleteQuestion(id);
        const sectionItem = await Quiz.getSection(data && data.sectionId);

        var newQuiz = await Quiz.getQuiz(sectionItem && sectionItem.quizId);
        const getUser = await User.getUserForQuizSubscription(
          newQuiz && newQuiz.userId
        );
        newQuiz.user = getUser;
        pubsub.publish(QUIZ_SUBSCRIPTION, {
          quizUpdated: {
            mutation: "UPDATED",
            id: newQuiz && newQuiz.id,
            node: newQuiz,
          },
        });
        return data;
      } catch (e) {
        return e;
      }
    },

    editQuiz: withAuth(async (obj: any, { input }: any, { Quiz }: any) => {
      try {
        const inputId = input.id;
        console.log("quiz edit resolvers1", input);

        // if (input.authorId) {
        //   input.authorId = await Profile.getProfileId(input.authorId);
        // }
        // delete input.id;
        // delete input.tags;
        const isDeleted = await Quiz.editQuiz(input);
        var item = await Quiz.getQuiz(inputId);
        // pubsub.publish(QUIZZES_SUBSCRIPTION, {
        //   quizzesUpdated: {
        //     mutation: 'UPDATED',
        //     node: item
        //   }
        // });
        // const getUser = await Quiz.getQuiz(item.userId)
        // item.user = getUser;
        pubsub.publish(QUIZZES_SUBSCRIPTION, {
          quizzesUpdated: {
            mutation: "UPDATED",
            node: item,
          },
        });
        return item;
      } catch (e) {
        return e;
      }
    }),
    async addAnswers(obj: any, { input }: any, { Quiz }: any) {
      console.log("iinnppuutt", input);
      try {
        var userId;
        var sectionId;
        // const editedResult = Quiz.addAnswers(input.results);
        // if(editedResult)
        // {
        //   sectionId = questionItem.sectionId;
        //   userId = input && input.results[0].userId;
        // }
        input.results.map(async (result, item) => {
          const ansExists = await Quiz.getAnswerByParams(result);
          console.log("ansexists", ansExists);
          var isDone;
          const questionItem = await Quiz.getQuestion(
            input.results && input.results[0].questionId
          );
          console.log("question existss", questionItem);
          if (ansExists && ansExists.length !== 0) {
            isDone = await Quiz.updateAnswer(result);
          } else {
            isDone = await Quiz.addAnswer(result);
          }
          sectionId = questionItem.sectionId;
          userId = result.userId;
        });
        const quizI = await Quiz.getQuizBySectionId(sectionId);
        const id = quizI && quizI.id;
        const item = await Quiz.getQuizWithAnswersByUser(id, userId);

        pubsub.publish(QUIZZES_SUBSCRIPTION, {
          quizzesUpdated: {
            mutation: "UPDATED",
            node: item,
          },
        });
        return true;
      } catch (e) {
        return e;
      }
    },
    // async addAnswer(obj: any, { input }: any, { Quiz }: any) {
    //   console.log("input in res", input);
    //   const ansExists = await Quiz.getAnswerByParams(input);
    //   console.log("ansexists", ansExists);
    //   var isDone;
    //   const questionItem = await Quiz.getQuestion(input.questionId);
    //   console.log("question existss", questionItem);
    //   var questionHasChoice = false;
    //   questionItem.map((item, key) => {
    //     if (item.id === input.choiceId) {
    //       questionHasChoice = true;
    //     }
    //   });
    //   if (!questionHasChoice) {
    //     return null;
    //   }
    //   if (ansExists && ansExists.length !== 0) {
    //     isDone = await Quiz.updateAnswer(input);
    //   } else {
    //     isDone = await Quiz.addAnswer(input);
    //   }
    //   console.log("ansexists123", isDone);

    //   const newAnswer = await Quiz.getAnswerByParams(input);
    //   console.log("ansexists123444", newAnswer);

    //   // const isAdded = Quiz.addQuiz(input);
    //   // console.log('quiz added', isAdded);

    //   // const quiz = await Quiz.getQuiz(id);
    //   // console.log('user profile', userProfile);

    //   if (isDone) {
    //     return newAnswer[0];
    //   } else {
    //     return null;
    //   }
    // },
    duplicateQuiz: withAuth(
      async (
        obj: any,
        input: { userId: number; quizId: number },
        context: any
      ) => {
        try {
          const res = await context.Quiz.duplicateQuiz(
            input.userId,
            input.quizId
          );
          const getQuiz = await context.Quiz.getQuiz(res.id);
          console.log("ressssss", getQuiz);
          // const getUser = await context.User.getUserForQuizSubscription(res.userId)
          // res.user = getUser;
          console.log("copiiiied", getQuiz);
          pubsub.publish(QUIZZES_SUBSCRIPTION, {
            quizzesUpdated: {
              mutation: "CREATED",
              node: getQuiz,
            },
          });
          return res;
        } catch (e) {
          return e;
        }
      }
    ),
  },
  Subscription: {
    quizzesUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(QUIZZES_SUBSCRIPTION),
        (payload, variables) => {
          const { mutation, node } = payload.quizzesUpdated;
          console.log("subsss", node && node.sections, node);
          const {
            // filter: { searchText }
          } = variables;
          // const checkByFilter =
          // (!model || model === node.model.name) &&
          // (!status || status === node.status) &&
          // (!searchText ||
          //   node.title.toUpperCase().includes(searchText.toUpperCase()))
          //   node.description.toUpperCase().includes(searchText.toUpperCase()) ||
          //   node.tags.some((item: any) => item.text.toUpperCase().includes(searchText.toUpperCase())));

          switch (mutation) {
            case "DELETED":
              return true;
            case "CREATED":
              return true;
            case "UPDATED":
              return true;
          }
        }
      ),
    },
    quizUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(QUIZ_SUBSCRIPTION),
        (payload, variables) => {
          console.log("quizUpdatedddd variables", variables);
          console.log("quizUpdatedddd", payload);
          return (
            payload &&
            payload.quizUpdated &&
            payload.quizUpdated.id === variables.id
          );
        }
      ),
    },
  },
});
