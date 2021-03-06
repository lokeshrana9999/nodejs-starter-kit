import React from "react";
import { withFormik, FormikProps, FieldArray } from "formik";
import { isFormError } from "@gqlapp/forms-client-react";
// import { contactFormSchema } from '@gqlapp/contact-common';
// import { TranslateFunction } from '@gqlapp/i18n-client-react';
// import { validate } from '@gqlapp/validation-common-react';
import { FieldAdapter as Field } from "@gqlapp/forms-client-react";
import {
  Form,
  RenderField,
  Button,
  Alert,
  Icon,
  RenderCheckBox,
  Card,
  RenderUpload,
} from "@gqlapp/look-client-react";
import RenderSectionsField from "./RenderSectionsField";
import QuizAddFormGroupsComponent from "@gqlapp/group-client-react/containers/QuizAddFormGroupsComponent";
// import { QuizAddForm } from '../types';

// interface QuizAddFormProps {
//   t: TranslateFunction;
//   onSubmit: (values: QuizAddForm) => void;
// }

const QuizAddForm = ({
  values,
  handleSubmit,
  t,
  status,
  errors,
  addSection,
  deleteSection,
  deleteQuestion,
  submitQuestion,
  submitSection,
  currentUser,
}) => {
  const handleSections = (data) => (values.sections = data);
  const [load, setload] = React.useState(false);
  console.log("quizAddFormValues", values);
  return (
    <Form name="quizAdd" onSubmit={handleSubmit}>
      {/* {status && status.sent && <Alert color="success">{t('successMsg')}</Alert>} */}
      <Card
        style={{ marginBottom: "10px" }}
        title={<h2>Quiz</h2>}
        extra={
          <div className="text-center">
            {errors && errors.errorMsg && (
              <Alert color="error">{errors.errorMsg}</Alert>
            )}
            <Button block color="primary" type="submit">
              {/* <Icon type="mail" /> {t('form.btnSubmit')} */}
              Submit
            </Button>
          </div>
        }
      >
        <Field
          name="title"
          component={RenderField}
          type="text"
          label={"Title"}
          value={values.title}
        />
        <Field
          name="description"
          component={RenderField}
          type="text"
          label={"Description"}
          value={values.description}
        />
        <Field
          name="cover"
          component={RenderUpload}
          type="text"
          setload={setload}
          label={"Quiz Avatar"}
          value={values.cover}
        />
        <Field
          name="active"
          component={RenderCheckBox}
          type="checkbox"
          label={"Active"}
          checked={values.active}
        />{" "}
        {currentUser && currentUser.role === "admin" && (
          <Field
            name="isPublic"
            component={RenderCheckBox}
            type="checkbox"
            label={"Is Public"}
            checked={values.isPublic}
          />
        )}
        <Field
          name="isEditableByUser"
          component={RenderCheckBox}
          type="checkbox"
          label={"Is Editable By User"}
          checked={values.isEditableByUser}
        />
        {/* {!values.isPublic && (
          <Field
            name="quizGroups[0].groupId"
            component={QuizAddFormGroupsComponent}
            // type="checkbox"
            label={"Add Group"}
            value={values.quizGroups && values.quizGroups[0] && values.quizGroups[0].groupId}
          />
        )} */}
      </Card>
      <FieldArray
        name="sections"
        render={(arrayHelpers) => (
          <RenderSectionsField
            quizItem={values}
            arrayHelpers={arrayHelpers}
            values={values.sections}
            name="sections"
            quizId={values.id}
            addSection={addSection}
            deleteSection={deleteSection}
            submitQuestion={submitQuestion}
            deleteQuestion={deleteQuestion}
            submitSection={submitSection}
          />
        )}
        sectionsVal={values.sections}
        handleSections={handleSections}
      />
    </Form>
  );
};

const QuizAddFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    console.log("mapPropsToValuesQUiz", props);
    const urlParamGroupId = props.match && props.match.params && Number(props.match.params.groupId)
    function getChoices(choice) {
      return {
        id: (choice && choice.id) || null,
        description: (choice && choice.description) || "",
        // choices: question && question.choices && question.choices.map(getChoices) || []
      };
    }
    function getQuestions(question) {
      return {
        id: (question && question.id) || null,
        sectionId: (question && question.sectionId) || null,
        description: (question && question.description) || "",
        choiceType: (question && question.choiceType) || "",
        isActive: question && question.isActive,
        choices:
          (question && question.choices && question.choices.map(getChoices)) ||
          [],
        dependentQuestionId: (question && question.dependentQuestionId) || null,
        dependentChoiceId: (question && question.dependentChoiceId) || null,
      };
    }
    function getSections(section) {
      return {
        id: (section && section.id) || null,
        title: (section && section.title) || "",
        quizId: (section && section.quizId) || null,
        description: (section && section.description) || "",
        isActive: section && section.isActive,
        questions:
          (section &&
            section.questions &&
            section.questions.map(getQuestions)) ||
          [],
      };
    }
    return {
      id: (props.quiz && props.quiz.id) || null,
      title: (props.quiz && props.quiz.title) || "",
      description: (props.quiz && props.quiz.description) || "",
      active: props.quiz && props.quiz.active,
      isEditableByUser: props.quiz && props.quiz.isEditableByUser,
      isPublic: props.quiz && props.quiz.isPublic,
      cover: (props.quiz && props.quiz.cover) || "",
      // quizGroups: (props.quiz &&
      //   props.quiz.quizGroups &&
      //   props.quiz.quizGroups[0]) || [
      //   { groupId: urlParamGroupId, quizId: props.quiz.id },
      // ],
      sections:
        (props.quiz &&
          props.quiz.sections &&
          props.quiz.sections.map(getSections)) ||
        [],
    };
  },
  async handleSubmit(
    values,
    { resetForm, setErrors, setStatus, props: { onSubmit } }
  ) {
    values.sections = Object.values(
      values.sections
      //   .map((question, key)=>{
      //   question.choices = Object.values(question.choices);
      // })
    );
    // values.questions = (values.questions.map)
    try {
      await onSubmit(values);
      resetForm();
      setStatus({ sent: true });
    } catch (e) {
      if (isFormError(e)) {
        setErrors(e.errors);
      } else {
        throw e;
      }
      setStatus({ sent: false });
    }
  },
  // validate: values => validate(values, contactFormSchema),
  displayName: "QuizAddForm", // helps with React DevTools
});

export default QuizAddFormWithFormik(QuizAddForm);
