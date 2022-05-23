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
    },
    '.ProseMirror': {
      minH: '400px',
      border: '1px solid var(--chakra-colors-gray-300)',
      borderRadius: '7px',
      padding: '10px',
      'h1': {
        fontSize: '3xl',
        fontWeight: 'bold',
      },
      'h2': {
        fontSize: '2xl',
        fontWeight: 'bold',
      },
      'h3': {
        fontSize: 'lg',
        fontWeight: 'bold',
      },
      'ul': {
        listStyle: 'disc',
        paddingLeft: '20px',
      },
      'ol': {
        listStyle: 'decimal',
        paddingLeft: '20px',
      },
      'code': {
        fontFamily: 'monospace',
        fontSize: '1.2em',
        padding: '0.2em 0.4em',
        borderRadius: '0.3em',
        background: 'var(--chakra-colors-gray-800)',
        color: 'white',
      },
      'pre': {
        fontFamily: 'monospace',
        fontSize: '14px',
        padding: '10px',
        backgroundColor: 'var(--chakra-colors-gray-800)',
        color: 'white',
        borderRadius: '7px',
      },
      'blockquote': {
        borderLeft: '4px solid var(--chakra-colors-gray-300)',
        padding: '10px',
      }
    },
  })
}


const theme = extendTheme({
  styles
})

export default theme

