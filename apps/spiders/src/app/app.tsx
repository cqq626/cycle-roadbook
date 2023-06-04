import styled from '@emotion/styled';
import 'antd/dist/reset.css';

import { Map } from './Map';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <Map />
    </StyledApp>
  );
}

export default App;
