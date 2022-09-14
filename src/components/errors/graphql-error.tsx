import { Box, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { tryget } from '@src/utils'
import React, { useMemo } from 'react'

// TODO add other errors than only `NetworkError`

const GraphqlError = (props: {error: any}) => {
  const { error } = props
  console.error({ error })
  const theme = useTheme<Theme>()

  const networkErrors = useMemo(() => tryget(() => error.networkError.result.errors), [error])

  return (
    <Box
      p={4}
      color={theme.palette.error.main}
      border={1}
      borderColor={theme.palette.error.main}
    >
      <Typography variant="h3">{error.message}</Typography>
      
      {networkErrors && (
        <Box my={4}>
          <Typography variant="h4">Network Errors</Typography>
          {networkErrors.map((err, i) => (
            <Typography variant="body1" key={i}>{err.message}</Typography>
          ))}
        </Box>
      )}

      {error.graphQLErrors && error.graphQLErrors.length > 0 && (
        <Box my={4}>
          <Typography variant="h4">GraphQl Errors</Typography>
            {error.graphQLErrors.map((err, i) => (
              <Box my={4} key={i}>
                <Typography>{err.message}</Typography>
                <Typography>{`path: ${err.path.join('/')}` }</Typography>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  )
}

export default GraphqlError
