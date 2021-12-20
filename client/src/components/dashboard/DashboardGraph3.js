import React, { useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

const DashboardGraph3 = ({ cat, showLabel, display, valueX, valueY, vms: { vms } }) => {

  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart3 = am4core.create("chartdiv3", am4charts.XYChart);

    let categoryAxis = chart3.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = cat;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
      categoryAxis.renderer.labels.template.disabled = display;

    let valueAxis = chart3.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

    let series = chart3.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = cat;
      series.dataFields.valueX = "uptime";
      series.name = "uptime";
      series.columns.template.tooltipText = "{tenant}: [bold]{valueX}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;
    
    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueX}";
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;
    
    let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
      categoryLabel.label.text = showLabel;
      categoryLabel.label.horizontalCenter = "right";
      categoryLabel.label.dx = -10;
      categoryLabel.label.fill = am4core.color("#fff");
      categoryLabel.label.hideOversized = false;
      categoryLabel.label.truncate = false;

    categoryAxis.sortBySeries = series;
    
    if (display === true) {
      chart3.data = vms.slice(0, 7);
    } else {
      chart3.data = vms;
    }

    chartRef.current = chart3;

    return () => {
        chart3.dispose();
      };
  }, [vms, display, showLabel, cat]);

  return (
    <div id="chartdiv3" style={{ width: valueX, height: valueY }}></div>
  );
}

DashboardGraph3.propTypes = {
  vms: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  vms: state.vms
});


export default connect(mapStateToProps, [])(DashboardGraph3);