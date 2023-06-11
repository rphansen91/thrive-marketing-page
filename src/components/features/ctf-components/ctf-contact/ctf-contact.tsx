import { Theme, Container, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'next-i18next';

import { useLayoutContext } from '@src/layout-context';
import { useRouter } from 'next/router';

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

    fetch('/submit', {
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
