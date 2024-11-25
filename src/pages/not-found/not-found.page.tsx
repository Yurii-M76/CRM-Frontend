import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Cover } from './not-found-cover';
import classes from './not-found.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Cover className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Страница не найдена</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            Страница, которую вы пытаетесь открыть, не существует. Возможно, вы неправильно ввели
            адрес или страница была перемещена на другой URL.
          </Text>
          <Group justify="center">
            <Button size="md" onClick={() => navigate('/')}>
              Перейти на главную страницу
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
