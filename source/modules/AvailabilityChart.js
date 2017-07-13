// ############################################################################
// AvailabilityChart                                                       View
// ############################################################################
// ############################################################################

class AvailabilityChart extends Chart
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

    super(main, 'availability-chart', climateData)
  }


  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Init local members
  // ==========================================================================

  _initMembers()
  {
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
        + this._chartMain.style.rowHeadWidth
      ),
      top: ( 0
        + this._mainPos.top
        + this._chartsMain.padding
        + this._chartMain.margin.top
        + this._chartMain.style.colHeadHeight*2
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


  }


  // ==========================================================================
  // Draw the whole chart
  // ==========================================================================

  _drawChart()
  {
    // ------------------------------------------------------------------------
    // Setup grid
    // ------------------------------------------------------------------------

    // Actual data: 2d array gridData[year][2*month]
    // 1) temp, 2) prec
    // => [0] = Jan temp, [1] = Jan prec, [2] = Feb temp, ... , [23] = Dec prec
    let gridData = []

    // Number of years = number of rows
    let numYears = this._climateData.years[1] - this._climateData.years[0] + 1

    // Inital values for calculating svg rect positions
  	let xPos = this._chartPos.left
  	let yPos = this._chartPos.top
  	let width = this._chartPos.width / (MONTHS_IN_YEAR.length*2)

    // For each year
  	for (let yearIdx = 0; yearIdx < numYears; yearIdx++)
    {
  		gridData.push([])

      // For each month
  		for (let monthIdx = 0; monthIdx < MONTHS_IN_YEAR.length; monthIdx++)
      {
        let tempValue = this._climateData.temp[monthIdx].raw_data[yearIdx]
        // Is temp value existing?
        // -> If yes: default color
        // -> If not: color as 'not availble'
        let tempColor = this._chartsMain.colors.temp
        if (!this._isNumber(tempValue))
          tempColor = this._chartsMain.colors.notAvailable

        // Add new grid data
        gridData[yearIdx].push(
          {
            x:                xPos,
            y:                yPos,
            width:            width,
            color:            tempColor,
            value:            tempValue,
          }
        )

        // Increment the x position => move it over
        xPos += width

        // same procedure for prec value
        let precValue = this._climateData.prec[monthIdx].raw_data[yearIdx]
        let precColor = this._chartsMain.colors.prec
        if (!this._isNumber(precValue))
          precColor = this._chartsMain.colors.notAvailable

        gridData[yearIdx].push(
          {
            x:                xPos,
            y:                yPos,
            width:            width,
            color:            precColor,
            value:            precValue,
          }
        )

        // Increment the x position => move it over
        xPos += width

  		}
  		// Reset the x position after a row is complete
  		xPos = this._chartPos.left
  		// Increment the y position for the next row => Move it down
  		yPos += width
  	}

    let row = this._chart.selectAll('.row')
    	.data(gridData)
    	.enter()
      .append('g')
    	.attr('class', 'row')

    let inCellOverlay = false

    let column = row.selectAll('.square')
    	.data((d) => { return d })
    	.enter()
      .append('rect')
    	.attr('class',   'grid')
    	.attr('x',       (d) => { return d.x })
    	.attr('y',       (d) => { return d.y })
    	.attr('width',   (d) => { return d.width })
    	.attr('height',  (d) => { return d.width })
    	.style('fill',   (d) => { return d.color })
      .style('opacity',this._chartMain.style.cellOpacity)
      .style('stroke', this._chartsMain.colors.grid)
      .style('stroke-width', this._chartMain.style.gridWidth + ' px')
      .attr('shape-rendering', 'crispEdges')

      // Interaction: on hover, emphasize and show data value
      .on('mouseover', (d) =>
        {
          let oldWidth = d.width
          let newWidth = d.width * this._chartMain.style.emphResizeFactor

          // Error handling: if currently in a cell overlay, remove it
          if (inCellOverlay)
          {
            $('#active-ac-cell').remove()
            $('#active-ac-cell-text').remove()
          }

          inCellOverlay = true

          // Create overlay rectangle on top of the old one
          this._chart.append('rect')
            .attr('id',             'active-ac-cell')
            .attr('x',              d.x - (newWidth-oldWidth)/2)
            .attr('y',              d.y - (newWidth-oldWidth)/2)
            .attr('width',          newWidth)
            .attr('height',         newWidth)
            .style('fill',          d.color)
            .style('opacity',       1)
            .style('stroke',        'white')
            .style('stroke-width',  this._chartMain.style.gridWidth + ' px')

            // Interaction: on leave, remove both overlay and text
            .on('mouseleave', (d) =>
              {
                $('#active-ac-cell').remove()
                $('#active-ac-cell-text').remove()
                inCellOverlay = false
              }
            )

          // Create text containing the actual value
          this._chart.append('text')
            .attr('id',           'active-ac-cell-text')
            .attr('x',            d.x + d.width/2)
            .attr('y',            d.y + this._chartsMain.padding)
            .attr('text-anchor',  'middle')
            .attr('fill',        'white')
            .text(d.value)

        }
      )

    // TODO: generic!
    this._resizeChartHeight(500)


    // ------------------------------------------------------------------------
    // Table heading (months) and 1st column (year)
    // ------------------------------------------------------------------------

    // Make row headings: year number
    yPos = 0
      + this._chartPos.top
      + width/2
      + this._chartsMain.padding

    for (let yearIdx = 0; yearIdx < numYears; yearIdx++)
    {
      let year = this._climateData.years[0]+yearIdx
      // Place heading
      this._chart.append('text')
        .attr('class', 'ac-year')
        .attr('text-anchor', 'end')
        .attr('font-size', (this._chartMain.style.headFontSize + 'em'))
        .attr('x', 0
          + this._chartPos.left
          - this._chartsMain.padding
        )
        .attr('y', yPos)
        .text(year)
      // Go to next y position
      yPos += width
    }


    // make column headings:
    // 1) year (12) 2) data type prec/temp (12*2=24)
    //   Jan     Feb     Mar    ...
    //  T   P   T   P   T   P   ...
    xPos = 0
      + this._chartPos.left
      + width

    for (let monthIdx = 0; monthIdx < MONTHS_IN_YEAR.length; monthIdx++)
    {
      let month = MONTHS_IN_YEAR[monthIdx]

      // Place 1st heading: month
      this._chart.append('text')
        .attr('class', 'ac-year')
        .attr('text-anchor', 'middle')
        .attr('x', xPos)
        .attr('y', 0
          + this._chartPos.top
          - this._chartMain.style.colHeadHeight*2
        )
        .text(month)

      // Place 2nd heading: T | P
      this._chart.append('text')
        .attr('class', 'ac-year')
        .attr('text-anchor', 'middle')
        .attr('font-size', (this._chartMain.style.headFontSize + 'em'))
        .attr('x', 0
          + xPos
          - width/2
        )
        .attr('y', 0
          + this._chartPos.top
          - this._chartMain.style.colHeadHeight
          + this._chartsMain.padding
        )
        .text(this._chartMain.headings.temp)

      this._chart.append('text')
        .attr('class', 'ac-year')
        .attr('text-anchor', 'middle')
        .attr('font-size', (this._chartMain.style.headFontSize + 'em'))
        .attr('x', 0
          + xPos
          + width/2
        )
        .attr('y', 0
          + this._chartPos.top
          - this._chartMain.style.colHeadHeight
          + this._chartsMain.padding
        )
        .text(this._chartMain.headings.prec)

      // Increment to next month
      xPos += (2*width)
    }

  }


  // ==========================================================================
  // Helper function: check if value is a number
  // ==========================================================================

  _isNumber(n)
  {
    return (!isNaN(parseFloat(n)) && isFinite(n))
  }

}
