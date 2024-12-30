/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ReactNode, SyntheticEvent } from 'react';
import { styled, css, SupersetTheme, t } from '@superset-ui/core';
import Button from 'src/components/Button';

// Importing svg images
import FilterResultsImage from 'src/assets/images/filter-results.svg';
import EmptyImage from 'src/assets/images/empty.svg';
import ChartImage from 'src/assets/images/chart.svg';
import FilterImage from 'src/assets/images/filter.svg';
import EmptyChartsImage from 'src/assets/images/empty-charts.svg';
import EmptyDashboardImage from 'src/assets/images/empty-dashboard.svg';
import UnionImage from 'src/assets/images/union.svg';
import EmptyQueriesImage from 'src/assets/images/empty-queries.svg';
import StarCircleImage from 'src/assets/images/star-circle.svg';
import VectorImage from 'src/assets/images/vector.svg';
import DocumentImage from 'src/assets/images/document.svg';
import { Empty } from './Empty';

const imageMap = {
  'filter-results.svg': <FilterResultsImage />,
  'empty.svg': <EmptyImage />,
  'chart.svg': <ChartImage />,
  'filter.svg': <FilterImage />,
  'empty-charts.svg': <EmptyChartsImage />,
  'empty-dashboard.svg': <EmptyDashboardImage />,
  'union.svg': <UnionImage />,
  'empty-queries.svg': <EmptyQueriesImage />,
  'star-circle.svg': <StarCircleImage />,
  'vector.svg': <VectorImage />,
  'document.svg': <DocumentImage />,
};

type EmptyStateSize = 'small' | 'medium' | 'large';

export type EmptyStateProps = {
  title?: ReactNode;
  description?: ReactNode;
  image?: ReactNode | string;
  buttonText?: ReactNode;
  buttonAction?: (event: SyntheticEvent) => void;
  size?: EmptyStateSize;
  children?: ReactNode;
};

const EmptyStateContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: ${theme.colors.grayscale.light3};
    align-items: center;
    justify-content: center;
    padding: ${theme.gridUnit * 4}px;
    text-align: center;

    & .antd5-empty-image svg {
      width: auto;
    }

    & a,
    & span[role='button'] {
      color: inherit;
      text-decoration: underline;
      &:hover {
        color: ${theme.colors.grayscale.base};
      }
    }
  `}
`;

const Title = styled.p<{ size: EmptyStateSize }>`
  ${({ theme, size }) => css`
    font-size: ${size === 'large'
      ? theme.typography.sizes.l
      : theme.typography.sizes.m}px;
    color: ${theme.colors.grayscale.light1};
    margin-top: ${size === 'large' ? theme.gridUnit * 4 : theme.gridUnit * 2}px;
    font-weight: ${theme.typography.weights.bold};
  `}
`;

const Description = styled.p<{ size: EmptyStateSize }>`
  ${({ theme, size }) => css`
    font-size: ${size === 'large'
      ? theme.typography.sizes.m
      : theme.typography.sizes.s}px;
    color: ${theme.colors.grayscale.light1};
    margin-top: ${theme.gridUnit * 2}px;
  `}
`;

const ActionButton = styled(Button)`
  ${({ theme }) => css`
    margin-top: ${theme.gridUnit * 4}px;
    z-index: 1;
  `}
`;

const getImageHeight = (size: EmptyStateSize) => {
  switch (size) {
    case 'small':
      return { height: '50px' };
    case 'medium':
      return { height: '80px' };
    case 'large':
      return { height: '150px' };
    default:
      return { height: '80px' };
  }
};

const ImageContainer = ({
  image,
  size,
}: {
  image?: ReactNode | string;
  size: EmptyStateSize;
}) => {
  if (!image) return null;
  const mappedImage = typeof image === 'string' ? imageMap[image] : image;
  return (
    <Empty
      description={false}
      image={mappedImage}
      imageStyle={getImageHeight(size)}
    />
  );
};

const handleMouseDown = (e: SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = t('No results'),
  description = t('There is currently no information to display.'),
  image = 'empty.svg',
  buttonText,
  buttonAction,
  size = 'medium',
  children,
}) => (
  <EmptyStateContainer>
    {image && <ImageContainer image={image} size={size} />}
    <div
      css={(theme: SupersetTheme) => css`
        max-width: ${size === 'large'
          ? theme.gridUnit * 150
          : theme.gridUnit * 100}px;
      `}
    >
      {title && <Title size={size}>{title}</Title>}
      {description && <Description size={size}>{description}</Description>}
      {buttonText && buttonAction && (
        <ActionButton
          buttonStyle="primary"
          onClick={buttonAction}
          onMouseDown={handleMouseDown}
        >
          {buttonText}
        </ActionButton>
      )}
      {children}
    </div>
  </EmptyStateContainer>
);
