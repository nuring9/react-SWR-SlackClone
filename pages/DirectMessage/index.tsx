import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

import React, { useCallback } from 'react';
import { Container, Header, DragOver } from '@pages/DirectMessage/styles';

import fetcher from '@utils/fetcher';

import axios from 'axios';
import gravatar from 'gravatar';

import { useParams } from 'react-router';
import useSWR from 'swr';
import { IDM } from '@typings/db';

import useInput from '@hooks/useInput';
import makeSection from '@utils/makeSection';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log('submit');
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat('');
          })
          .catch(console.error);
      }
      setChat('');
    },
    [chat, mutateChat, setChat, id, workspace],
  );

  if (!userData || !myData) {
    return null;
  }

  const chatSections = makeSection(chatData ? [...chatData].reverse() : []);
  // [].concat(...chatData) 빈배열에 chat를 합치면 새로운 배열이 생긴다. 이걸 reverse
  // concat을 사용하지 않고 더 짧게 구현하려면 [...chatData].reverse() 스프레드문법을 사용하면 새로운 배열,

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
