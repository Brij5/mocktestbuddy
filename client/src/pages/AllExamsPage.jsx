import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Container 
} from '@mui/material';
import { fetchCategories } from '../store/slices/examSlice'; 

const AllExamsPage = () => {
  const dispatch = useDispatch();
  const { 
    categories, 
    loading: examsLoading, 
    error: examsError 
  } = useSelector((state) => state.exams);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}> 
      <Typography variant="h4" gutterBottom component="h1">
        Explore Exam Categories
      </Typography>

      {examsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : examsError ? (
        <Alert severity="error" sx={{ my: 3 }}>
          {typeof examsError === 'string' ? examsError : examsError.message || 'Could not load exam categories.'}
        </Alert>
      ) : categories && categories.length > 0 ? (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid xs={12} sm={6} md={4} key={category._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || 'No description available.'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', mt: 'auto' }}>
                  <Button component={RouterLink} to={`/exams/category/${category._id}`} size="small" variant="outlined">
                    View Exams in this Category
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ my: 3 }}>No exam categories available at the moment.</Typography>
      )}
    </Container>
  );
};

export default AllExamsPage;
