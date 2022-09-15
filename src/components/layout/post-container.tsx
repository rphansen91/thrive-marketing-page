import { makeStyles, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { HEADER_HEIGHT_MD, HEADER_HEIGHT } from '@src/theme';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: HEADER_HEIGHT_MD,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      marginTop: HEADER_HEIGHT,
    },
  },
}));

type Props = {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
};

const PostContainer = (props: Props) => {
  const classes = useStyles();
  return (
    <div style={props.style} className={clsx(classes.root, props.className)}>
      {props.children}
    </div>
  );
};

export default PostContainer;