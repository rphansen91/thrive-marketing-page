import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import throttle from 'lodash/throttle';
import { makeStyles, Theme, Typography, Container } from '@material-ui/core';
import { ContentfulContext } from '@pages/_app';
import Image, { ImageLoader } from 'next/image';
import Link from '@src/components/link/link';
import SectionHeadlines from '@src/components/section-headlines/section-headlines';
import CtfRichtext from '@ctf-components/ctf-richtext/ctf-richtext';
import LayoutContext, { defaultLayout } from '@src/layout-context';
import { getLocaleConfig } from '@src/locales-map';
import PersonalizationFrame from '@src/components/personalization-frame';
import { PersonalizedComponent } from '@ninetailed/experience.js-next';
import { WrapIf } from '@src/jsx-utils';
import { ProductTableFragment } from './__generated__/ProductTableFragment';
import queryString from 'query-string';

const contentfulLoader: ImageLoader = ({ src, width, quality }) => {
  const params: Record<string, string | number> = {};

  if (width !== undefined) {
    params.w = width;
  }

  if (quality !== undefined) {
    params.q = quality;
  }

  return queryString.stringifyUrl({ url: src, query: params });
};

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    backgroundColor: '#F7F7F7',
  },
  innerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '126rem',
    padding: theme.spacing(19, 0, 11),
  },
  sectionHeadlines: {
    marginBottom: theme.spacing(12),
  },
  comparisonTable: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    marginLeft: theme.spacing(-10),
    marginTop: theme.spacing(8),
    '@media (max-width: 1059px)': {
      '[data-columns-count="3"] & $comparisonTableColumn:nth-child(3) [data-equal-size]':
        {
          height: 'auto !important',
        },
      '[data-columns-count="3"] & [data-empty="true"]': {
        display: 'none',
      },
    },
    '@media (max-width: 819px)': {
      '[data-columns-count] & [data-equal-size]': {
        height: 'auto !important',
      },
      '[data-columns-count] & [data-empty="true"]': {
        display: 'none',
      },
      '[data-columns-count] & $comparisonTableColumn:not(:first-child)': {
        marginTop: theme.spacing(8),
      },
    },
  },
  comparisonTableColumn: {
    flexShrink: 0,
    marginBottom: theme.spacing(4),
    maxWidth: '100%',
    paddingLeft: theme.spacing(10),
    width: '40.5rem',
    [theme.breakpoints.up('md')]: {
      width: '35rem',
    },
    '@media (min-width: 1320px)': {
      width: '40.5rem',
    },
  },
  comparisonFeaturesBreak: {
    padding: theme.spacing(6, 0, 6),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(11, 0, 11),
    },
  },
  shortDescription: {
    marginTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
    '& p': {
      fontWeight: 500,
    },
  },
  featuredImage: {
    paddingBottom: theme.spacing(7),
  },
  feature: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(5),
    },
  },
  featureInner: {
    overflow: 'hidden',
  },
  signUp: {
    marginTop: theme.spacing(6),
  },
  pricingBottom: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(8),
    },
  },
  priceAddition: {
    fontSize: '2.1rem',
    fontWeight: 400,
  },
  priceUpper: {
    fontSize: '2.1rem',
    '& $priceAddition': {
      fontSize: '1.8rem',
    },
  },
}));

export interface CtfProductTablePropsInterface extends ProductTableFragment {}

