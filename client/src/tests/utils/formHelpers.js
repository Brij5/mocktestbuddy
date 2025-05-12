import { fireEvent } from '@testing-library/react';

export const fillForm = (container, formData) => {
  Object.entries(formData).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });
};

export const submitForm = (container) => {
  const form = container.querySelector('form');
  fireEvent.submit(form);
};

export const expectFormError = (container, fieldName, errorMessage) => {
  const error = container.querySelector(`[data-testid="${fieldName}-error"]`);
  expect(error).toBeInTheDocument();
  expect(error).toHaveTextContent(errorMessage);
};

export const expectFormSuccess = (container, successMessage) => {
  const success = container.querySelector('[data-testid="form-success"]');
  expect(success).toBeInTheDocument();
  if (successMessage) {
    expect(success).toHaveTextContent(successMessage);
  }
};

export const mockFormValidation = (valid = true) => {
  return {
    validate: jest.fn().mockReturnValue(valid),
    errors: valid ? {} : {
      email: 'Invalid email',
      password: 'Password is required'
    }
  };
};
