import { Theme, Container, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'next-i18next';

import { useLayoutContext } from '@src/layout-context';
import { useRouter } from 'next/router';
import Script from 'next/script';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: theme.spacing(19),
    paddingTop: theme.spacing(3),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
  },
  me: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
}));

export const CtfContact = () => {
  const layout = useLayoutContext();
  const classes = useStyles();

  return (
    <Container maxWidth={false}>
      <div className={classes.root} style={{ maxWidth: layout.containerWidth }}>
        <ContactMe />
        <ContactForm />
      </div>
      <div className={classes.root} style={{ maxWidth: layout.containerWidth }}>
        <BookingWidget />
      </div>
    </Container>
  );
};

const ContactMe = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.me}>
      <h2>{t('socials.contactUs')}</h2>
      <p>
        <a href="tel:321-236-6012">321.236.6012</a>
      </p>
    </div>
  );
};

export const ContactForm = ({ hidden }: { hidden?: boolean }) => {
  const classes = useStyles();
  const router = useRouter();

  const handleSubmit = event => {
    event.preventDefault();

    const myForm = event.target;
    const formData = new FormData(myForm);
    // @ts-ignore
    const body = new URLSearchParams(formData).toString();

    fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
      .then(() => {
        console.log('Form successfully submitted');
        router.push('/thanks');
      })
      .catch(error => alert(error));
  };

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      action="/thanks"
      className={classes.form}
      onSubmit={handleSubmit}
      hidden={hidden}
    >
      <input type="hidden" name="form-name" value="contact" />
      <TextField name="name" label="Name" margin="normal" fullWidth />
      <TextField name="email" label="Email" margin="normal" fullWidth />
      <TextField name="message" label="Message" margin="normal" rows={3} multiline fullWidth />
      <Button type="submit">Send</Button>
    </form>
  );
};

const BookingWidget = () => {
  return (
    <div id="book-now" style={{ width: '100%' }}>
      <iframe
        frameBorder="none"
        title="Book Now"
        width="100%"
        height="400px"
        src="https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVIUuk+qnB4i3KVcNfOeAoBmp36hhhjkR8hFZZHmA5q4Ocyhav6NcoOwc5xJLBguKR/Zg9BcLj8gZQA6QIt0m4zrfwk2bcm+qQGcHFfUN/He3SahNdFrhKGNUmeFXy09R82rbauZ118YCyvjQy8MDmXTPeD0VNan2bwxJohoiSpga1HnNOZdGb37Gk8KppSzsdttwpdCyRfOBAEkN5gxphCJ0o1GZxvd/kr+Z25U1P67luYVn20k/3YmlDV44MYSEe7uwlA/ytOl9MgHxJ0oxZIMj/IsmmYORpjrzoT8ZrdjMQtwK72S2WRITV3/e2UIr5VVBPQJ3lRxztrP2b9P7Mq9E0s7TQxllaNh2nHWlFwOcdwoC0g1pVEKIf1GrJJR3FW/ZJb7ho9S6dmvhl6IviT4="
        style={{ minHeight: 700 }}
      />
    </div>
  );
};
