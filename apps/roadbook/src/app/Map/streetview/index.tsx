import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Modal } from 'antd';

import { LatLngI } from '../components/Map';
import { getSid, getPics } from './utils';

export type MCLatLngI = LatLngI;
interface StreetviewPropsI {
  mcLatLng: MCLatLngI | null;
}

export const Streetview = ({ mcLatLng }: StreetviewPropsI) => {
  const [streetviewPics, setStreetviewPics] = useState<string[][]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadPics() {
      const res = await getSid({ lat: mcLatLng!.lat, lng: mcLatLng!.lng });
      if (res?.id) {
        const pics = await getPics(res.id);
        setStreetviewPics(pics);
      }
    }

    if (mcLatLng) {
      loadPics();
      setOpen(true);
    } else {
      setStreetviewPics([]);
    }
  }, [mcLatLng]);

  return (
    <Modal
      footer={null}
      closable={true}
      open={open}
      onCancel={() => setOpen(false)}
      width={'100%'}
      bodyStyle={{ height: '90%' }}
    >
      <StyledPics>
        {streetviewPics.length ? (
          streetviewPics.map((picGroup, picGroupIdx) => {
            const picComps = picGroup.map((pic, picIdx) => (
              <StyledImgWrapper>
                {/* <StyledImgCode>{`${picGroupIdx}_${picIdx}`}</StyledImgCode> */}
                <StyledImg src={pic} />
              </StyledImgWrapper>
            ));
            return <StyledImgGroup>{picComps}</StyledImgGroup>;
          })
        ) : (
          <StyledHint>此处无街景</StyledHint>
        )}
      </StyledPics>
    </Modal>
  );
};

const StyledPics = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;
const StyledImgGroup = styled.div`
  display: flex;
`;
const StyledImgWrapper = styled.div``;
const StyledImgCode = styled.div``;
const StyledImg = styled.img`
  width: 256px;
  height: 256px;
`;
const StyledHint = styled.div``;

export * from './utils';
