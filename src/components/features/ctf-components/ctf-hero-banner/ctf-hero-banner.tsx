import { useContentfulInspectorMode } from '@contentful/live-preview/react';
import { Container, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { useMemo } from 'react';

import { HeroBannerFieldsFragment } from './__generated/ctf-hero-banner.generated';

import { CtfRichtext } from '@src/components/features/ctf-components/ctf-richtext/ctf-richtext';
import { PageLink } from '@src/components/features/page-link';
import LayoutContext, { defaultLayout, useLayoutContext } from '@src/layout-context';
import { getColorConfigFromPalette, HEADER_HEIGHT_MD, HEADER_HEIGHT } from '@src/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },

  fullScreen: {
    minHeight: `calc(100vh - ${HEADER_HEIGHT_MD})`,
    [theme.breakpoints.up('md')]: {
      minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
    },
    '@media (min-height: 91.2em)': {
      minHeight: '91.2rem',
    },
  },

  innerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '125.8rem',
    padding: theme.spacing(33, 0, 33),
    position: 'relative',
    width: '100%',
    '@media (min-height: 91.2em)': {
      padding: theme.spacing(39, 0, 39),
    },
  },

  partialBgContainer: {
    display: 'none',
    height: '100%',
    left: '50%',
    maxWidth: '192rem',
    position: 'absolute',
    top: 0,
    transform: 'translateX(-50%)',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },

  partialBg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
  },

  headline: {
    fontSize: '2.4rem',
    fontWeight: 800,
    lineHeight: 1.08,
    display: 'inline-block',
    backgroundColor: '#ab1220',
    whiteSpace: 'nowrap',
    padding: '1rem 2rem',
    borderRadius: '3rem',
    [theme.breakpoints.up('xl')]: {
      fontSize: '3.8rem',
    },
  },

  body: {
    fontWeight: 400,
    lineHeight: 1.56,
    marginTop: theme.spacing(6),
    maxWidth: '46.9rem',
    '& p': {
      fontSize: '2.5rem',
      color: '#ffffff',
      [theme.breakpoints.up('xl')]: {
        fontSize: '2.5rem',
      },
    },
  },
  ctaContainer: {
    marginTop: theme.spacing(6),
  },
  circusButton: {
    fontFamily: "'The Circus Font', sans-serif",
    '--mask': 'radial-gradient(20px at 20px 20px,#0000 98%,#000) -20px -20px',
    '-webkit-mask': 'var(--mask)',
    backgroundColor: '#000000!important',
    mask: 'var(--mask)',
    padding: '1rem 4rem',

    color: '#ffffff!important',

    fontSize: '2.5rem',
    letterSpacing: '0.05rem',
    [theme.breakpoints.up('xl')]: {
      letterSpacing: '0.5rem',
      fontSize: '3rem',
    },

    '&:hover': {
      backgroundColor: '#000000!important',
    },
  },
}));

export const CtfHeroBanner = (props: HeroBannerFieldsFragment) => {
  const {
    image,
    imageStyle: imageStyleBoolean,
    headline,
    // Tutorial: uncomment the line below to make the Greeting field available to render
    // greeting,
    bodyText,
    ctaText,
    targetPage,
    colorPalette,
    sys: { id },
    heroSize: heroSizeBoolean,
  } = props;
  const layout = useLayoutContext();

  const colorConfig = getColorConfigFromPalette(colorPalette || '');
  const imageStyle = imageStyleBoolean ? 'partial' : 'full';
  const heroSize =
    heroSizeBoolean === null || heroSizeBoolean === true ? 'full_screen' : 'fixed_height';
  const backgroundImage = useMemo(
    () =>
      image
        ? `${image.url}?w=${imageStyle === 'partial' ? 767 * 2 : layout.containerWidth * 2}`
        : undefined,
    [image, imageStyle, layout.containerWidth],
  );
  const classes = useStyles();
  const inspectorMode = useContentfulInspectorMode({ entryId: id });

  return (
    <Container
      maxWidth={false}
      className={clsx(classes.root, heroSize === 'full_screen' ? classes.fullScreen : null)}
      {...inspectorMode({ fieldId: 'image' })}
      style={{
        backgroundImage:
          imageStyle === 'full' && backgroundImage ? `url(${backgroundImage!})` : undefined,
        backgroundColor: colorConfig.backgroundColor,
      }}
    >
      {imageStyle === 'partial' && backgroundImage && (
        <div className={classes.partialBgContainer}>
          <div
            className={classes.partialBg}
            style={{
              backgroundImage: `url(${backgroundImage!})`,
            }}
          />
        </div>
      )}
      <div className={classes.innerContainer}>
        {/* Tutorial: uncomment this block to render the Greeting field value
        {greeting && (
          <Typography>
            {greeting}
          </Typography>
        )}
        */}
        {headline && (
          <Typography
            variant="h1"
            className={classes.headline}
            style={{ color: colorConfig.headlineColor }}
            {...inspectorMode({ fieldId: 'headline' })}
          >
            {headline}
          </Typography>
        )}
        {targetPage && ctaText && (
          <div className={classes.ctaContainer}>
            <PageLink
              // page={targetPage}
              link="https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVIUuk+qnB4i3KVcNfOeAoBmp36hhhjkR8hFZZHmA5q4Ocyhav6NcoOwc5xJLBguKR/Zg9BcLj8gZQA6QIt0m4zrfwk2bcm+qQGcHFfUN/He3SahNdFrhKGNUmeFXy09R82rbauZ118YCyvjQy8MDmXTPeD0VNan2bwxJohoiSpga1HnNOZdGb37Gk8KppSzsdttwpdCyRfOBAEkN5gxphCJ0o1GZxvd/kr+Z25U1P67luYVn20k/3YmlDV44MYSEe7uwlA/ytOl9MgHxJ0oxZIMj/IsmmYORpjrzoT8ZrdjMQtwK72S2WRITV3/e2UIr5VVBPQJ3lRxztrP2b9P7Mq9E0s7TQxllaNh2nHWlFwOcdwoC0g1pVEKIf1GrJJR3FW/ZJb7ho9S6dmvhl6IviT4="
              variant="contained"
              color={colorConfig.buttonColor}
              className={classes.circusButton}
              isButton
            >
              {ctaText}
            </PageLink>
          </div>
        )}
        {bodyText && (
          <LayoutContext.Provider value={{ ...defaultLayout, parent: 'hero-banner-body' }}>
            <div
              style={{ color: colorConfig.textColor }}
              {...inspectorMode({ fieldId: 'bodyText' })}
            >
              <CtfRichtext {...bodyText} className={classes.body} />
            </div>
          </LayoutContext.Provider>
        )}
      </div>
    </Container>
  );
};
