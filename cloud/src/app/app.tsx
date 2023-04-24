import styled from 'styled-components';

import NxWelcome from './nx-welcome';
import Challenge from './challenge';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <Challenge />
    </StyledApp>
  );
}

export default App;
