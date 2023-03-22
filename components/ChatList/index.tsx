import { ChatZone } from '@components/ChatList/styles';
import Chat from '@components/Chat';

import { IDM } from '@typings/db';

import React, { VFC } from 'react';

interface Props {
  chatData?: IDM[]; // 없을수도 있기때문에 ?
}

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      {chatData?.map(
        (
          chat, // 옵셔닝 체이닝 문법, undefined 와 null을 걸러줌. => (
        ) => (
          <Chat key={chat.id} data={chat} />
        ),
      )}
    </ChatZone>
  );
};

export default ChatList;
