import { ChakraProvider } from '@chakra-ui/react';
import { customTheme } from '../../.';
import Home from './views/Home';

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <Home />
    </ChakraProvider>
  );
}

export default App;
