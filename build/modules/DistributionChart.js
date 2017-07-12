'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// ############################################################################
// DistributionChart                                                       View
// ############################################################################
// Credits to: Mike Bostock
// https://bl.ocks.org/mbostock/4061502
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

      // Initial switch state -> must be 0 !!!
      this._switchState = 0;

      // ------------------------------------------------------------------------
      // Create structure
      // dc = distribution chart
      // _wrapperDiv
      // |-> _chart         // main svg canvas contains charts, printed
      // _toolbar			      // buttons for changing/saving charts, not printed
      // |-> dc-switch      // switch optimal <-> fixed scale
      // |   |-> label      '.switch-light switch-candy'
      // |   |-> input      'dc-switch-input'
      // |   |-> div        'dc-switch-title'
      // |   |-> span       'dc-switch-options'
      // |   |   |-> span   'dc-switch-option-l'
      // |   |   |-> span   'dc-switch-option-r'
      // |   |   |-> a      'dc-switch-button'
      // ------------------------------------------------------------------------

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

      // ------------------------------------------------------------------------
      // Prepare data for plotly
      // ------------------------------------------------------------------------

      this._data = [];

      // For each plot
      for (var subPlIdx = 0; subPlIdx < this._chartMain.subplots.length; subPlIdx++) {
        // For each month
        for (var monthIdx = 0; monthIdx < MONTHS_IN_YEAR.length; monthIdx++) {
          this._data.push({
            xaxis: 'x' + (subPlIdx + 1),
            yaxis: 'y' + (subPlIdx + 1),
            y: this._climateData[this._chartMain.subplots[subPlIdx].data + '_long'][monthIdx],
            type: 'box',
            name: MONTHS_IN_YEAR[monthIdx],
            marker: {
              color: this._chartMain.subplots[subPlIdx].color
            }
          });
        }
      }

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
        console.log(_this2._switchState);
        // TODO
        // this._drawChart()
      });

      // ------------------------------------------------------------------------
      // Resize graph on window resize
      // -> this is the brute force method. It would be nicer to plot it only
      // once and then to resize it, but that did not work since I used subplots.
      // ------------------------------------------------------------------------

      // TODO
      // $(window).resize(this._drawChart)
    }

    // ==========================================================================
    // Draw the whole chart
    // ==========================================================================

  }, {
    key: '_drawChart',
    value: function _drawChart() {}
  }]);

  return DistributionChart;
}(Chart);