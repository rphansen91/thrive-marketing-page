import { ReactNode } from 'react';

import { PageLinkFieldsFragment } from '@src/components/features/page-link/__generated/page-link.generated';
import { Link, LinkProps } from '@src/components/shared/link';

export type PageLinkProps = Omit<LinkProps, 'children'> & {
  link?: string;
  page?: PageLinkFieldsFragment;
  render?: (pathname?: string) => ReactNode;
  children?: ReactNode;
};

export const PageLink = (props: PageLinkProps) => {
  const pathname = props.link
    ? props.link
    : props.page && props.page.slug
    ? `/${props.page.slug}`
    : ``;

  const linkProps = {
    href: pathname,
    className: props.className,
    onClick: props.onClick,
    withoutMaterial: props.withoutMaterial,
    underline: props.underline,
    isButton: props.isButton || false,
    variant: props.variant,
    size: props.size,
    color: props.color,
    endIcon: props.endIcon,
    urlParams: props.urlParams,
    target: props.link ? '_blank' : '',
  };

  return <Link {...linkProps}>{props.render ? props.render(pathname) : props.children}</Link>;
};
