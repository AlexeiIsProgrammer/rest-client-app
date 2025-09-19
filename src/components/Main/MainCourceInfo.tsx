import {
  Container,
  Stack,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import { useIntlayer } from 'react-intlayer';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';

const Out = ({
  href,
  children,
  ...props
}: { href: string; children: React.ReactNode } & React.ComponentProps<
  typeof Link
>) => (
  <Link href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </Link>
);

function MainCourceInfo() {
  const content = useIntlayer('main');

  const developers = [
    {
      name: content.alex,
      role: content.developerRole,
      bio: content.developerBio,
      linkedin: 'https://www.linkedin.com/in/alexei-shmulevtsov/',
    },
    {
      name: content.andrew,
      role: content.developerRole,
      bio: content.developerBio,
      linkedin: 'https://www.linkedin.com/in/andrei-paleshchuk/',
    },
    {
      name: content.aliaksandr,
      role: content.developerRole,
      bio: content.developerBio,
      linkedin: 'https://www.linkedin.com/in/aliaksandr-chachura-0a078118a/',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack alignItems="center" spacing={5}>
        <Box
          sx={{ bgcolor: 'E0E2E6', minHeight: '100vh', py: { xs: 4, md: 6 } }}
        >
          <Container maxWidth="lg">
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 4,
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                alignItems={{ md: 'center' }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    {content.projectTitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1.5, maxWidth: 720 }}
                  >
                    {content.projectDescription}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained"
                    startIcon={<GitHubIcon />}
                    href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md"
                    target="_blank"
                    rel="noopener"
                    sx={{ borderRadius: 3 }}
                  >
                    {content.taskSpec}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<SchoolIcon />}
                    href="https://rs.school/courses/reactjs"
                    target="_blank"
                    rel="noopener"
                    sx={{ borderRadius: 3 }}
                  >
                    {content.course}
                  </Button>
                </Stack>
              </Stack>
            </Card>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <InfoIcon color="action" />
                      <Typography variant="h6" fontWeight={600}>
                        {content.aboutProject}
                      </Typography>
                    </Stack>
                    <Typography color="text.primary">
                      {content.projectDetails}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ mt: 2, pl: 3, '& li': { mb: 0.75 } }}
                    >
                      <li>{content.techRequirements}</li>
                      <li>{content.features}</li>
                      <li>{content.quality}</li>
                      <li>{content.deployment}</li>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      {content.references}{' '}
                      <Out href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md">
                        {content.reactFinalTask}
                      </Out>{' '}
                      •{' '}
                      <Out href="https://rs.school/">
                        {content.rsSchoolWebsite}
                      </Out>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <SchoolIcon color="action" />
                      <Typography variant="h6" fontWeight={600}>
                        {content.aboutCourse}
                      </Typography>
                    </Stack>
                    <Typography color="text.primary">
                      {content.courseDescription}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.5 }}
                    >
                      {content.learnMore}{' '}
                      <Out href="https://rs.school/courses/reactjs">
                        {content.coursePage}
                      </Out>
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            <Card sx={{ borderRadius: 3, mt: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <GroupIcon color="action" />
                  <Typography variant="h6" fontWeight={600}>
                    {content.developers}
                  </Typography>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {developers.map((d) => (
                    <Box
                      key={String(d.name)}
                      sx={{
                        minWidth: {
                          xs: '100%',
                          sm: 'calc(50% - 8px)',
                          md: 'calc(33.333% - 11px)',
                        },
                        flex: '1 1 auto',
                      }}
                    >
                      <Box
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 3,
                          p: 2,
                          height: '100%',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {d.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {d.role}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1.5 }}>
                          {d.bio}
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                          <Out href={d.linkedin}>{content.linkedin}</Out>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Stack>
    </Container>
  );
}

export default MainCourceInfo;
