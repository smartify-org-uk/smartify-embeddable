import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import React, { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';  // import default styles for the calendar
import formatValue from '../../util/format';
import Container from '../../vanilla/Container';

type Props = {
  results: DataResponse;
  title: string;
  description?: string;
  date: Dimension;            // date dimension (daily granularity)
  metric: Measure;            // metric to visualize (intensity of heatmap)
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  dps?: number;               // decimal places for formatting metric values
  enableDownloadAsCSV?: boolean;
  enableDownloadAsPNG?: boolean;
};

export default (props: Props) => {
  // Destructure props, with defaults for optional values
  const {
    results,
    date: dateDimension,
    metric,
    showMonthLabels = true,
    showWeekdayLabels = true,
    dps,
    ...restProps  // contains title, description, download options, etc.
  } = props;

  // Prepare data values for the heatmap (date and metric count for each record)
  const data = results?.data || [];
  const values = data.flatMap(record => {
    const rawDate = record[dateDimension.name];
    if (!rawDate) return [];  // skip if no date
    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) return [];  // skip invalid dates
    const count = parseFloat(record[metric.name]) || 0;
    return [{ date: dateObj, rawDate, count }];
  });

  // Determine the date range (startDate and endDate) based on the data
  let startDate = new Date();
  let endDate = new Date();
  if (values.length > 0) {
    const allDates = values.map(v => v.date);
    startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    endDate   = new Date(Math.max(...allDates.map(d => d.getTime())));
  }

  // Determine the maximum count (for computing color intensity scale)
  const maxCount = values.reduce((max, v) => (v.count > max ? v.count : max), 0);

  return (
    <Container {...restProps}>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        showMonthLabels={showMonthLabels}
        showWeekdayLabels={showWeekdayLabels}
        // Compute CSS class for each value based on relative intensity (for color scale)
        classForValue={(value) => {
          if (!value || !value.date || value.count <= 0) {
            return 'color-empty';  // no data or zero count
          }
          const intensity = maxCount > 0 ? Math.ceil((value.count / maxCount) * 4) : 0;
          const level = Math.min(intensity, 4);  // level from 1 (lowest) to 4 (highest)
          return `color-scale-${level}`;
        }}
        // Set tooltip text for each day (using title attribute on SVG <rect>)
        titleForValue={(value) => {
          if (!value || !value.date) return '';
          const dateLabel = formatValue(value.rawDate, { meta: dateDimension.meta });
          const countLabel = formatValue(`${value.count}`, {
            type: 'number',
            dps: dps,
            meta: metric.meta
          });
          return `${dateLabel}: ${countLabel}`;
        }}
        // No onClick handler (interactive click disabled as per requirements)
      />
    </Container>
  );
};