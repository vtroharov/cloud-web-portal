import React, { useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

const DashboardGraph4 = ({ cat, showLabel, display, valueX, valueY, vms: { vms } }) => {

  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart4 = am4core.create("chartdiv4", am4charts.XYChart);

    let categoryAxis = chart4.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = cat;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
      categoryAxis.renderer.labels.template.disabled = display;

    let valueAxis = chart4.xAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;

    function createSeries(field, name) {
      let series = chart4.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = cat;
        series.dataFields.valueX = field;
        series.name = name;
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
    }

    createSeries("commited_space", "Commited");
    createSeries("uncommited_space", "Uncommited");

    if (display === true) {
      chart4.data = vms.slice(0, 5);
    } else {
      chart4.data = vms;
      chart4.legend = new am4charts.Legend();
      chart4.legend.useDefaultMarker = true;
      chart4.legend.position = "top";
      var marker = chart4.legend.markers.template.children.getIndex(0);
        marker.cornerRadius(12, 12, 12, 12);
        marker.strokeWidth = 2;
        marker.strokeOpacity = 1;
        marker.stroke = am4core.color("#ccc");
    }

    chartRef.current = chart4;

    return () => {
        chart4.dispose();
      };
  }, [vms, display, showLabel, cat]);

  return (
    <div id="chartdiv4" style={{ width: valueX, height: valueY }}></div>
  );
}

DashboardGraph4.propTypes = {
  vms: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  vms: state.vms
});


export default connect(mapStateToProps, [])(DashboardGraph4);