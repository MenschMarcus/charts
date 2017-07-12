"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ############################################################################
// AvailabilityChart                                                       View
// ############################################################################
// ############################################################################

var AvailabilityChart = function (_Chart) {
  _inherits(AvailabilityChart, _Chart);

  // ##########################################################################
  // PUBLIC MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Construct chart
  // ==========================================================================

  function AvailabilityChart(main, climateData) {
    _classCallCheck(this, AvailabilityChart);

    // ------------------------------------------------------------------------
    // Call super class for setting up the div container and climate data
    // ------------------------------------------------------------------------

    return _possibleConstructorReturn(this, (AvailabilityChart.__proto__ || Object.getPrototypeOf(AvailabilityChart)).call(this, main, 'availability-chart', climateData));
  }

  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Init local members
  // ==========================================================================

  _createClass(AvailabilityChart, [{
    key: "_initMembers",
    value: function _initMembers() {
      // ------------------------------------------------------------------------
      // Preparation: Position values for visualization elements
      // ------------------------------------------------------------------------

      // Position values of actual climate chart
      // Pos from top, bottom, left, right and position of horizontal break bar
      this._chartPos = {
        left: 0 + this._mainPos.left + this._chartsMain.padding + this._chartMain.margin.left,
        top: 0 + this._mainPos.top + this._chartsMain.padding + this._chartMain.margin.top,
        right: 0 + this._mainPos.right - this._chartsMain.padding - this._chartMain.margin.right,
        bottom: 0 + this._mainPos.bottom - this._chartsMain.padding - this._chartMain.margin.bottom
      };
      this._chartPos.width = this._chartPos.right - this._chartPos.left;
      this._chartPos.height = this._chartPos.bottom - this._chartPos.top;
    }

    // ==========================================================================
    // Draw the whole chart
    // ==========================================================================

  }, {
    key: "_drawChart",
    value: function _drawChart() {
      // ------------------------------------------------------------------------
      // Setup grid
      // ------------------------------------------------------------------------

      var gridData = new Array();
      var xPos = this._chartPos.left;
      var yPos = this._chartPos.top;
      var width = this._chartPos.width / (MONTHS_IN_YEAR.length * 2);
      var color = this._chartsMain.colors.grid;

      // Iterate for rows
      for (var _row = 0; _row < 10; _row++) {
        gridData.push(new Array());

        // Iterate for cells/columns inside rows
        for (var _column = 0; _column < MONTHS_IN_YEAR.length * 2; _column++) {
          gridData[_row].push({
            x: xPos,
            y: yPos,
            width: width,
            height: width,
            color: color
          });
          // Increment the x position. I.e. move it over by 50 (width variable)
          xPos += width;
        }
        // Reset the x position after a row is complete
        xPos = this._chartPos.left;
        // Increment the y position for the next row. Move it down 50 (height variable)
        yPos += width;
      }

      var row = this._chart.selectAll(".row").data(gridData).enter().append("g").attr("class", "row");

      var column = row.selectAll(".square").data(function (d) {
        return d;
      }).enter().append("rect").attr("class", "grid").attr("x", function (d) {
        return d.x;
      }).attr("y", function (d) {
        return d.y;
      }).attr("width", function (d) {
        return d.width;
      }).attr("height", function (d) {
        return d.height;
      }).style("fill", function (d) {
        return d.value;
      });

      this._chart.selectAll('.grid').style('fill', 'none').style('stroke', this._chartsMain.colors.grid).style('stroke-width', this._chartMain.style.gridWidth + ' px').attr('shape-rendering', 'crispEdges');

      // ------------------------------------------------------------------------
      // Table heading
      // ------------------------------------------------------------------------


      // ------------------------------------------------------------------------
      // 1st column: year
      // ------------------------------------------------------------------------


      // ------------------------------------------------------------------------
      // Fill remaning data cells
      // ------------------------------------------------------------------------
    }

    // ==========================================================================
    // Create grid
    // ==========================================================================


  }]);

  return AvailabilityChart;
}(Chart);