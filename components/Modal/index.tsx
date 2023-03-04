import React, { FC } from 'react';
import { CreateModal } from '@components/Modal/styles';

const Modal: FC = ({ children }) => {
  return (
    <CreateModal>
      <div>Modal!</div>
      {children}
    </CreateModal>
  );
};

export default Modal;
