import React, { useState } from 'react';
import { Modal, Tooltip } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import Alert from 'src/components/Alert';
import { t, useTheme } from '@superset-ui/core';

export interface ErrorAlertProps {
  errorType?: string; // Strong text on the first line
  message: React.ReactNode | string; // Text shown on the first line
  type?: 'warning' | 'error' | 'info'; // Allows only 'warning' or 'error'
  description?: React.ReactNode; // Text shown under the first line, not collapsible
  descriptionDetails?: React.ReactNode | string; // Text shown under the first line, collapsible
  descriptionDetailsCollapsed?: boolean; // Hides the collapsible section unless "Show more" is clicked, default true
  descriptionPre?: boolean; // Uses pre-style to break lines, default true
  compact?: boolean; // Shows the error icon with tooltip and modal, default false
  children?: React.ReactNode; // Additional content to show in the modal
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errorType = t('Error'),
  message,
  type = 'error',
  description,
  descriptionDetails,
  descriptionDetailsCollapsed = true,
  descriptionPre = true,
  compact = false,
  children,
}) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(
    !descriptionDetailsCollapsed,
  );
  const [showModal, setShowModal] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionVisible(!isDescriptionVisible);
  };

  const theme = useTheme();
  const renderTrigger = () => {
    const icon =
      type === 'warning' ? <WarningOutlined /> : <ExclamationCircleOutlined />;
    const color =
      type === 'warning'
        ? theme.antd.colorWarningText
        : theme.antd.colorErrorText;
    return (
      <div style={{ cursor: 'pointer' }}>
        <span style={{ color }}>{icon} </span>
        {errorType}
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div>
        {description && (
          <p
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: theme.antd.fontFamilyCode,
            }}
          >
            {description}
          </p>
        )}
        {descriptionDetails && (
          <div>
            {isDescriptionVisible && (
              <p
                style={
                  descriptionPre
                    ? {
                        whiteSpace: 'pre-wrap',
                        fontFamily: theme.antd.fontFamilyCode,
                      }
                    : {}
                }
              >
                {descriptionDetails}
              </p>
            )}
            <span
              onClick={toggleDescription}
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              {isDescriptionVisible ? t('Show less') : t('Show more')}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderAlert = () => (
    <Alert description={renderDescription()} type={type}>
      <strong>{errorType}: </strong> {message}
    </Alert>
  );

  if (compact) {
    return (
      <>
        <Tooltip title={`${errorType}: ${message}`}>
          <span onClick={() => setShowModal(true)}>{renderTrigger()}</span>
        </Tooltip>
        <Modal
          title={errorType}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          {renderAlert()}
          {children}
        </Modal>
      </>
    );
  }

  return renderAlert();
};

export default ErrorAlert;
