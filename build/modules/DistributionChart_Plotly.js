'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ############################################################################
// DistributionChart                                                       View
// ############################################################################
// ############################################################################

var DistributionChart = function (_Chart) {
  _inherits(DistributionChart, _Chart);

  // ##########################################################################
  // PUBLIC MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Construct chart
  // ==========================================================================

  function DistributionChart(main, climateData) {
    _classCallCheck(this, DistributionChart);

    // ------------------------------------------------------------------------
    // Call super class for setting up the div container and climate data
    // ------------------------------------------------------------------------

    return _possibleConstructorReturn(this, (DistributionChart.__proto__ || Object.getPrototypeOf(DistributionChart)).call(this, main, 'distribution-chart', climateData));
  }

  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Init local members
  // ==========================================================================

  _createClass(DistributionChart, [{
    key: '_initMembers',
    value: function _initMembers() {
      var _this2 = this;

      // Graph node to be manipulated by Poltly
      this._graphD3 = null;

      // Has the chart heihgt been resized already?
      this._chartWasResized = false;

      // Initial switch state -> must be 0 !!!
      this._switchState = 0;

      // ------------------------------------------------------------------------
      // Create structure
      // dc = distribution chart
      // _wrapperDiv
      // |-> dc-container     // container for svg (why? because!)
      // |   |-> _chart       // main svg canvas contains charts, printed
      // _toolbar			        // buttons for changing/saving charts, not printed
      // |-> dc-switch        // switch optimal <-> fixed scale
      // |   |-> label        '.switch-light switch-candy'
      // |   |-> input        'dc-switch-input'
      // |   |-> div          'dc-switch-title'
      // |   |-> span         'dc-switch-options'
      // |   |   |-> span     'dc-switch-option-l'
      // |   |   |-> span     'dc-switch-option-r'
      // |   |   |-> a        'dc-switch-button'
      // ------------------------------------------------------------------------

      // Level 1@_chart - dc-container
      var dcContainer = this._domElementCreator.create('div', 'dc-container', ['js-plotly-plot', 'plotly']);
      this._chartWrapper[0].appendChild(dcContainer);

      // Level 2 - move original svg chart container in here
      var svgContainer = $('#' + this._chartMain.name);
      svgContainer.detach();
      dcContainer.appendChild(svgContainer[0]);

      // Level 1@_toolbar - dc-switch
      var dcSwitch = this._domElementCreator.create('div', 'dc-switch');
      this._toolbar.appendChild(dcSwitch);

      var switchLabel = this._domElementCreator.create('label', null, ['switch-light', 'switch-candy'], [['onClick', '']]);
      dcSwitch.appendChild(switchLabel);

      var switchInput = this._domElementCreator.create('input', 'dc-switch-input', null, [['type', 'checkbox']]);
      switchLabel.appendChild(switchInput);

      var switchTitle = this._domElementCreator.create('div', 'dc-switch-title');
      switchLabel.appendChild(switchTitle);

      var switchOptions = this._domElementCreator.create('span', 'dc-switch-options');
      switchLabel.appendChild(switchOptions);

      var switchOptionL = this._domElementCreator.create('span', 'dc-switch-option-l', ['dc-switch-option']);
      switchOptions.appendChild(switchOptionL);

      var switchOptionR = this._domElementCreator.create('span', 'dc-switch-option-r', ['dc-switch-option']);
      switchOptions.appendChild(switchOptionR);

      var switchButton = this._domElementCreator.create('a', 'dc-switch-button');
      switchOptions.appendChild(switchButton);

      // Save as members
      this._plotlyContainer = dcContainer;

      // ------------------------------------------------------------------------
      // Prepare data for plotly
      // ------------------------------------------------------------------------

      this._plotlyData = [];

      // For each plot
      for (var subPlIdx = 0; subPlIdx < this._chartMain.subplots.length; subPlIdx++) {
        // For each month
        for (var monthIdx = 0; monthIdx < MONTHS_IN_YEAR.length; monthIdx++) {
          this._plotlyData.push({
            xaxis: 'x' + (subPlIdx + 1),
            yaxis: 'y' + (subPlIdx + 1),
            y: this._climateData[this._chartMain.subplots[subPlIdx].data + "_long"][monthIdx],
            type: 'box',
            name: MONTHS_IN_YEAR[monthIdx],
            marker: {
              color: this._chartMain.subplots[subPlIdx].color
            }
          });
        }
      }

      // ------------------------------------------------------------------------
      // Prepare layouts for plotly
      // ------------------------------------------------------------------------

      this._layouts = {};

      // Fixed scale layout
      this._layouts.fixed = {
        showlegend: false,
        margin: {
          l: this._chartMain.margin.left,
          t: this._chartMain.margin.top,
          r: this._chartMain.margin.right,
          b: this._chartMain.margin.bottom,
          pad: this._chartsMain.padding
        },
        xaxis: {},
        yaxis: {},
        xaxis2: {},
        yaxis2: {}
      };

      // TODO: make axes private?
      var axes = [this._layouts.fixed.xaxis, this._layouts.fixed.yaxis, // temp
      this._layouts.fixed.xaxis2, this._layouts.fixed.yaxis2 // prec
      ];

      // Default style for all axes
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = axes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var axis = _step.value;

          axis.rangemode = 'normal';
          axis.fixedrange = true;
          axis.showgrid = true;
          axis.showline = true;
          axis.mirror = 'ticks';
          axis.linecolor = this._chartMain.style.lineColor;
          axis.linewidth = this._chartMain.style.lineWidth;
        }

        // Special style / content for axes
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      axes[0].title = this._chartMain.subplots[0].title;
      // Left part of the plot
      axes[0].domain = [0, 0.5 - this._chartMain.margin.separator / 100 / 2];
      axes[1].anchor = 'x1';
      axes[1].range = this._chartMain.subplots[0].maxRange;
      axes[1].autorange = false;

      axes[2].title = this._chartMain.subplots[1].title;
      // Right part of the plot
      axes[2].domain = [0.5 + this._chartMain.margin.separator / 100 / 2, 1];
      axes[3].anchor = 'x2';
      axes[3].range = this._chartMain.subplots[1].maxRange;
      axes[3].autorange = false;

      // Optimal layout: same as fixed layout, just with different range on y-axis
      this._layouts.automatic = JSON.parse(JSON.stringify(this._layouts.fixed));
      this._layouts.automatic.yaxis.autorange = true;
      this._layouts.automatic.yaxis2.autorange = true;
      this._layouts.automatic.yaxis.rangemode = this._chartMain.subplots[0].maxRange[0] < 0 ? 'normal' : 'nonnegative';
      this._layouts.automatic.yaxis2.rangemode = this._chartMain.subplots[1].maxRange[0] < 0 ? 'normal' : 'nonnegative';

      // Configuration options for plotly
      this._configOptions = {
        displayModeBar: false
      };

      // ------------------------------------------------------------------------
      // Label switch title and switch states
      // ------------------------------------------------------------------------

      switchTitle.innerHTML = this._chartMain.switch.title;
      switchOptionL.innerHTML = "" + this._chartMain.switch.states[0].charAt(0).toUpperCase() + this._chartMain.switch.states[0].slice(1);
      switchOptionR.innerHTML = "" + this._chartMain.switch.states[1].charAt(0).toUpperCase() + this._chartMain.switch.states[1].slice(1);

      // ------------------------------------------------------------------------
      // Interaction: click on toggle switch to change the layout
      // ------------------------------------------------------------------------

      $(switchOptions).click(function (e) {
        _this2._switchState = (_this2._switchState + 1) % 2;
        _this2._drawChart();
      });

      // ------------------------------------------------------------------------
      // Resize graph on window resize
      // -> this is the brute force method. It would be nicer to plot it only
      // once and then to resize it, but that did not work since I used subplots.
      // ------------------------------------------------------------------------

      $(window).resize(this._drawChart);
    }

    // ==========================================================================
    // Draw the whole chart
    // ==========================================================================

  }, {
    key: '_drawChart',
    value: function _drawChart() {
      var _this3 = this;

      // Cleanup graph

      // Get current layout
      var layout = null;
      Object.keys(this._layouts).forEach(function (key, index) {
        if (key == _this3._chartMain.switch.states[_this3._switchState]) layout = _this3._layouts[key];
      });

      // ------------------------------------------------------------------------
      // Hacky solution: manually moving plotly graph into "real" svg graph
      // It would be nicer to plot it only once and then to relayout it:
      // Plotly.relayout(this._graphD3, layout)
      // But that did not work since I used subplots.
      // ------------------------------------------------------------------------

      // First plot the graph into default container
      // Plotly.plot(
      //   this._plotlyContainer,
      //   this._plotlyData,
      //   layout,
      //   this._configOptions
      // )

      // Then move it into actual svg container

      // Finally clean the default container -> voilá!


      // ------------------------------------------------------------------------
      // Manually move / resize some elements
      // ------------------------------------------------------------------------

      // Move xaxis title on top of the plots
      $('.xtitle').attr('y', this._chartMain.plotTitleTop);
      $('.x2title').attr('y', this._chartMain.plotTitleTop);

      // Resize the chart, but only once
      if (!this._chartWasResized) {
        this._resizeChartHeight(30);
        this._chartWasResized = true;
      }
    }
  }]);

  return DistributionChart;
}(Chart);