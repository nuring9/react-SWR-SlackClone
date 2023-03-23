import { ChatZone } from '@components/ChatList/styles';
import Chat from '@components/Chat';

import { IDM } from '@typings/db';

import React, { useCallback, useRef, VFC } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface Props {
  chatData?: IDM[]; // 없을수도 있기때문에 ?
}

const ChatList: VFC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map(
          // 옵셔닝 체이닝 문법, undefined 와 null을 걸러줌.
          (chat) => (
            <Chat key={chat.id} data={chat} />
          ),
        )}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
