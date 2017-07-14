// ############################################################################
// DistributionChart                                                       View
// ############################################################################
// Credits to: "Box Plots",Jens Grubert & Mike Bostock, access: 14.07.2017
// http://bl.ocks.org/jensgrubert/7789216
// ############################################################################

class DistributionChart extends Chart
{
  // ##########################################################################
  // PUBLIC MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Construct chart
  // ==========================================================================

  constructor(main, climateData)
  {

    // ------------------------------------------------------------------------
    // Call super class for setting up the div container and climate data
    // ------------------------------------------------------------------------

    super(main, 'distribution-chart', climateData)
  }


  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Init local members
  // ==========================================================================

  _initMembers()
  {
    // Initial switch state -> must be 0 !!!
    this._switchState = 0


    // ------------------------------------------------------------------------
    // Preparation: Position values for visualization elements
    // ------------------------------------------------------------------------

    // Position values of actual climate chart
    // Pos from top, bottom, left, right and position of horizontal break bar
    this._chartPos =
    {
      left: ( 0
        + this._mainPos.left
        + this._chartsMain.padding
        + this._chartMain.margin.left
      ),
      top: ( 0
        + this._mainPos.top
        + this._chartsMain.padding
        + this._chartMain.margin.top
      ),
      right: ( 0
        + this._mainPos.right
        - this._chartsMain.padding
        - this._chartMain.margin.right
      ),
      bottom: ( 0
        + this._mainPos.bottom
        - this._chartsMain.padding
        - this._chartMain.margin.bottom
      ),
    }
    this._chartPos.width =  this._chartPos.right -  this._chartPos.left
    this._chartPos.height = this._chartPos.bottom - this._chartPos.top


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
    let dcSwitch = this._domElementCreator.create('div', 'dc-switch')
    this._toolbar.appendChild(dcSwitch)

    let switchLabel = this._domElementCreator.create(
      'label', null, ['switch-light', 'switch-candy'], [['onClick', '']]
    )
    dcSwitch.appendChild(switchLabel)

    let switchInput = this._domElementCreator.create(
      'input', 'dc-switch-input', null, [['type', 'checkbox']]
    )
    switchLabel.appendChild(switchInput)

    let switchTitle = this._domElementCreator.create(
      'div', 'dc-switch-title'
    )
    switchLabel.appendChild(switchTitle)

    let switchOptions = this._domElementCreator.create(
      'span', 'dc-switch-options'
    )
    switchLabel.appendChild(switchOptions)

    let switchOptionL = this._domElementCreator.create(
      'span', 'dc-switch-option-l', ['dc-switch-option']
    )
    switchOptions.appendChild(switchOptionL)

    let switchOptionR = this._domElementCreator.create(
      'span', 'dc-switch-option-r', ['dc-switch-option']
    )
    switchOptions.appendChild(switchOptionR)

    let switchButton = this._domElementCreator.create(
      'a', 'dc-switch-button'
    )
    switchOptions.appendChild(switchButton)


    // ------------------------------------------------------------------------
    // Label switch title and switch states
    // ------------------------------------------------------------------------

    switchTitle.innerHTML = this._chartMain.switch.title
    switchOptionL.innerHTML = ""
      + this._chartMain.switch.states[0].charAt(0).toUpperCase()
      + this._chartMain.switch.states[0].slice(1)
    switchOptionR.innerHTML = ""
      + this._chartMain.switch.states[1].charAt(0).toUpperCase()
      + this._chartMain.switch.states[1].slice(1)


    // ------------------------------------------------------------------------
    // Interaction: click on toggle switch to change the layout
    // ------------------------------------------------------------------------

    $(switchOptions).click((e) =>
      {
        this._switchState = (this._switchState+1) % 2
        console.log(this._switchState)
        // TODO
        // this._drawChart()
      }
    )


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

  _drawChart()
  {

    // ------------------------------------------------------------------------
    // Prepare the data
    // Required format: array of arrays with data[d][m][2]
    //    d =               number of data types (2)
    //    m =               number of months (12)
    //    data[i][j][0] =   name of the ith column (month + data type)
    //    data[i][j][1] =   array of values for this month
    // ------------------------------------------------------------------------

    // Get climate data and min/max values (0: temp, 1: prec)
    let climateData = []
    let min = []
    let max = []

    // For each data type (temp and prec)
    for (let datatypeIdx = 0; datatypeIdx < 2; datatypeIdx++)
    {
      // Create empty arrays
      climateData[datatypeIdx] = []
      min[datatypeIdx] = +Infinity
      max[datatypeIdx] = -Infinity

      // For each month
      for (let monthIdx = 0; monthIdx < MONTHS_IN_YEAR.length; monthIdx++)
      {
        // Create empty array
        climateData[datatypeIdx][monthIdx] = []

        // Name month
        climateData[datatypeIdx][monthIdx][0] = MONTHS_IN_YEAR[monthIdx]

        // Get data values
        let values = null
        if (datatypeIdx == 0)       // Temp
          values = this._climateData.temp_long[monthIdx]
        else if (datatypeIdx == 1)  // Prec
          values = this._climateData.prec_long[monthIdx]
        climateData[datatypeIdx][monthIdx][1] = values

        // For each value
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++)
        {
          let value = values[valueIdx]
          if (value > max[datatypeIdx]) max[datatypeIdx] = value
      		if (value < min[datatypeIdx]) min[datatypeIdx] = value
        }
      }
    }

  	let chart = d3.boxplot()
  		.whiskers(this._iqr(1.5))
  		.height(this._chartPos.height*3)
  		.domain([min[0], max[0]])

  	// The x-axis
  	let x = d3.scale
      .ordinal()
  		.domain(climateData[0].map((d) => { return d[0] } ))
  		.rangeRoundBands([0 , this._chartPos.width], 0.8, 0.3)

  	// Draw the boxplots
  	this._chart.selectAll('.boxplot')
      .data(climateData[0])
  	  .enter()
      .append('g')
      .attr('class', 'boxplot')
  		.attr('transform', (d) =>
        {
          return (
            'translate('
              +  x(d[0])
              + ','
              + this._chartMain.margin.top
              + ')'
          )
        }
      )
      .call(chart.width(x.rangeBand()))
  }


  // ==========================================================================
  // Compute the interquartile range (IQR)
  // ==========================================================================

  _iqr(k)
  {
    return (d) =>
      {
        let q1 = d.quartiles[0]
        let q3 = d.quartiles[2]
        let iqr = (q3 - q1) * k
        let i = -1
        let j = d.length
        while (d[++i] < q1 - iqr)
          while (d[--j] > q3 + iqr)
            return [i, j]
      }
  }

}
