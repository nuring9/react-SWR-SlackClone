import { IDM, IChat } from '@typings/db';
import dayjs from 'dayjs';

export default function makeSection(chatList: (IDM | IChat)[]) {
  const sections: { [key: string]: (IDM | IChat)[] } = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
}

// 날짜 분리하는 개념
// sections = {
//   '2023-05-01' : [1, 3]
//   '2023-05-05' : [2]
// }

// [{ id: 1, d: '2023-05-01' }, { id: 2, d: '2023-05-05' }, { id: 3, d: '2023-05-01' }]
