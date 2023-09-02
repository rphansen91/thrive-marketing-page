import { Drawer } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { NavigationFieldsFragment } from '@src/components/features/ctf-components/ctf-navigation/__generated/ctf-navigation.generated';
import {
  getLinkDisplayText,
  getLinkHrefPrefix,
} from '@src/components/features/ctf-components/ctf-navigation/utils';
import { Link } from '@src/components/shared/link';

const useStyles = makeStyles(theme => ({
  menu: {
    listStyle: 'none',
    margin: 0,
    padding: theme.spacing(4, 8),
  },
  menuItem: {
    cursor: 'default',
    display: 'block',
    fontSize: '2.1rem',
    lineHeight: '1.8',
    position: 'relative',

    a: {
      cursor: 'pointer',
    },
  },
  submenu: {
    borderLeft: '1px solid #eee',
    listStyle: 'none',
    padding: theme.spacing(0, 0, 0, 2),
  },
}));

interface MobileMenuPropsInterface extends NavigationFieldsFragment {
  isOpen?: boolean;
  onOpenChange: (isOpen: boolean) => any;
}

export const CtfMobileMenu = (props: MobileMenuPropsInterface) => {
  const classes = useStyles();

  const { isOpen, onOpenChange } = props;

  const onCloseClick = (e, reason) => {
    if (reason === 'backdropClick') {
      onOpenChange(false);
    }
  };

  const mobileMenuContent = props.items[0];

  const renderMobileMenuLinks = menuGroup => {
    return menuGroup?.items?.map(menuItem => {
      const href = getLinkHrefPrefix(menuItem);
      const linkText = getLinkDisplayText(menuItem);
      return (
        <li key={menuItem.sys.id}>
          <Link href={href} className={classes.menuItem}>
            {linkText}
          </Link>
        </li>
      );
    });
  };

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      onClose={onCloseClick}
      role="dialog"
      id="mobile-menu"
      aria-modal={true}
    >
      {mobileMenuContent?.menuItemsCollection?.items.length && (
        <nav role="navigation">
          <ul className={classes.menu}>
            {mobileMenuContent.menuItemsCollection.items.map(
              menuItem =>
                menuItem && (
                  <li key={menuItem.sys.id} className={classes.menuItem}>
                    {!menuItem.link ? (
                      menuItem.groupName
                    ) : (
                      <Link href={`/${menuItem.link.slug}`}>{menuItem.groupName}</Link>
                    )}
                    {!menuItem.link && menuItem.children && (
                      <ul className={classes.submenu}>
                        {renderMobileMenuLinks(menuItem.children)}
                      </ul>
                    )}
                  </li>
                ),
            )}
            <li className={classes.menuItem}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVIUuk+qnB4i3KVcNfOeAoBmp36hhhjkR8hFZZHmA5q4Ocyhav6NcoOwc5xJLBguKR/Zg9BcLj8gZQA6QIt0m4zrfwk2bcm+qQGcHFfUN/He3SahNdFrhKGNUmeFXy09R82rbauZ118YCyvjQy8MDmXTPeD0VNan2bwxJohoiSpga1HnNOZdGb37Gk8KppSzsdttwpdCyRfOBAEkN5gxphCJ0o1GZxvd/kr+Z25U1P67luYVn20k/3YmlDV44MYSEe7uwlA/ytOl9MgHxJ0oxZIMj/IsmmYORpjrzoT8ZrdjMQtwK72S2WRITV3/e2UIr5VVBPQJ3lRxztrP2b9P7Mq9E0s7TQxllaNh2nHWlFwOcdwoC0g1pVEKIf1GrJJR3FW/ZJb7ho9S6dmvhl6IviT4="
              >
                Book Now
              </a>
            </li>
          </ul>
        </nav>
      )}
    </Drawer>
  );
};
