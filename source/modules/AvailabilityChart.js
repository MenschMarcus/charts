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
    this._chartPos = {
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


  }


  // ==========================================================================
  // Draw the whole chart
  // ==========================================================================

  _drawChart()
  {
    // ------------------------------------------------------------------------
    // Setup grid
    // ------------------------------------------------------------------------

    let gridData = new Array()
  	let xPos = this._chartPos.left
  	let yPos = this._chartPos.top
  	let width = this._chartPos.width / (MONTHS_IN_YEAR.length*2)
  	let color = this._chartsMain.colors.grid

  	// Iterate for rows
  	for (let row = 0; row < 10; row++)
    {
  		gridData.push( new Array() )

  		// Iterate for cells/columns inside rows
  		for (let column = 0; column < MONTHS_IN_YEAR.length*2; column++)
      {
  			gridData[row].push(
          {
            x: xPos,
    				y: yPos,
    				width: width,
    				height: width,
            color: color
  			  }
        )
  			// Increment the x position. I.e. move it over by 50 (width variable)
  			xPos += width
  		}
  		// Reset the x position after a row is complete
  		xPos = this._chartPos.left
  		// Increment the y position for the next row. Move it down 50 (height variable)
  		yPos += width
  	}

    let row = this._chart.selectAll(".row")
    	.data(gridData)
    	.enter()
      .append("g")
    	.attr("class", "row")

    let column = row.selectAll(".square")
    	.data((d) => { return d })
    	.enter()
      .append("rect")
    	.attr("class",   "grid")
    	.attr("x",       (d) => { return d.x })
    	.attr("y",       (d) => { return d.y })
    	.attr("width",   (d) => { return d.width })
    	.attr("height",  (d) => { return d.height })
    	.style("fill",   (d) => { return d.value })

    this._chart.selectAll('.grid')
      .style('fill', 'none')
      .style('stroke', this._chartsMain.colors.grid)
      .style('stroke-width', this._chartMain.style.gridWidth + ' px')
      .attr('shape-rendering', 'crispEdges')

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


}
