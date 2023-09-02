import { Container, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { CtaFieldsFragment } from './__generated/ctf-cta.generated';

import { CtfRichtext } from '@src/components/features/ctf-components/ctf-richtext/ctf-richtext';
import { PageLink } from '@src/components/features/page-link';
import LayoutContext, { defaultLayout } from '@src/layout-context';
import { getColorConfigFromPalette } from '@src/theme';
import { optimizeLineBreak } from '@src/utils';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textAlign: 'center',
  },
  innerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '93.4rem',
    padding: theme.spacing(19, 0, 19),
  },
  headline: {
    fontWeight: 'bold',
  },
  subline: {
    fontWeight: 400,
    lineHeight: 1.52,
    marginTop: theme.spacing(8),
  },
  ctaContainer: {
    marginTop: theme.spacing(8),
  },
}));

export const CtfCta = (props: CtaFieldsFragment) => {
  const { headline, subline, targetPage, ctaText, colorPalette, urlParameters } = props;
  const colorConfig = getColorConfigFromPalette(colorPalette || '');
  const classes = useStyles();

  return (
    <Container
      maxWidth={false}
      className={classes.root}
      style={{
        backgroundColor: colorConfig.backgroundColor,
      }}
    >
      <div className={classes.innerContainer}>
        {headline && (
          <Typography
            variant="h1"
            component="h2"
            className={classes.headline}
            style={{ color: colorConfig.headlineColor }}
          >
            {optimizeLineBreak(headline)}
          </Typography>
        )}
        {subline && (
          <LayoutContext.Provider value={{ ...defaultLayout, parent: 'cta-subline' }}>
            <div style={{ color: colorConfig.textColor }}>
              <CtfRichtext {...subline} className={classes.subline} />
            </div>
          </LayoutContext.Provider>
        )}
        {targetPage && targetPage.slug && (
          <div className={classes.ctaContainer}>
            <PageLink
              // page={targetPage}
              link="https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVIUuk+qnB4i3KVcNfOeAoBmp36hhhjkR8hFZZHmA5q4Ocyhav6NcoOwc5xJLBguKR/Zg9BcLj8gZQA6QIt0m4zrfwk2bcm+qQGcHFfUN/He3SahNdFrhKGNUmeFXy09R82rbauZ118YCyvjQy8MDmXTPeD0VNan2bwxJohoiSpga1HnNOZdGb37Gk8KppSzsdttwpdCyRfOBAEkN5gxphCJ0o1GZxvd/kr+Z25U1P67luYVn20k/3YmlDV44MYSEe7uwlA/ytOl9MgHxJ0oxZIMj/IsmmYORpjrzoT8ZrdjMQtwK72S2WRITV3/e2UIr5VVBPQJ3lRxztrP2b9P7Mq9E0s7TQxllaNh2nHWlFwOcdwoC0g1pVEKIf1GrJJR3FW/ZJb7ho9S6dmvhl6IviT4="
              variant="contained"
              color={colorConfig.buttonColor}
              isButton
              urlParams={urlParameters ?? ''}
            >
              {ctaText}
            </PageLink>
          </div>
        )}
      </div>
    </Container>
  );
};
