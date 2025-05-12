import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamsByCategory } from '../store/slices/examSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Link,
} from '@mui/material';

const CategoryExamsPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  // Select the specific slice of state for this category's exams
  const { status, data: exams, error } = useSelector((state) => {
    // Provide a default object if the category data hasn't been fetched yet
    return state.exams.examsByCategory[categoryId] || { status: 'idle', data: [], error: null };
  });

  useEffect(() => {
    // Fetch only if status is idle (initial load) or if categoryId changes
    // Avoid re-fetching if data is already loaded or loading/failed
    if (categoryId && status === 'idle') {
      dispatch(fetchExamsByCategory(categoryId));
    }
    // Dependency array includes categoryId and status to refetch if needed
    // Or just categoryId if we only want to fetch on category change
  }, [dispatch, categoryId, status]);

  // --- Render Logic ---
  let content;

  if (status === 'loading' || status === 'idle') {
    // Show loader if loading OR if idle (meaning useEffect hasn't dispatched/resolved yet)
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (status === 'failed') {
    content = (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading exams: {error}
      </Alert>
    );
  } else if (status === 'succeeded' && exams.length === 0) {
    content = (
      <Typography sx={{ mt: 2 }}>No exams found for this category yet.</Typography>
    );
  } else if (status === 'succeeded') {
    content = (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {exams.map((exam) => (
          <Grid item xs={12} sm={6} md={4} key={exam._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {exam.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exam.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Duration: {exam.durationMinutes} mins | Marks: {exam.totalMarks}
                </Typography>
                {/* Display category name if populated - depends on backend */} 
                {exam.category && typeof exam.category === 'object' && (
                   <Typography variant="caption" display="block" sx={{mt: 1}}>
                      Category: {exam.category.name}
                   </Typography>
                )}
              </CardContent>
              <CardActions>
                {/* Link to take the exam - implement later */}
                <Button size="small" component={RouterLink} to={`/exam/${exam._id}/instructions`}>
                  Start Exam
                </Button>
                {/* Link to view exam details - implement later */}
                {/* <Button size="small">View Details</Button> */}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* TODO: Fetch and display Category Name here */} 
      <Typography variant="h4" component="h1" gutterBottom>
         Exams 
      </Typography>
      {content}
    </Container>
  );
};

export default CategoryExamsPage;
