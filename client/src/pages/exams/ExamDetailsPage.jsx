import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button, 
  Paper,  
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { exams } from '../../data/mocks/examDetailsMocks'; 

const ExamDetails = ({ examId }) => {
  const navigate = useNavigate();
  const exam = exams[examId]; 

  if (!exam) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Exam Not Found
        </Typography>
        {/* You could add a button to navigate back or to an exams list */}
      </Container>
    );
  }

  const renderExamPattern = () => {
    if (exam.pattern.stages) {
      return (
        <List>
          {exam.pattern.stages.map((stage, index) => (
            <ListItem key={index}>
              <ListItemText primary={stage.name} secondary={stage.description} />
            </ListItem>
          ))}
        </List>
      );
    }
    if (exam.pattern.sections) {
      return (
        <List>
          {exam.pattern.sections.map((section, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={section.name}
                secondary={`Questions: ${section.questions}, Marks: ${section.marks}, Time: ${section.time} minutes`}
              />
            </ListItem>
          ))}
        </List>
      );
    }
    if (exam.pattern.papers) {
      return (
        <List>
          {exam.pattern.papers.map((paper, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={paper.name}
                secondary={`Questions: ${paper.questions}, Marks: ${paper.marks}, Time: ${paper.time} minutes`}
              />
            </ListItem>
          ))}
        </List>
      );
    }
    return <Typography>Pattern details not available in this format.</Typography>;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {exam.name}
      </Typography>

      {/* Exam Overview */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {exam.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip
              label={exam.difficultyLevel}
              color={exam.difficultyLevel === 'Advanced' ? 'primary' : 'secondary'}
              sx={{ mr: 1 }}
            />
            <Chip label={`${exam.mockTests} Mock Tests`} color="success" />
          </Box>
        </CardContent>
      </Card>

      {/* Exam Pattern */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Exam Pattern
          </Typography>
          {renderExamPattern()}
        </CardContent>
      </Card>

      {/* Syllabus */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Syllabus
          </Typography>
          <List>
            {exam.syllabus.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* TODO: Add sections for Eligibility, Important Dates, etc. if needed */}
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/student/tests/exam/${exam.id}`)} 
        >
          View Available Mock Tests
        </Button>
      </Box>

    </Container>
  );
};

export default ExamDetails;
