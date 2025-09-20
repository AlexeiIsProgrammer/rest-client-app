import { render, screen } from '@testing-library/react';
import MainCourceInfo from '../MainCourceInfo';
import { vi } from 'vitest';

vi.mock('react-intlayer', () => ({
  useIntlayer: () => ({
    projectTitle: 'React Final Project',
    projectDescription:
      'This app is a graduation project for the Rolling Scopes School React course. The main page provides general information about the developers, the project, and the course.',
    taskSpec: 'Task Spec',
    course: 'Course',
    aboutProject: 'About the Project',
    projectDetails:
      'Build a modern, production-ready React application with TypeScript, routing, state management, and robust data fetching. Include UI/UX polish, accessibility, meaningful tests, and CI-ready structure.',
    techRequirements:
      'Tech: React + TypeScript, Router, state manager (RTK/Zustand/Context), testing, linting.',
    features:
      'Features: auth (if needed), CRUD flows, pagination/filters, responsive layout.',
    quality:
      'Quality: accessible components, semantic HTML, performance attention, code review readiness.',
    deployment:
      'Deployment: hosted build with README and links to the spec and course.',
    references: 'References:',
    reactFinalTask: 'React final task',
    rsSchoolWebsite: 'RS School website',
    aboutCourse: 'About the Course',
    courseDescription:
      "RS School's React track covers hooks, routing, state management (Context/Redux Toolkit/Zustand), data fetching (RTK Query / TanStack Query), testing, and Next.js basics.",
    learnMore: 'Learn more:',
    coursePage: 'Course page',
    developers: 'Developers',
    developerRole: 'Developer',
    developerBio:
      'React developer working on the REST client application for the RS School React course final project.',
    linkedin: 'LinkedIn',
    aliaksandr: 'Aliaksandr Chachura',
    alex: 'Alexei Shmulevtsov',
    andrew: 'Andrei Paleshchuk',
  }),
}));

describe('MainCourceInfo', () => {
  it('renders Main component', () => {
    render(<MainCourceInfo />);

    expect(screen.getByText('React Final Project')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This app is a graduation project for the Rolling Scopes School React course. The main page provides general information about the developers, the project, and the course.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Task Spec')).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getByText('About the Project')).toBeInTheDocument();
    expect(screen.getByText('About the Course')).toBeInTheDocument();
    expect(screen.getByText('Developers')).toBeInTheDocument();
    expect(screen.getAllByText('Developer')).toHaveLength(3);
    expect(
      screen.getAllByText(
        'React developer working on the REST client application for the RS School React course final project.'
      )
    ).toHaveLength(3);
    expect(screen.getAllByText('LinkedIn')).toHaveLength(3);
  });

  it('renders MainCourceInfo component with correct links', () => {
    render(<MainCourceInfo />);

    expect(screen.getByRole('link', { name: 'Task Spec' })).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md'
    );
    expect(screen.getByRole('link', { name: 'Course' })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(
      screen.getByRole('link', { name: 'React final task' })
    ).toHaveAttribute(
      'href',
      'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md'
    );
    expect(
      screen.getByRole('link', { name: 'RS School website' })
    ).toHaveAttribute('href', 'https://rs.school/');
    expect(screen.getByRole('link', { name: 'Course page' })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
  });

  it('renders MainCourceInfo component with correct developers', () => {
    render(<MainCourceInfo />);

    expect(screen.getByText('Aliaksandr Chachura')).toBeInTheDocument();
    expect(screen.getByText('Alexei Shmulevtsov')).toBeInTheDocument();
    expect(screen.getByText('Andrei Paleshchuk')).toBeInTheDocument();
    expect(screen.getAllByText('Developer')).toHaveLength(3);
    expect(
      screen.getAllByText(
        'React developer working on the REST client application for the RS School React course final project.'
      )
    ).toHaveLength(3);
    expect(screen.getAllByText('LinkedIn')).toHaveLength(3);
  });

  it('renders translated content', () => {
    render(<MainCourceInfo />);
    expect(screen.getByText('React Final Project')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This app is a graduation project for the Rolling Scopes School React course. The main page provides general information about the developers, the project, and the course.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Task Spec')).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();
    expect(screen.getByText('About the Project')).toBeInTheDocument();
    expect(screen.getByText('About the Course')).toBeInTheDocument();
    expect(screen.getByText('Developers')).toBeInTheDocument();
  });
});