const CtfProductTable: PersonalizedComponent<CtfProductTablePropsInterface> = (
  props,
) => {
  const {
    headline,
    subline,
    productsCollection,
    ninetailed,
    ntVariantsCollection,
  } = props;
  const { locale } = useContext(ContentfulContext);
  const { lang, locale: realLocale } = getLocaleConfig(locale);

  const classes = useStyles();
  const { xrayActive } = useContext(ContentfulContext);

  const isPersonalized =
    ntVariantsCollection?.items !== undefined &&
    ntVariantsCollection.items.length > 0;

  // Rendering product features
  const featureNames: string[] | null = useMemo(() => {
    if (productsCollection === null || productsCollection.items.length === 0) {
      return null;
    }

    const names: string[] = [];

    productsCollection.items.forEach((product) => {
      if (
        product === null ||
        (product.featuresCollection?.items.length || 0) === 0
      ) {
        return;
      }

      product.featuresCollection!.items.forEach((feature) => {
        if (feature === null || feature.name === null) {
          return;
        }

        if (names.includes(feature.name)) {
          return;
        }

        names.push(feature.name);
      });
    });

    return names;
  }, [productsCollection]);

  const featuresGrid: Record<string, Record<string, any>> | null =
    useMemo(() => {
      if (featureNames === null || productsCollection === null) {
        return null;
      }

      const grid = {};

      featureNames.forEach((featureName) => {
        grid[featureName] = {};

        productsCollection.items.forEach((product) => {
          if (
            product === null ||
            (product.featuresCollection?.items.length || 0) === 0
          ) {
            return;
          }

          const feature = product.featuresCollection!.items.find(
            (featureX) => featureX?.name === featureName,
          );

          if (feature === undefined || feature === null) {
            return;
          }

          grid[featureName][product.sys.id] =
            feature.shortDescription === null
              ? feature.longDescription
              : feature.shortDescription;
        });
      });

      return grid;
    }, [featureNames]);

  // Keeping the grid items the same size
  const gridElement = useRef<HTMLDivElement>(null);
  const gridColumnElements = useRef<(HTMLDivElement | null)[]>([]);
  const [gridSizes, setGridSizes] = useState<{ [key: string]: number }>({});
  const resizeGridItems = useCallback(
    throttle(() => {
      if (
        gridElement.current === null ||
        gridColumnElements.current.length === 0
      ) {
        return;
      }

      gridElement.current.setAttribute(
        'data-columns-count',
        `${gridColumnElements.current.length}`,
      );

      const children =
        gridElement.current.querySelectorAll('[data-equal-size]');

      if (children.length === 0) {
        return;
      }

      const heightMap: { [key: string]: number } = {};

      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];
        const childIndex = child.getAttribute('data-equal-size') || '0';
        const childHeight = child.scrollHeight;

        if (heightMap[`index-${childIndex}`] === undefined) {
          heightMap[`index-${childIndex}`] = childHeight;
        } else if (heightMap[`index-${childIndex}`] < childHeight) {
          heightMap[`index-${childIndex}`] = childHeight;
        }
      }

      setGridSizes(heightMap);
    }, 100),
    [gridElement.current],
  );

  useEffect(() => {
    if (gridElement.current === null) {
      return () => {
        window.removeEventListener('resize', resizeGridItems);
      };
    }

    window.addEventListener('resize', resizeGridItems);
    resizeGridItems();

    return () => {
      window.removeEventListener('resize', resizeGridItems);
    };
  }, [gridElement.current, resizeGridItems]);

  return (
    <WrapIf
      when={xrayActive === true && isPersonalized === true}
      wrap={(children) => (
        <PersonalizationFrame audienceId={ninetailed?.audience.id ?? null}>
          {children}
        </PersonalizationFrame>
      )}
    >
      <div ref={gridElement}>
        <Container maxWidth={false} className={classes.section}>
          <div className={classes.innerContainer}>
            <SectionHeadlines
              headline={headline}
              subline={subline}
              className={classes.sectionHeadlines}
            />
            {productsCollection !== null &&
              productsCollection.items.length > 0 && (
                <div className={classes.comparisonTable}>
                  {productsCollection.items.map(
                    (product, j) =>
                      product && (
                        <div
                          key={product.sys.id}
                          className={classes.comparisonTableColumn}
                          ref={(el) => {
                            gridColumnElements.current[j] = el;
                          }}
                        >
                          <div className={classes.featuredImage}>
                            <div
                              data-equal-size="0"
                              style={{
                                height:
                                  gridSizes[`index-0`] === undefined
                                    ? undefined
                                    : `${gridSizes[`index-0`]}px`,
                              }}
                            >
                              {product.featuredImage && (
                                <Image
                                  src={product.featuredImage.url as string}
                                  alt={
                                    product.featuredImage.description as string
                                  }
                                  width={product.featuredImage.width as number}
                                  height={
                                    product.featuredImage.height as number
                                  }
                                  quality={60}
                                  loader={contentfulLoader}
                                  sizes="(min-width: 355px) 355px, 98vw"
                                />
                              )}
                            </div>
                          </div>
                          <div
                            data-equal-size="1"
                            style={{
                              height:
                                gridSizes[`index-1`] === undefined
                                  ? undefined
                                  : `${gridSizes[`index-1`]}px`,
                            }}
                          >
                            <Typography variant="h2">{product.name}</Typography>
                          </div>
                          <div
                            data-equal-size="2"
                            style={{
                              height:
                                gridSizes['index-2'] === undefined
                                  ? undefined
                                  : `${gridSizes['index-2']}px`,
                            }}
                          >
                            {product.description && (
                              <LayoutContext.Provider
                                value={{
                                  ...defaultLayout,
                                  parent: 'product-description',
                                }}
                              >
                                <CtfRichtext
                                  {...product.description}
                                  className={classes.shortDescription}
                                />
                              </LayoutContext.Provider>
                            )}
                          </div>
                          <div
                            data-equal-size="3"
                            style={{
                              height:
                                featureNames === null ||
                                gridSizes['index-3'] === undefined
                                  ? undefined
                                  : `${gridSizes['index-3']}px`,
                            }}
                          >
                            {product.price === null || product.price === 0 ? (
                              <Typography
                                variant="h2"
                                component="h4"
                                className={classes.priceUpper}
                              >
                                {realLocale === 'de-DE' ? 'Kostenlos' : 'Free'}
                              </Typography>
                            ) : (
                              <Typography
                                variant="h2"
                                component="h4"
                                className={classes.priceUpper}
                              >
                                {realLocale === 'de-DE'
                                  ? `${product.price}€`
                                  : `$${product.price}`}
                                <span className={classes.priceAddition}>
                                  /{realLocale === 'de-DE' ? `Monat` : `month`}
                                </span>
                              </Typography>
                            )}
                          </div>
                          <div className={classes.signUp}>
                            <Link
                              href="/[lang]/sign-up"
                              as={`/${lang}/sign-up`}
                              isButton
                              color="primary"
                              variant="contained"
                            >
                              {realLocale === 'de-DE' ? 'Anmelden' : 'Sign Up'}
                            </Link>
                          </div>
                          {featureNames && featuresGrid && (
                            <LayoutContext.Provider
                              value={{
                                ...defaultLayout,
                                parent: 'product-table',
                              }}
                            >
                              <div
                                className={classes.comparisonFeaturesBreak}
                              />
                              {featureNames.map((featureName, i) => (
                                <div
                                  key={`${product.sys.id}-${featureName}`}
                                  className={classes.feature}
                                  data-empty={
                                    featuresGrid[featureName][
                                      product.sys.id
                                    ] === undefined
                                      ? 'true'
                                      : 'false'
                                  }
                                >
                                  <div
                                    data-equal-size={i + 4}
                                    className={classes.featureInner}
                                    style={{
                                      height:
                                        gridSizes[`index-${i + 4}`] ===
                                        undefined
                                          ? undefined
                                          : `${gridSizes[`index-${i + 4}`]}px`,
                                    }}
                                  >
                                    <CtfRichtext
                                      {...featuresGrid[featureName][
                                        product.sys.id
                                      ]}
                                    />
                                  </div>
                                </div>
                              ))}
                            </LayoutContext.Provider>
                          )}
                          <div
                            className={classes.pricingBottom}
                            data-equal-size={(featureNames || []).length + 4}
                            style={{
                              height:
                                featureNames === null ||
                                gridSizes[
                                  `index-${featureNames.length + 4}`
                                ] === undefined
                                  ? undefined
                                  : `${
                                      gridSizes[
                                        `index-${featureNames.length + 4}`
                                      ]
                                    }px`,
                            }}
                          >
                            {product.price === null || product.price === 0 ? (
                              <Typography variant="h2" component="h4">
                                {realLocale === 'de-DE' ? `Kostenlos` : `Free`}
                              </Typography>
                            ) : (
                              <Typography variant="h2" component="h4">
                                {realLocale === 'de-DE'
                                  ? `${product.price}€`
                                  : `$${product.price}`}
                                <span className={classes.priceAddition}>
                                  /{realLocale === 'de-DE' ? `Monat` : `month`}
                                </span>
                              </Typography>
                            )}
                          </div>
                          <div className={classes.signUp}>
                            <Link
                              href="/[lang]/sign-up"
                              as={`/${lang}/sign-up`}
                              isButton
                              color="primary"
                              variant="contained"
                            >
                              {realLocale === 'de-DE' ? 'Anmelden' : 'Sign Up'}
                            </Link>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              )}
          </div>
        </Container>
      </div>
    </WrapIf>
  );
};

export default CtfProductTable;