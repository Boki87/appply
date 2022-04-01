import { extendTheme } from '@chakra-ui/react'

const styles = {
  global: () => ({
    html: {
      h: '100%',
      w: '100%',
    },
    body: {
      h: '100%',
      w: '100%',
    },
    '#root': {
      h: 'full',
      w: '100%',
    }
  })
}


const theme = extendTheme({
  styles
})

export default theme

