import React, { useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

const DashboardGraph1 = ({ cat, showLabel, display, valueX, valueY, vms: { vms } }) => {

  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart1 = am4core.create("chartdiv1", am4charts.XYChart);

    let categoryAxis = chart1.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = cat;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
      categoryAxis.renderer.labels.template.disabled = display;

    let valueAxis = chart1.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

    let series = chart1.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = cat;
      series.dataFields.valueX = "num_cpu";
      series.name = "cpu";
      series.columns.template.tooltipText = "{tenant}: [bold]{valueX}[/]";
      series.columns.template.height = am4core.percent(100);
      series.sequencedInterpolation = true;
    
    let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      (valueLabel.label.text = "{valueX}").slice(0,12);
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
      chart1.data = vms.slice(0, 7);
    } else {
      chart1.data = vms;
    }

    chartRef.current = chart1;

    return () => {
        chart1.dispose();
      };
  }, [vms, display, showLabel, cat]);

  return (
    <div id="chartdiv1" style={{ width: valueX, height: valueY }}></div>
  );
  
}

DashboardGraph1.propTypes = {
  vms: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  vms: state.vms
});


export default connect(mapStateToProps, [])(DashboardGraph1);