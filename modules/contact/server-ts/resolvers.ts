import { UserInputError } from 'apollo-server-errors';
import { isEmpty } from 'lodash';

import { validate } from '@gqlapp/validation-common-react';
import { contactFormSchema } from '@gqlapp/contact-common';
import { log } from '@gqlapp/core-common';

interface ContactInput {
  input: {
    name: string;
    email: string;
    content: string;
    subject: string;
  };
}

export default () => ({
  Mutation: {
    async contact(obj: any, { input }: ContactInput, { mailer, req: { t } }: any) {
      const errors = validate(input, contactFormSchema);
      if (!isEmpty(errors)) {
        throw new UserInputError(t('contact:validateError'), { errors });
      }
      try {
        await mailer.sendMail({
          from: input.email,
          to: process.env.EMAIL_CONTACT_US || process.env.EMAIL_USER,
          subject: input.subject,
          html: `<p>${input.name} is sending the following message.</p><p>${input.content}</p>`
        });
      } catch (e) {
        log.error(e);
        throw new Error(t('contact:sendError'));
      }
    }
  }
});
