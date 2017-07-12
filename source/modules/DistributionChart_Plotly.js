// ############################################################################
// DistributionChart                                                       View
// ############################################################################
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
    // Graph node to be manipulated by Poltly
    this._graphD3 = null

    // Has the chart heihgt been resized already?
    this._chartWasResized = false

    // Initial switch state -> must be 0 !!!
    this._switchState = 0

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
    let dcContainer = this._domElementCreator.create(
      'div', 'dc-container', ['js-plotly-plot', 'plotly']
    )
    this._chartWrapper[0].appendChild(dcContainer)

    // Level 2 - move original svg chart container in here
    let svgContainer = $('#' + this._chartMain.name)
    svgContainer.detach()
    dcContainer.appendChild(svgContainer[0])

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

    // Save as members
    this._plotlyContainer = dcContainer


    // ------------------------------------------------------------------------
    // Prepare data for plotly
    // ------------------------------------------------------------------------

    this._plotlyData = []

    // For each plot
    for (let subPlIdx=0; subPlIdx<this._chartMain.subplots.length; subPlIdx++)
    {
      // For each month
      for (let monthIdx=0; monthIdx<MONTHS_IN_YEAR.length; monthIdx++)
      {
        this._plotlyData.push(
          {
            xaxis:  'x'+(subPlIdx+1),
            yaxis:  'y'+(subPlIdx+1),
            y:      this._climateData
                      [this._chartMain.subplots[subPlIdx].data + "_long"]
                      [monthIdx],
            type:   'box',
            name:	  MONTHS_IN_YEAR[monthIdx],
            marker:
            {
              color: this._chartMain.subplots[subPlIdx].color
            }
          }
        )
      }
    }


    // ------------------------------------------------------------------------
    // Prepare layouts for plotly
    // ------------------------------------------------------------------------

    this._layouts = {}

    // Fixed scale layout
    this._layouts.fixed =
    {
      showlegend: false,
      margin:
      {
        l:        this._chartMain.margin.left,
        t:        this._chartMain.margin.top,
        r:        this._chartMain.margin.right,
        b:        this._chartMain.margin.bottom,
        pad:      this._chartsMain.padding,
      },
      xaxis:      {},
      yaxis:      {},
      xaxis2:     {},
      yaxis2:     {},
    }

    // TODO: make axes private?
    let axes =
    [
      this._layouts.fixed.xaxis,  this._layouts.fixed.yaxis,    // temp
      this._layouts.fixed.xaxis2, this._layouts.fixed.yaxis2    // prec
    ]

    // Default style for all axes
    for (let axis of axes)
    {
      axis.rangemode =   'normal'
      axis.fixedrange =  true
      axis.showgrid =    true
      axis.showline =    true
      axis.mirror =      'ticks'
      axis.linecolor =   this._chartMain.style.lineColor
      axis.linewidth =   this._chartMain.style.lineWidth
    }

    // Special style / content for axes
    axes[0].title =     this._chartMain.subplots[0].title
    // Left part of the plot
    axes[0].domain =    [0, 0.5-this._chartMain.margin.separator/100/2]
    axes[1].anchor =    'x1'
    axes[1].range =     this._chartMain.subplots[0].maxRange
    axes[1].autorange = false

    axes[2].title =     this._chartMain.subplots[1].title
    // Right part of the plot
    axes[2].domain =    [0.5+this._chartMain.margin.separator/100/2, 1]
    axes[3].anchor =    'x2'
    axes[3].range =     this._chartMain.subplots[1].maxRange
    axes[3].autorange = false

    // Optimal layout: same as fixed layout, just with different range on y-axis
    this._layouts.automatic = JSON.parse(JSON.stringify(this._layouts.fixed))
    this._layouts.automatic.yaxis.autorange =  true
    this._layouts.automatic.yaxis2.autorange = true
    this._layouts.automatic.yaxis.rangemode =
      this._chartMain.subplots[0].maxRange[0] < 0 ? 'normal' : 'nonnegative'
    this._layouts.automatic.yaxis2.rangemode =
      this._chartMain.subplots[1].maxRange[0] < 0 ? 'normal' : 'nonnegative'

    // Configuration options for plotly
    this._configOptions =
    {
      displayModeBar: false
    }


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
        this._drawChart()
      }
    )


    // ------------------------------------------------------------------------
    // Resize graph on window resize
    // -> this is the brute force method. It would be nicer to plot it only
    // once and then to resize it, but that did not work since I used subplots.
    // ------------------------------------------------------------------------

    $(window).resize(this._drawChart)

  }


  // ==========================================================================
  // Draw the whole chart
  // ==========================================================================

  _drawChart()
  {
    // Cleanup graph

    // Get current layout
    let layout = null
    Object.keys(this._layouts).forEach( (key, index) =>
      {
        if (key == this._chartMain.switch.states[this._switchState])
          layout = this._layouts[key]
      }
    )


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
    $('.xtitle').attr('y', this._chartMain.plotTitleTop)
    $('.x2title').attr('y', this._chartMain.plotTitleTop)

    // Resize the chart, but only once
    if (!this._chartWasResized)
    {
      this._resizeChartHeight(30)
      this._chartWasResized = true
    }
  }

}
