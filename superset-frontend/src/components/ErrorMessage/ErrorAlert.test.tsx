import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorAlert from './ErrorAlert';
import { t } from '@superset-ui/core';

describe('ErrorAlert', () => {
  it('renders the error message correctly', () => {
    render(
      <ErrorAlert
        errorType="Error"
        message="Something went wrong"
        type="error"
      />,
    );

    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    const description = 'This is a detailed description';
    render(
      <ErrorAlert
        errorType="Error"
        message="Something went wrong"
        type="error"
        description={description}
      />,
    );

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('toggles description details visibility when show more/less is clicked', () => {
    const descriptionDetails = 'Additional details about the error.';
    render(
      <ErrorAlert
        errorType="Error"
        message="Something went wrong"
        type="error"
        descriptionDetails={descriptionDetails}
        descriptionDetailsCollapsed={true}
      />,
    );

    const showMoreButton = screen.getByText(t('Show more'));
    expect(showMoreButton).toBeInTheDocument();

    fireEvent.click(showMoreButton);
    expect(screen.getByText(descriptionDetails)).toBeInTheDocument();

    const showLessButton = screen.getByText(t('Show less'));
    fireEvent.click(showLessButton);
    expect(screen.queryByText(descriptionDetails)).not.toBeInTheDocument();
  });

  it('renders compact mode with a tooltip and modal', () => {
    render(
      <ErrorAlert
        errorType="Error"
        message="Compact mode example"
        type="error"
        compact={true}
        descriptionDetails="Detailed description in compact mode."
      />,
    );

    const iconTrigger = screen.getByText('Error');
    expect(iconTrigger).toBeInTheDocument();

    fireEvent.click(iconTrigger);
    expect(screen.getByText('Compact mode example')).toBeInTheDocument();
  });
});
