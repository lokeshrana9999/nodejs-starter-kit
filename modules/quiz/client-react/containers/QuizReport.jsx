import React from 'react';
// import { Mutation, FetchResult, MutationFn } from 'react-apollo';
import { FormError } from '@gqlapp/forms-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
// import PersonalQuizResultView from '../components/PersonalQuizResultView';
import { graphql } from 'react-apollo';
import { compose } from '@gqlapp/core-common';
import { message, Modal, Button, Spin as Loader } from 'antd';

// import CONTACT from '../graphql/Quiz.graphql';
// import { QuizForm } from '../types';
// import ADD_ANSWER from '../graphql/AddAnswers.graphql';
import ANSWERS_QUERY from '../graphql/AnswersQuery.graphql';
// import CURRENT_USER_QUERY from '@gqlapp/user-client-react/graphql/CurrentUserQuery.graphql';
import QuizReportContainer from './QuizReportContainer';

class QuizReport extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          View Answers
        </Button>
        <Modal
          title="Individual Result"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <QuizReportContainer {...this.props} />
        </Modal>
      </div>
    );
  }
}
  
export default QuizReport;
