import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { expect } from '@jest/globals';

// Common test patterns
export const testComponentRendering = (Component, props = {}) => {
  return {
    setup: () => render(<Component {...props} />),
    verify: () => {
      expect(screen.getByRole('main')).toBeInTheDocument();
      return screen;
    }
  };
};

export const testFormSubmission = async (container, formData, submitButton = 'Submit') => {
  // Fill form
  Object.entries(formData).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`);
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  });

  // Submit form
  const submitBtn = container.getByText(submitButton);
  fireEvent.click(submitBtn);

  // Wait for any async operations
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return container;
};

export const testErrorHandling = (container, errorType = 'error') => {
  const errorElement = container.getByTestId(`${errorType}-message`);
  expect(errorElement).toBeInTheDocument();
  return errorElement;
};

export const testLoadingState = (container) => {
  const loadingElement = container.getByTestId('loading');
  expect(loadingElement).toBeInTheDocument();
  return loadingElement;
};

export const testSuccessState = (container, successMessage = 'Success') => {
  const successElement = container.getByText(successMessage);
  expect(successElement).toBeInTheDocument();
  return successElement;
};

export const testNavigation = (container, linkText, expectedUrl) => {
  const link = container.getByText(linkText);
  expect(link).toHaveAttribute('href', expectedUrl);
  return link;
};

export const testButtonInteraction = async (container, buttonText, expectedAction) => {
  const button = container.getByText(buttonText);
  fireEvent.click(button);

  // Wait for any async operations
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  return expectedAction();
};

export const testTableRendering = (container, rowCount, columnCount) => {
  const table = container.getByRole('table');
  const rows = table.querySelectorAll('tr');
  const cells = table.querySelectorAll('td, th');

  expect(rows).toHaveLength(rowCount);
  expect(cells).toHaveLength(rowCount * columnCount);

  return { table, rows, cells };
};

export const testModalInteraction = async (container, triggerText, modalTitle) => {
  // Open modal
  const trigger = container.getByText(triggerText);
  fireEvent.click(trigger);

  // Verify modal
  const modal = container.getByRole('dialog');
  const title = container.getByText(modalTitle);
  expect(modal).toBeInTheDocument();
  expect(title).toBeInTheDocument();

  return modal;
};
