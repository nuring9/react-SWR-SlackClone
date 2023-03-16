import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095'; // 변수로 빼서 사용하는게 좋다. 배포할때 문자열을 다 찾아서 수정해야하기 때문에...

const sockets: { [key: string]: SocketIOClient.Socket } = {}; // 빈 객체나 빈 배열에는 typescript를 작성해주어야 한다. key는 워크스페이스 고정값이 아니기때문에 key사용

const useSocket = (workspace?: string) => {
  // const disconnect = sockets[workspace].disconnect;
  // 위의 코드를 사용하려면, disconnet를 if문 밑에다가 놓자니 if문에서 에러가 나고, 위로 올리면 workspace가 에러가 나기때문에,
  // 자바스크립트 스코프 지식이 필요하다. disconnect를 함수로 바꿔줘서 문제를 해결한다.
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
    }
  }, [workspace]);

  if (!workspace) {
    // workspace는 필수이기 때문에 없다면 그냥 리턴.
    return [undefined, disconnect]; // return문끼리는 똑같이 구조를 잡아줘야한다.
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);
  // socket.io가 구조적 계층이 이루어져 있다. namespace와 room, 그래서 우리도 slack의 workspace를 namespace로 둘것이고, channel를 room으로 둘것이다.
  // 대응이 되게 사용하기 위해서 ws- 워크스페이스 안의 현재 워크스페이스 라고 구조를 잡아줌.

  return [sockets[workspace], disconnect]; // useInput 훅스처럼 내가 원하는데로 구조를 잡아준다.
};

export default useSocket;
