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
 * "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { Card, Row, Col } from 'antd';

import EmptyImage from 'src/assets/images/empty.svg';
import ChartImage from 'src/assets/images/chart.svg';
import FilterImage from 'src/assets/images/filter.svg';
import EmptyChartsImage from 'src/assets/images/empty-charts.svg';
import EmptyDashboardImage from 'src/assets/images/empty-dashboard.svg';
import UnionImage from 'src/assets/images/union.svg';
import EmptyQueriesImage from 'src/assets/images/empty-queries.svg';

import { EmptyStateSmall, EmptyStateMedium, EmptyStateBig } from './';

export default {
  title: 'Empty State Gallery',
  component: EmptyStateMedium,
  argTypes: {
    containerColor: {
      control: 'color',
      description: 'Background color of the container',
      defaultValue: 'white',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'big'],
      defaultValue: 'medium',
      description: 'Size of the Empty State components',
    },
  },
};

const emptyStates = [
  {
    title: 'Empty State',
    description: 'This is the default empty state.',
    image: <EmptyImage />,
  },
  {
    title: 'Chart Empty State',
    description: 'No charts available at the moment.',
    image: <ChartImage />,
  },
  {
    title: 'Filter Empty State',
    description: 'No filters available at the moment.',
    image: <FilterImage />,
  },
  {
    title: 'Empty Charts',
    description: 'No charts available.',
    image: <EmptyChartsImage />,
  },
  {
    title: 'Empty Dashboard',
    description: 'No dashboards available.',
    image: <EmptyDashboardImage />,
  },
  {
    title: 'Recents',
    description: 'No recent items found.',
    image: <UnionImage />,
  },
  {
    title: 'Empty Queries',
    description: 'No queries saved yet.',
    image: <EmptyQueriesImage />,
  },
];

export const Gallery = ({ containerColor, size }) => {
  const getComponentBySize = () => {
    switch (size) {
      case 'small':
        return EmptyStateSmall;
      case 'big':
        return EmptyStateBig;
      default:
        return EmptyStateMedium;
    }
  };

  const SelectedEmptyState = getComponentBySize();

  return (
    <Row gutter={[16, 16]}>
      {emptyStates.map((state, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={6}>
          <Card title={state.title} hoverable style={{ textAlign: 'center' }}>
            <div style={{ color: containerColor, padding: 16 }}>
              <SelectedEmptyState
                image={state.image}
                title={state.title}
                description={state.description}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

Gallery.args = {
  containerColor: 'white', // Default background color
  size: 'medium', // Default size
};
