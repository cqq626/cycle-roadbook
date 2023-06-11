import styled from '@emotion/styled';
import 'antd/dist/reset.css';

import { Map } from './Map';

const StyledApp = styled.div`
  width: 100%;
  height: 100%;
`;

export function App() {
  return (
    <StyledApp>
      <Map />
    </StyledApp>
  );
}

export default App;
