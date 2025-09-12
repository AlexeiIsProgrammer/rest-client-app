import { useLoaderData, redirect, Link } from 'react-router';
import { getDocs, orderBy, query, where, collection } from 'firebase/firestore';
import { db } from '~/firebase';
import { getUserFromRequest } from '~/utils/auth.server';

interface RequestHistoryItem {
  uid: string;
  endpoint: string;
  method: string;
  statusCode?: number;
  duration?: number;
  timestamp: { seconds: number; nanoseconds: number };
  requestSize?: number;
  responseSize?: number;
  error?: string | null;
  encodedPath: string;
}

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

export function meta() {
  return [
    { title: 'History page' },
    { name: 'description', content: 'Welcome to History page!' },
  ];
}

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect('/signin');
  }
  const q = query(
    collection(db, 'requests'),
    where('uid', '==', user.uid),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const history = snapshot.docs.map((doc) => doc.data());

  return { history };
};

export default function History() {
  const { history } = useLoaderData();
  if (!history.length) {
    return (
      <Container maxWidth="sm">
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          You have not executed any requests yet. It is empty here.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <List>
        {history.map((item: RequestHistoryItem) => (
          <ListItem key={item.uid} divider>
            <ListItemText
              primary={<Link to={item.encodedPath}>{item.endpoint}</Link>}
              secondary={
                <Typography sx={{ color: 'white' }}>
                  {`Status: ${item.statusCode ?? 'N/A'}, Duration: ${item.duration ?? 'N/A'}`}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
