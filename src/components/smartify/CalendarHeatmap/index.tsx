import { DataResponse, Dimension, Measure, Granularity } from '@embeddable.com/core';
import { Tooltip, Legend, Title, ChartData, PointElement } from 'chart.js';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React, { useState } from 'react';
import { format as formatDate } from 'date-fns';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';  // import default styles for the calendar
import formatValue from '../../util/format';
import formatDateTooltips from '../../util/formatDateTooltips';
import Container from '../../vanilla/Container';

type Props = {
  results: DataResponse;
  title?: string;
  description?: string;
  date: Dimension;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  dps?: number;
  metric: Measure;
  showLabels?: boolean;
  showLegend?: boolean;
  xAxisTitle?: string;
  granularity: Granularity;
};

type Record = { [p: string]: any };

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

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  //const [tooltip, setTooltip] = useState<{ dateLabel: string; countLabel: string; x: number; y: number } | null>(null);

  return (
    <Container {...restProps}>
      <div className="h-full relative font-embeddable text-sm flex flex-col" style={{ paddingBottom: '16px' }}>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        showMonthLabels={showMonthLabels}
        showWeekdayLabels={showWeekdayLabels}
        //options={chartOptions}
        // Compute CSS class for each value based on relative intensity (for color scale)
        classForValue={(value) => {
          if (!value || !value.date || value.count <= 0) {
            return 'color-empty';  // no data or zero count
          }
          const intensity = maxCount > 0 ? Math.ceil((value.count / maxCount) * 6) : 0;
          const level = Math.min(intensity, 6);  // level from 1 (lowest) to 6 (highest)
          return `color-scale-${level}`;
        }}
        transformDayElement={(element: any, value: any) => {
          // Wrap the element inside a <g> to reliably attach mouse events
          return (
            <g
              onMouseMove={(e) => {
                if (value?.date) {
                  const dateLabel = formatDate(value.date, 'dd/MM/yyyy');
                  const countLabel = formatValue(`${value.count}`, {
                    type: 'number',
                    dps,
                    meta: metric.meta
                  });
                  setTooltip({
                    text: `${dateLabel}: ${countLabel}`,
                    x: e.clientX + 10,
                    y: e.clientY + 10
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {element}
            </g>
          );
        }}
      />
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y * 0.15,
            left: tooltip.x * 0.91,
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          {tooltip.text}
        </div>
      )}
      </div>
    </Container>
  );
};

function chartOptions(props: Props, updatedData: Record[] | undefined) {
  const values = updatedData || [];

  return {
    tooltip: {
      // Provide tooltip content for CalendarHeatmap cells
      titleForValue: (value: any) => {
        if (!value || !value.date) return '';
        const dateLabel = formatValue(value.rawDate, { meta: props.date.meta });
        const countLabel = formatValue(`${value.count}`, {
          type: 'number',
          dps: props.dps,
          meta: props.metric.meta
        });
        return `${dateLabel}: ${countLabel}`;
      }
    },
    labels: props.showLabels
      ? values.map((v) => {
          const val = v[props.metric.name] || 0;
          return formatValue(val, {
            type: 'number',
            dps: props.dps,
            meta: props.metric.meta
          });
        })
      : [], // No labels if disabled
  };
}