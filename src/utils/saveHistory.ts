import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '~/firebase';
import type { User } from 'firebase/auth';
import type { RESTResponse } from '~/types';

type saveHistoryProps = {
  user: User;
  url: string;
  method: string;
  response: RESTResponse;
  requestBody: string;
  path: string;
};

export default async function saveHistory({
  user,
  url,
  method,
  response,
  requestBody,
  path,
}: saveHistoryProps) {
  await addDoc(collection(db, 'requests'), {
    uid: user.uid,
    endpoint: url,
    method,
    statusCode: response.status ?? null,
    duration: response.duration ?? null,
    timestamp: serverTimestamp(),
    requestSize: requestBody ? JSON.stringify(requestBody).length : 0,
    responseSize: response.data ? JSON.stringify(response.data).length : 0,
    error: response.error ?? null,
    encodedPath: path,
  });
}
