import ChatBox from '@components/ChatBox';

import React, { useCallback } from 'react';
import { Container, Header, DragOver } from '@pages/DirectMessage/styles';

import fetcher from '@utils/fetcher';

import axios from 'axios';
import gravatar from 'gravatar';

import { useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      {/* <ChatList  /> 컴포넌트 배치만 해놓고 나중에 구현 */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
