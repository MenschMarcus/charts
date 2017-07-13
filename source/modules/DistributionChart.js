// ############################################################################
// DistributionChart                                                       View
// ############################################################################
// Credits to: Mike Bostock
// https://bl.ocks.org/mbostock/4061502
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

    let labels = false // show the text labels beside individual boxplots?

    let margin = {top: 30, right: 50, bottom: 70, left: 50}
    let  width = 800 - margin.left - margin.right
    let height = 400 - margin.top - margin.bottom

    let min = Infinity,
        max = -Infinity

    // parse in the data
    d3.csv('build/modules/data.csv', (error, csv) =>
    {
    	// using an array of arrays with
    	// data[n][2]
    	// where n = number of columns in the csv file
    	// data[i][0] = name of the ith column
    	// data[i][1] = array of values of ith column

    	let data = []
    	data[0] = []
    	data[1] = []
    	data[2] = []
    	data[3] = []
    	// add more rows if your csv file has more columns

    	// add here the header of the csv file
    	data[0][0] = 'Q1'
    	data[1][0] = 'Q2'
    	data[2][0] = 'Q3'
    	data[3][0] = 'Q4'
    	// add more rows if your csv file has more columns

    	data[0][1] = []
    	data[1][1] = []
    	data[2][1] = []
    	data[3][1] = []

    	csv.forEach((x) => {
    		let v1 = Math.floor(x.Q1),
    			v2 = Math.floor(x.Q2),
    			v3 = Math.floor(x.Q3),
    			v4 = Math.floor(x.Q4)
    			// add more variables if your csv file has more columns

    		let rowMax = Math.max(v1, Math.max(v2, Math.max(v3,v4)))
    		let rowMin = Math.min(v1, Math.min(v2, Math.min(v3,v4)))

    		data[0][1].push(v1)
    		data[1][1].push(v2)
    		data[2][1].push(v3)
    		data[3][1].push(v4)
    		 // add more rows if your csv file has more columns

    		if (rowMax > max) max = rowMax
    		if (rowMin < min) min = rowMin
    	})

    	let chart = d3.boxplot()
    		.whiskers(iqr(1.5))
    		.height(this._chartPos.height)
    		.domain([min, max])
    		.showLabels(labels)

      d3.select('#distribution-chart')
    		.attr('class', 'boxplot')
    		.append('g')
    		.attr('transform', 'translate(' + this._chartMain.margin.left + ',' + this._chartMain.margin.top + ')')

    	// the x-axis
    	let x = d3.scale.ordinal()
    		.domain( data.map((d) => { return d[0] } ) )
    		.rangeRoundBands([0 , width], 0.7, 0.3)

    	let xAxis = d3.svg.axis()
    		.scale(x)
    		.orient('bottom')

    	// the y-axis
    	let y = d3.scale.linear()
    		.domain([min, max])
    		.range(
          [
            this._chartPos.top,
            this._chartPos.bottom
          ]
        )

    	let yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')

    	// draw the boxplots
    	this._chart.selectAll('.boxplot')
        .data(data)
    	  .enter().append('g')
    		.attr('transform', (d) => { return 'translate(' +  x(d[0])  + ',' + margin.top + ')' } )
        .call(chart.width(x.rangeBand()))


    	// add a title
    	this._chart.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 + (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        //.style('text-decoration', 'underline')
        .text('Revenue 2012')

    	 // draw y axis
    	this._chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
    		.append('text') // and text1
  		  .attr('transform', 'rotate(-90)')
  		  .attr('y', 6)
  		  .attr('dy', '.71em')
  		  .style('text-anchor', 'end')
  		  .style('font-size', '16px')
  		  .text('Revenue in €')

    	// draw x axis
    	this._chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height  + margin.top + 10) + ')')
        .call(xAxis)
    })

    // Returns a function to compute the interquartile range.
    function iqr(k) {
      return function(d, i) {
        let q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            it = -1,
            jt = d.length
        while (d[++it] < q1 - iqr)
        while (d[--jt] > q3 + iqr)
        return [it, jt]
      }
    }

  }
}
