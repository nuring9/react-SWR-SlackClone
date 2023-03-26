import { ChatArea, Form, SendButton, Toolbox, MentionsTextarea } from '@components/ChatBox/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';

import { EachMention } from '@components/ChatBox/styles';

import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Mention, SuggestionDataItem } from 'react-mentions';

import autosize from 'autosize';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          console.log('submit');
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return;
      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  // const renderSuggestion: (
  //   suggestion: SuggestionDataItem,
  //   search: string,
  //   highlightedDisplay: React.ReactNode,
  //   index: number,
  //   focus: boolean,
  // ) => React.ReactNode = useCallback(
  //   (member, search, highlightedDisplay, index, focus) => {
  //     if (!memberData) {
  //       return null; // memberData 가 없다면 그냥 리턴
  //     }
  //     return (
  //       // EachMention은 만들어두었던 styled. button 태그임.
  //       // highlightedDisplay는 하이라이트 기능
  //       <EachMention focus={focus}>
  //         <img
  //           src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
  //           alt={memberData[index].nickname}
  //         />
  //         <span>{highlightedDisplay}</span>
  //       </EachMention>
  //     );
  //   },
  //   [memberData],
  // );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          // allowSuggestionsAboveCursor
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>

        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
