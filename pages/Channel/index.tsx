import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import ChatBox from '@components/ChatBox';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      setChat('');
    },
    [setChat],
  );
  return (
    <Container>
      <Header>Channel!</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
