import { Theme, Container, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useLayoutContext } from '@src/layout-context';

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

  return (
    <div className={classes.me}>
      <h2>Contact me.</h2>
      <p>
        <a href="tel:321-236-6012">321.236.6012</a>
      </p>
    </div>
  );
};

const ContactForm = () => {
  const classes = useStyles();
  return (
    <form name="contact" method="POST" data-netlify="true" className={classes.form}>
      <input type="hidden" name="form-name" value="Contact form" />
      <TextField name="name" label="Name" margin="normal" fullWidth />
      <TextField name="email" label="Email" margin="normal" fullWidth />
      <TextField name="message" label="Message" margin="normal" rows={3} multiline fullWidth />
      <Button type="submit">Send</Button>
    </form>
  );
};
