import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { createSelector } from 'reselect';
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
  Container,
  Breadcrumbs,
  Link
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { fetchExamsByCategory, fetchCategories } from '../store/slices/examSlice';

// Input selectors
const selectExamsByCategoryState = (state) => state.exams.examsByCategory;
const selectAllCategoriesState = (state) => state.exams.categories;
const selectExamsLoadingState = (state) => state.exams.loading;
const selectCategoryIdFromParams = (state, categoryId) => categoryId;

// Memoized selector
const selectExamsPageData = createSelector(
  [selectExamsByCategoryState, selectAllCategoriesState, selectExamsLoadingState, selectCategoryIdFromParams],
  (examsByCategory, allCategories, categoriesLoading, categoryId) => {
    const categoryExamsData = examsByCategory[categoryId];
    const selectedCategory = allCategories?.find(cat => cat._id === categoryId);

    return {
      exams: categoryExamsData?.data || [],
      categoryName: selectedCategory?.name || 'Category',
      loading: categoryExamsData?.status === 'loading',
      error: categoryExamsData?.error,
      categoriesLoading: categoriesLoading, 
      areCategoriesFetched: allCategories && allCategories.length > 0,
      targetCategory: selectedCategory
    };
  }
);

const ExamsByCategoryPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  // Use the memoized selector
  const { 
    exams, 
    categoryName, 
    loading, 
    error, 
    categoriesLoading, 
    areCategoriesFetched,
    targetCategory
  } = useSelector((state) => selectExamsPageData(state, categoryId));

  useEffect(() => {
    if (categoryId) {
      // Fetch categories if they haven't been fetched yet or if the current category isn't in the list
      if (!categoriesLoading && (!areCategoriesFetched || !targetCategory)) {
        dispatch(fetchCategories());
      }
      // Always attempt to fetch exams for the category if categoryId is present
      dispatch(fetchExamsByCategory(categoryId));
    }
  }, [dispatch, categoryId, categoriesLoading, areCategoriesFetched, targetCategory]);

  const pageTitle = categoriesLoading && !targetCategory ? 'Loading category...' : `Exams in "${categoryName}"`;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/exams" color="inherit" underline="hover">
          Exam Categories
        </Link>
        <Typography color="text.primary">
          {categoriesLoading && !targetCategory ? '...' : categoryName}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom component="h1">
        {pageTitle}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 3 }}>
          {typeof error === 'string' ? error : error.message || 'Could not load exams for this category.'}
        </Alert>
      ) : exams && exams.length > 0 ? (
        <Grid container spacing={3}>
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {exam.title || exam.name} {/* Assuming exam has a title or name */}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exam.description || 'No description available.'}
                  </Typography>
                  {exam.durationMinutes && <Typography variant="caption" display="block" sx={{mt:1}}>Duration: {exam.durationMinutes} mins</Typography>}
                  {exam.questionsCount && <Typography variant="caption" display="block">Questions: {exam.questionsCount}</Typography>}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', mt: 'auto', pt: 0 }}> {/* Adjusted padding */}
                  <Button component={RouterLink} to={`/mock-test/${exam._id}`} size="small" variant="contained">
                    Start Exam
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ my: 3 }}>No exams available in this category at the moment.</Typography>
      )}
    </Container>
  );
};

export default ExamsByCategoryPage;
