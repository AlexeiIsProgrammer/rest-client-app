import { useLoaderData, redirect } from 'react-router';
import { getDocs, orderBy, query, where, collection } from 'firebase/firestore';
import { db } from '~/firebase';
import { getUserFromRequest } from '~/utils/auth.server';
import transformServerTimestamp from '~/utils/transformServerTimestamp';

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
  id: string;
}

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import LocalizedLink from '~/components/LocalizedLink';
import { useIntlayer } from 'react-intlayer';

export function meta() {
  return [
    { title: 'History page' },
    { name: 'description', content: 'Welcome to History page!' },
  ];
}

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  if (!user) {
    return redirect('/');
  }
  const q = query(
    collection(db, 'requests'),
    where('uid', '==', user.uid),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  const history = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { history };
};

export default function History() {
  const content = useIntlayer('history');

  const { history } = useLoaderData();
  if (!history.length) {
    return (
      <Container maxWidth="sm">
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          {content['error-message']}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {content.title}
      </Typography>
      <List sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
        {history.map((item: RequestHistoryItem) => (
          <ListItem
            key={item.id}
            divider
            sx={{
              py: 2,
              px: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <ListItemText
              primary={
                <MuiLink
                  component={LocalizedLink}
                  to={item.encodedPath}
                  sx={{
                    textDecoration: 'none',
                  }}
                >
                  {item.endpoint}
                </MuiLink>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.5 }}
                >
                  {`${content.method?.value}: ${item.method.toUpperCase()} • ${content.status?.value}: ${item.statusCode ?? 'N/A'} • ${content.duration?.value}: ${
                    item.duration
                  }${content.ms?.value} • ${content['request-size']?.value}: ${item.requestSize} ${content.bytes?.value} • ${content['response-size']?.value}: ${
                    item.responseSize
                  } ${content.bytes?.value} • ${content.timestamp?.value}: ${transformServerTimestamp(item.timestamp.seconds)} ${item.error ? `• ${content.error?.value}: ${item.error}` : ''}`}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
