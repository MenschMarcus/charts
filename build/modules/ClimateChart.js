'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClimateChart = function (_Chart) {
  _inherits(ClimateChart, _Chart);

  function ClimateChart(main, climateData) {
    _classCallCheck(this, ClimateChart);

    // ------------------------------------------------------------------------
    // Call super class for setting up the div container and climate data
    // ------------------------------------------------------------------------
    return _possibleConstructorReturn(this, (ClimateChart.__proto__ || Object.getPrototypeOf(ClimateChart)).call(this, main, 'climate-chart', climateData));
  }

  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Init local members
  // ==========================================================================

  _createClass(ClimateChart, [{
    key: '_initMembers',
    value: function _initMembers() {
      // ------------------------------------------------------------------------
      // Preparation: Position values for visualization elements
      // ------------------------------------------------------------------------

      // Position values of actual climate chart
      // Pos from top, bottom, left, right and position of horizontal break bar
      this._chartPos = {
        left: 0 + this._mainPos.left + this._chartsMain.padding + this._chartMain.margin.left,
        top: 0 + this._mainPos.top + this._chartsMain.padding + this._chartMain.margin.top,
        right: 0 + this._mainPos.left + Math.round(this._mainPos.width * this._chartMain.widthRatio) - this._chartsMain.padding - this._chartMain.margin.right,
        bottom: 0 + this._mainPos.bottom - this._chartsMain.padding - this._chartMain.margin.bottom
      };
      this._chartPos.break = this._chartPos.top;
      this._chartPos.width = this._chartPos.right - this._chartPos.left;
      this._chartPos.height = this._chartPos.bottom - this._chartPos.top;

      // Position values of table next to climate chart
      this._tablePos = {
        left: 0 + this._mainPos.left + Math.round(this._mainPos.width * this._chartMain.widthRatio) + this._chartsMain.padding,
        top: 0 + this._mainPos.top + this._chartsMain.padding,
        right: 0 + this._mainPos.right - this._chartsMain.padding,
        bottom: 0 + this._mainPos.bottom - this._chartsMain.padding
      };
      this._tablePos.width = this._tablePos.right - this._tablePos.left;
      this._tablePos.height = this._tablePos.bottom - this._tablePos.top;
    }

    // ========================================================================
    // Draw the whole chart
    // - left side: diagram
    //    * axes + ticks
    //    * grids
    //    * lines and areas for temp and prec
    //    * caption for temp and prec
    // - right side: table
    // ========================================================================

  }, {
    key: '_drawChart',
    value: function _drawChart() {
      var _this2 = this;

      // ------------------------------------------------------------------------
      // Setup axes (1 x-axis, 2 y-axes for prec and temp and ticks)
      // ------------------------------------------------------------------------

      // Ticks for the y-axis: markers next to the axis showing the values
      // four representative points:
      // min:   Tick showing the absolute minimum value (optional)
      // zero:  Tick showing 0 (always at same position)
      // break: Tick at the break value (100 mm prec / 50 °C)
      // max:   Tick at the maximum prec value (optional)
      // -> temp ticks are between min and break value (no emp > 50 °C)
      // -> prec ticks are divided in two sections:
      //      humid zone between zero and break
      //      perhumid zone between break and max

      var ticks = {
        temp: {
          min: null,
          zero: null,
          break: null,
          max: null,
          values: {
            belowBreak: [],
            aboveBreak: []
          }
        },
        prec: {
          min: null,
          zero: null,
          break: null,
          max: null,
          values: {
            belowBreak: [],
            aboveBreak: []
          }
        }
      };

      // Status variable: is there a break value at which the chart
      // switches between the humid and the perhumid zone?
      var breakExists = false;

      // Defs contains the paths that are later used for clipping the areas
      // between the temperature and precipitation lines.
      var defs = this._chart.append('defs');

      // ------------------------------------------------------------------------
      // Determine characteristic positions for temp and prec scale
      // (min, zero, break, max)
      // ------------------------------------------------------------------------

      // Scale ratios (below break): scale temp <-> scale prec => should be 2
      var scaleRatiobelowBreak = this._chartMain.prec.distBelowBreak / this._chartMain.temp.dist;

      // 1) zero: (0 for both)
      ticks.temp.zero = 0;
      ticks.prec.zero = 0;

      // 2) min:
      // Temp: either (minimum value floored to multiples of 10 °C) or (0 °C)
      // -> avoid min temp above 0°C
      ticks.temp.min = Math.min(0, Math.floor(this._climateData.extreme.minTemp / this._chartMain.temp.dist) * this._chartMain.temp.dist);

      // Prec: If there are negative temp values, the zeropoints of both y axes
      // must be in alignment => adapt
      ticks.prec.min = ticks.temp.min * scaleRatiobelowBreak;

      // 3) break: breakValue for prec, in ratio for temp
      ticks.prec.break = this._chartMain.prec.breakValue;
      ticks.temp.break = ticks.prec.break / scaleRatiobelowBreak;

      // 4) max:
      // If prec exceeds the break line
      if (this._climateData.extreme.maxPrec > ticks.prec.break) {
        // Status: yes, break value exists
        breakExists = true;

        // Preparation
        var breakValue = this._chartMain.prec.breakValue;
        var precDistAbove = this._chartMain.prec.distAboveBreak;
        var maxPrec = this._climateData.extreme.maxPrec;
        var tempDist = this._chartMain.temp.dist;
        var maxTemp = ticks.temp.break;

        // Calculate max prec tick: Ceiled to distance above break line (200)
        // shifted by breakValue (100)
        ticks.prec.max = Math.ceil((maxPrec - breakValue) / precDistAbove) * precDistAbove + breakValue;

        // Calculate max temp tick
        ticks.temp.max = (ticks.prec.max - breakValue) / precDistAbove * tempDist + maxTemp;
      }

      // If prec does not exceed the break line, it is also the max line
      else {
          ticks.prec.max = ticks.prec.break;
          ticks.temp.max = ticks.temp.break;
        }

      // ------------------------------------------------------------------------
      // Fill up tick values
      // ------------------------------------------------------------------------

      // Temp below break: all from min to break value
      for (var tickValue = ticks.temp.min; tickValue <= ticks.temp.break; tickValue += this._chartMain.temp.dist) {
        ticks.temp.values.belowBreak.push(tickValue);
      } // Temp above break: non-existing

      // Prec below break: all from zero to break value
      for (var _tickValue = ticks.prec.zero; _tickValue <= ticks.prec.break; _tickValue += this._chartMain.prec.distBelowBreak) {
        ticks.prec.values.belowBreak.push(_tickValue);
      } // Prec above break: all from first after break to max
      // -> do not include the one at the break value since it already exists
      // in the tick values from below the break value
      for (var _tickValue2 = ticks.prec.break + this._chartMain.prec.distAboveBreak; _tickValue2 <= ticks.prec.max; _tickValue2 += this._chartMain.prec.distAboveBreak) {
        ticks.prec.values.aboveBreak.push(_tickValue2);
      } // ------------------------------------------------------------------------
      // Adapt chart size if there are values above break line
      // ------------------------------------------------------------------------

      // Absolute shift upwards for ticks above break [px] =
      //  Distance between two ticks below break [px / tick] *
      //  Number of ticks above break line [px]

      var numPxBelowBreak = this._chartPos.bottom - this._chartPos.break;
      var numTicksBelowBreak = ticks.temp.values.belowBreak.length;
      var numTicksAboveBreak = ticks.prec.values.aboveBreak.length;

      // problem: If there are ticks above the break line, one is omitted
      // to prevent duplicate tick at break line => add 1 to get correct number
      if (numTicksAboveBreak > 0) numTicksAboveBreak += 1;

      var shiftUpAboveBreak = numTicksAboveBreak * numPxBelowBreak / numTicksBelowBreak;

      // Change the total height of the chart
      this._resizeChartHeight(shiftUpAboveBreak);

      // x-Axis

      var xScale = d3.scale.ordinal().domain(MONTHS_IN_YEAR).range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).rangePoints([this._chartPos.left, this._chartPos.right], 0);

      var xAxis = d3.svg.axis().scale(xScale).tickSize(this._chartMain.chart.tickSize).tickSubdivide(true).tickPadding(5);

      this._chart.append('svg:g').attr('class', 'x axis').attr('transform', 'translate(' + 0 + ', ' + this._chartPos.bottom + ')').call(xAxis);

      // y-Axis left: temperature (below break value)

      var yScaleTempBelowBreak = d3.scale.linear().domain([ticks.temp.min, ticks.temp.break]).range([this._chartPos.bottom, this._chartPos.break]);

      var yAxisTempBelowBreak = d3.svg.axis().scale(yScaleTempBelowBreak).tickValues(ticks.temp.values.belowBreak).tickSize(this._chartMain.chart.tickSize).orient('left');

      this._chart.append('svg:g').attr('class', 'y axis').attr('transform', 'translate(' + this._chartPos.left + ',' + 0 + ')').call(yAxisTempBelowBreak).style('fill', this._chartsMain.colors.temp);

      // y-Axis left: temperature (above break value)
      // -> no ticks, because there are no values above 50 °C

      var yScaleTempAboveBreak = d3.scale.linear().domain([ticks.temp.break, ticks.temp.max]).range([this._chartPos.top, this._chartPos.break]);

      var yAxisTempAboveBreak = d3.svg.axis().scale(yScaleTempAboveBreak).tickValues(ticks.temp.values.aboveBreak).tickSize(this._chartMain.chart.tickSize).orient('left');

      this._chart.append('svg:g').attr('class', 'y axis').attr('transform', 'translate(' + this._chartPos.left + ',' + 0 + ')').call(yAxisTempAboveBreak).style('fill', this._chartsMain.colors.temp);

      // y-Axis right: precipitation (below break value)

      var yScalePrecBelowBreak = d3.scale.linear().domain([ticks.prec.min, ticks.prec.break]).range([this._chartPos.bottom, this._chartPos.break]);

      var yAxisPrecBelowBreak = d3.svg.axis().scale(yScalePrecBelowBreak).tickValues(ticks.prec.values.belowBreak).tickSize(this._chartMain.chart.tickSize).orient('right');

      this._chart.append('svg:g').attr('class', 'y axis').attr('transform', 'translate(' + this._chartPos.right + ', ' + 0 + ')').call(yAxisPrecBelowBreak).style('fill', this._chartsMain.colors.prec);

      // y-Axis right: precipitation (above break value)

      var yScalePrecAboveBreak = d3.scale.linear().domain([ticks.prec.break, ticks.prec.max]).range([this._chartPos.break, this._chartPos.top]);

      var yAxisPrecAboveBreak = d3.svg.axis().scale(yScalePrecAboveBreak).tickValues(ticks.prec.values.aboveBreak).tickSize(this._chartMain.chart.tickSize).orient('right');

      this._chart.append('svg:g').attr('class', 'y axis').attr('transform', 'translate(' + this._chartPos.right + ', ' + 0 + ')').call(yAxisPrecAboveBreak).style('fill', this._chartsMain.colors.prec);

      // Description of axes: units
      // TODO: fix deg sign

      this._chart.append('text').attr('class', 'tick').attr('text-anchor', 'start').attr('x', this._chartPos.left).attr('y', this._chartPos.top - 10).attr('fill', this._chartsMain.colors.temp).text('[' + this._chartMain.temp.unit + ']');

      this._chart.append('text').attr('class', 'tick').attr('text-anchor', 'end').attr('x', this._chartPos.right).attr('y', this._chartPos.top - 10).attr('fill', this._chartsMain.colors.prec).text('[' + this._chartMain.prec.unit + ']');

      // Styling for all axes and ticks

      this._chart.selectAll('.axis .domain').style('fill', 'none').style('stroke', 'black').style('stroke-width', this._chartMain.chart.axesWidth + 'px').attr('shape-rendering', 'crispEdges');

      this._chart.selectAll('.tick').style('font-size', this._chartMain.fontSizes.tick);

      // ------------------------------------------------------------------------
      // Grid lines
      // concept: one line with one tick per value. The size of the tick is the
      // width / height of the chart => tick stretches all the way through the
      // chart and therefore serves as grid.
      // ------------------------------------------------------------------------

      // Grid in x-direction

      var xGrid = d3.svg.axis().scale(xScale).tickSize(this._chartPos.top - this._chartPos.bottom).tickSubdivide(true).tickPadding(5).tickFormat('');

      this._chart.append('svg:g').attr('class', 'grid').attr('transform', 'translate(' + '0,' + this._chartPos.bottom + ')').call(xGrid);

      // Grid in y-direction (below break line)

      var yGridBelowBreak = d3.svg.axis().scale(yScaleTempBelowBreak).tickValues(ticks.temp.values.belowBreak).tickSize(-this._chartPos.width).orient('left').tickFormat('');

      this._chart.append('svg:g').attr('class', 'grid').attr('transform', 'translate(' + this._chartPos.left + ',0)').call(yGridBelowBreak);

      // Grid in y-direction (above break line)

      if (breakExists) {
        var yGridAboveBreak = d3.svg.axis().scale(yScalePrecAboveBreak).tickValues(ticks.prec.values.aboveBreak).tickSize(-this._chartPos.width).orient('left').tickFormat('');

        this._chart.append('svg:g').attr('class', 'grid').attr('transform', 'translate(' + this._chartPos.left + ',0)').call(yGridAboveBreak);
      }

      // Styling
      this._chart.selectAll('.grid').style('fill', 'none').style('stroke', this._chartsMain.colors.grid).style('stroke-width', this._chartMain.chart.gridWidth + ' px').attr('shape-rendering', 'crispEdges');

      // ------------------------------------------------------------------------
      // Lines for temp and prec
      // ------------------------------------------------------------------------

      // Temperature line

      var lineTemp = d3.svg.line().x(function (d) {
        return xScale(d.month);
      }).y(function (d) {
        return yScaleTempBelowBreak(d.temp);
      }).interpolate('linear');

      this._chart.append('svg:path').attr('class', 'line').attr('d', lineTemp(this._climateData.monthly_short)).attr('fill', 'none').attr('stroke', this._chartsMain.colors.temp).attr('stroke-width', this._chartMain.chart.lineWidth);

      // Precipitation line below break

      var linePrecBelowBreak = d3.svg.line().x(function (d) {
        return xScale(d.month);
      }).y(function (d) {
        return yScalePrecBelowBreak(d.prec);
      }).interpolate('linear');

      this._chart.append('svg:path').attr('class', 'line').attr('d', linePrecBelowBreak(this._climateData.monthly_short)).attr('clip-path', 'url(#rect-bottom)').attr('fill', 'none').attr('stroke', this._chartsMain.colors.prec).attr('stroke-width', this._chartMain.chart.lineWidth);

      // Precipitation line abovebreak

      if (breakExists) {
        var linePrecAboveBreak = d3.svg.line().x(function (d) {
          return xScale(d.month);
        }).y(function (d) {
          return yScalePrecAboveBreak(d.prec);
        }).interpolate('linear');

        this._chart.append('svg:path').attr('class', 'line').attr('d', linePrecAboveBreak(this._climateData.monthly_short)).attr('clip-path', 'url(#rect-top)').attr('fill', 'none').attr('stroke', this._chartsMain.colors.prec).attr('stroke-width', this._chartMain.chart.lineWidth);
      }

      // ------------------------------------------------------------------------
      // Areas showing temp and prec
      // ------------------------------------------------------------------------

      // Area below temperature line

      var areaTemp = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(function (d) {
        return yScaleTempBelowBreak(d.temp);
      }).y1(this._chartPos.bottom).interpolate('linear');

      this._chart.append('path').data(this._climateData.monthly_short).attr('class', 'area').attr('d', areaTemp(this._climateData.monthly_short)).attr('clip-path', 'url(#clip-prec)').attr('fill', this._chartsMain.colors.arid).attr('stroke', 'none');

      // Area below precipitation line

      var areaPrecBelowBreak = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(function (d) {
        return yScalePrecBelowBreak(d.prec);
      }).y1(this._chartPos.bottom).interpolate('linear');

      this._chart.append('path').data(this._climateData.monthly_short).attr('class', 'area').attr('d', areaPrecBelowBreak(this._climateData.monthly_short)).attr('clip-path', 'url(#clip-temp)').attr('fill', this._chartsMain.colors.humid).attr('stroke', 'none');

      var areaPrecAboveBreak = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(function (d) {
        return yScalePrecAboveBreak(d.prec);
      }).y1(this._chartPos.break).interpolate('linear');

      this._chart.append('path').data(this._climateData.monthly_short).attr('class', 'area').attr('d', areaPrecAboveBreak(this._climateData.monthly_short)).attr('clip-path', 'url(#clip-temp2)').attr('fill', this._chartsMain.colors.perhumid).attr('stroke', 'none');

      // Areas functioning as clipping paths
      // -> Clip the areas defined above
      // -> Make the relevant parts for the climate chart visible

      var areaTempTo100 = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(function (d) {
        return yScaleTempBelowBreak(d.temp);
      }).y1(this._chartPos.break).interpolate('linear');

      defs.append('clipPath').attr('id', 'clip-temp').append('path').attr('d', areaTempTo100(this._climateData.monthly_short));

      var area100ToMax = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(yScalePrecAboveBreak(this._chartMain.prec.breakValue)).y1(0).interpolate('linear');

      defs.append('clipPath').attr('id', 'clip-temp2').append('path').attr('d', area100ToMax(this._climateData.monthly_short));

      var areaAbovePrec = d3.svg.area().x(function (d) {
        return xScale(d.month);
      }).y0(function (d) {
        return yScalePrecBelowBreak(d.prec);
      }).y1(this._chartPos.break).interpolate('linear');

      defs.append('clipPath').attr('id', 'clip-prec').append('path').attr('d', areaAbovePrec(this._climateData.monthly_short));

      // Cover overlapping prec lines resulting from break value

      if (breakExists) {
        defs.append('clipPath').attr('id', 'rect-bottom').append('rect').attr('x', this._chartPos.left).attr('y', this._chartPos.break).attr('width', this._chartPos.width).attr('height', this._chartPos.break - this._chartPos.top);

        defs.append('clipPath').attr('id', 'rect-top').append('rect').attr('x', this._chartPos.left).attr('y', this._chartPos.top).attr('width', this._chartPos.width).attr('height', this._chartPos.break - this._chartPos.top);
      }

      // Styling

      this._chart.selectAll('.area').style('opacity', this._chartMain.chart.areaOpacity);

      // ------------------------------------------------------------------------
      // Caption: prec sum and temp mean
      // ------------------------------------------------------------------------

      // TODO: x and y-position a bit less hacky ;)
      this._chart.append('text').attr('class', 'info').attr('x', 0 + this._chartPos.left + this._chartPos.width / 2 - 10 - this._chartsMain.padding * 2).attr('y', this._chartPos.bottom + 60).attr('text-anchor', 'end').text('' + this._chartMain.temp.caption + ': ' + this._climateData.temp_mean + ' ' + this._chartMain.temp.unit);

      this._chart.append('text').attr('class', 'info').attr('x', 0 + this._chartPos.left + this._chartPos.width / 2 - 10 + this._chartsMain.padding * 2).attr('y', this._chartPos.bottom + 60).attr('text-anchor', 'begin').text('' + this._chartMain.prec.caption + ': ' + this._climateData.prec_sum + ' ' + this._chartMain.prec.unit);

      // ------------------------------------------------------------------------
      // Data Table
      // ------------------------------------------------------------------------

      // Y-domain: 1 heading + 12 months = 13
      var yDomain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

      // X-Positions: col 1-3, separators between 1|2 and 2|3
      var xPos = [];
      for (var idx = 1; idx <= 6; idx++) {
        xPos.push(0 + this._tablePos.left + this._chartsMain.padding + this._tablePos.width * idx / 6);
      }

      // X-direction (Month | Temp | Prec)

      var xScaleTable = d3.scale.ordinal().domain([0, 1, 2, 3]).range([0, 1, 2, 3]).rangePoints([this._tablePos.left, this._tablePos.right], 0);

      // Y-direction (Jan .. Dec)

      var yScaleTable = d3.scale.ordinal().domain(yDomain).range([this._tablePos.top, this._tablePos.bottom]).rangePoints([this._tablePos.top, this._tablePos.bottom], 0);

      // Vertical column separators
      this._chart.append('line').attr('x1', xPos[1]).attr('y1', this._tablePos.top - this._chartMain.table.margin.top).attr('x2', xPos[1]).attr('y2', this._tablePos.bottom).attr('shape-rendering', 'crispEdges').style('stroke', this._chartsMain.colors.grid);

      this._chart.append('line').attr('x1', xPos[3]).attr('y1', this._tablePos.top - this._chartMain.table.margin.top).attr('x2', xPos[3]).attr('y2', this._tablePos.bottom).attr('shape-rendering', 'crispEdges').style('stroke', this._chartsMain.colors.grid);

      // Headings

      this._chart.append('text').attr('class', 'info').attr('x', xPos[0]).attr('y', this._tablePos.top).attr('text-anchor', 'middle').text(this._chartMain.table.heading.month);

      this._chart.append('text').attr('class', 'info').attr('x', xPos[2]).attr('y', this._tablePos.top).attr('text-anchor', 'middle').text(this._chartMain.table.heading.temp);

      this._chart.append('text').attr('class', 'info').attr('x', xPos[4]).attr('y', this._tablePos.top).attr('text-anchor', 'middle').text(this._chartMain.table.heading.prec);

      this._chart.selectAll('.info').attr('font-weight', 'normal').style('font-size', this._chartMain.fontSizes.info + 'px');

      // Cell values: month
      this._chart.append('text').attr('class', 'info').attr('y', this._tablePos.top).attr('text-anchor', 'start').call(this._fillColumn, this._climateData.monthly_short, this._tablePos.top, this._tablePos.height / MONTHS_IN_YEAR.length, 'month', xPos[0] - this._chartMain.table.margin.left);

      // Cell values: temp
      this._chart.append('text').attr('class', 'info').attr('y', this._tablePos.top).attr('text-anchor', 'end').call(this._fillColumn, this._climateData.monthly_short, this._tablePos.top, this._tablePos.height / MONTHS_IN_YEAR.length, 'temp', xPos[3] - this._chartMain.table.margin.right);

      // Cell values: prec
      this._chart.append('text').attr('class', 'info').attr('y', this._tablePos.top).attr('text-anchor', 'end').call(this._fillColumn, this._climateData.monthly_short, this._tablePos.top, this._tablePos.height / MONTHS_IN_YEAR.length, 'prec', xPos[5] - this._chartMain.table.margin.right);

      // Style for cell values
      this._chart.selectAll('.cell').style('font-size', this._chartMain.fontSizes.table + 'px');

      // ------------------------------------------------------------------------
      // Interaction: Mouseover effect
      // ------------------------------------------------------------------------

      this._chart.append('g').attr('class', 'focus').attr('visibility', 'hidden');

      this._chart.select('.focus').append('circle').attr('id', 'c1').attr('r', this._chartMain.mouseover.circleRadius).attr('fill', 'white').attr('stroke', this._chartsMain.colors.temp).style('stroke-width', this._chartMain.mouseover.strokeWidth);

      this._chart.select('.focus').append('circle').attr('id', 'c2').attr('r', this._chartMain.mouseover.circleRadius).attr('fill', 'white').attr('stroke', this._chartsMain.colors.prec).style('stroke-width', this._chartMain.mouseover.strokeWidth);

      // Event handling

      this._chartWrapper.mouseover(function (e) {
        _this2._chart.select('.focus').attr('visibility', 'visible');
      });

      this._chartWrapper.mouseout(function (e) {
        _this2._chart.select('.focus').attr('visibility', 'hidden');

        _this2._chart.selectAll('.cell').attr('fill', 'black').attr('font-weight', 'normal').style('font-size', _this2._chartMain.fontSizes.table).style('text-shadow', 'none');
      });

      this._chartWrapper.mousemove(function (e) {
        // Get click position inside svg canvas
        var svg = _this2._chart[0][0];
        var clickPtReal = svg.createSVGPoint();
        clickPtReal.x = e.clientX;
        clickPtReal.y = e.clientY;
        var clickPtSVG = clickPtReal.matrixTransform(svg.getScreenCTM().inverse());

        // Calculate closest distance between mouse position and tick
        var posX = clickPtSVG.x;
        var lowDiff = 1e99;
        var xI = null;
        var tickPos = xScale.range();

        for (var i = 0; i < tickPos.length; i++) {
          var diff = Math.abs(posX - tickPos[i]);
          if (diff < lowDiff) {
            lowDiff = diff;
            xI = i;
          }
        }

        var c1 = _this2._chart.select('#c1');
        var c2 = _this2._chart.select('#c2');
        var month = _this2._chart.select('#month_c' + xI);
        var temp = _this2._chart.select('#temp_c' + xI);
        var prec = _this2._chart.select('#prec_c' + xI);
        var rows = _this2._chart.selectAll('.cell');

        // Highlight closest month in chart and table
        rows.attr('fill', 'black').attr('font-weight', 'normal').style('text-shadow', 'none');
        month.style('text-shadow', '1px 1px 2px gray').attr('font-weight', 'bold');
        temp.attr('fill', _this2._chartsMain.colors.temp).attr('font-weight', 'bold').style('text-shadow', '1px 2px 2px gray');
        prec.attr('fill', _this2._chartsMain.colors.prec).attr('font-weight', 'bold').style('text-shadow', '2px 2px 2px gray');

        c1.attr('transform', 'translate(' + tickPos[xI] + ',' + yScaleTempBelowBreak(_this2._climateData.monthly_short[xI].temp) + ')');

        if (_this2._climateData.monthly_short[xI].prec <= _this2._chartMain.prec.breakValue) {
          c2.attr('transform', 'translate(' + tickPos[xI] + ',' + yScalePrecBelowBreak(_this2._climateData.monthly_short[xI].prec) + ')');
        }
        if (_this2._climateData.monthly_short[xI].prec > _this2._chartMain.prec.breakValue) {
          c2.attr('transform', 'translate(' + tickPos[xI] + ',' + yScalePrecAboveBreak(_this2._climateData.monthly_short[xI].prec) + ')');
        }
      });
    }

    // ========================================================================
    // Helper function: Resize the height of the chart by x px
    // ========================================================================

  }, {
    key: '_resizeChartHeight',
    value: function _resizeChartHeight(shiftUp) {
      // Resize whole container and footer
      _get(ClimateChart.prototype.__proto__ || Object.getPrototypeOf(ClimateChart.prototype), '_resizeChartHeight', this).call(this, shiftUp);

      // Resize model:
      this._chartPos.break += shiftUp;
      this._chartPos.bottom += shiftUp;
    }

    // ========================================================================
    // Helper function: fill the columns of the data table
    // ========================================================================

  }, {
    key: '_fillColumn',
    value: function _fillColumn(col, data, tableOffset, tableHeight, column, x) {
      for (var i = 0; i < MONTHS_IN_YEAR.length; i++) {
        var obj = data[i];

        for (var key in obj) {
          if (key === column) {
            var text = obj[key];
            if (typeof obj[key] === 'number') text = obj[key].toFixed(1);

            col.append('tspan').attr('id', column + '_c' + i).attr('class', 'cell').attr('x', x).attr('y', tableHeight * (i + 1) + tableOffset).style('text-align', 'right').text(text);
          }
        }
      }
    }
  }]);

  return ClimateChart;
}(Chart);