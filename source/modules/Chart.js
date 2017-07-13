// ############################################################################
// Chart                                                                  View
// ############################################################################
// Is the base class for all visualization charts
// - Create the div container
// - Provide d3 as the visualization library
// - Provide title, subtitle, data reference
// - Provide functionality for exporting in SVG and PNG
// ############################################################################

class Chart
{
  // ==========================================================================
  // Constructor
  // ==========================================================================

  constructor(main, chartName, climateData)
  {
    // ------------------------------------------------------------------------
    // Member Variables
    // ------------------------------------------------------------------------

    this._main = main

    // Get charts main -> generic information for all charts
    // get initial dimensions as a deep copy to change them later on
    this._chartsMain = main.config.charts

    // Get chart main -> specific information for this chart
    this._chartName = chartName
    this._chartMain = null
    for (let chart of main.config.charts.charts)
      if (chart.name == chartName)
        this._chartMain = chart

    // Copy height of the chart, to never override main
    this._chartHeight = this._chartsMain.positions.height

    // Actual chart data
    this._climateData = climateData

    // Helper
    this._domElementCreator = new DOMElementCreator()

    // Global setup for all chart types
    this._setChartMetadata()
    this._setupContainer()
    this._setupHeaderFooter()

    // Local setup for specific chart types
    this._initMembers()
    this._drawChart()
  }

    // ========================================================================
    // Update climate data of chart
    // ========================================================================

    updateClimate(climateData)
    {
      // Update model
      this._climateData = climateData

      // Clean view
      this._chartWrapper.remove()

      // Reset view
      this._setChartMetadata()
      this._setupContainer()
      this._setupHeaderFooter()
      this._drawChart()
    }


    // ==========================================================================
    // Update title of chart
    // ==========================================================================

    updateTitle(title)
    {
      this._title = title
      this._titleDiv.text(title)
    }


    // ==========================================================================
    // Remove chart
    // ==========================================================================

    remove()
    {
      // Clean model
      this._climateData = null
      // Clean view
      this._chartWrapper.remove()
    }


  // ##########################################################################
  // PRIVATE MEMBERS
  // ##########################################################################

  // ==========================================================================
  // Set Metadata
  // ==========================================================================

  _setChartMetadata()
  {
    // Set title
    this._title = this._climateData.name

    // Assemble subtitle (location | elevation | climate class | years)
    this._subtitle = this._climateData.location.DD
    if (this._climateData.elevation)
      this._subtitle += ' | Elevation: '     + this._climateData.elevation
    if (this._climateData.climate_class)
      this._subtitle += ' | Climate Class: ' + this._climateData.climate_class
    this._subtitle +=   ' | Years: '
                        + this._climateData.years[0]
                        + '-'
                        + this._climateData.years[1]
      // TODO: gap years (appendix in this._climateData.years[2])

    // Get reference URL
    this._refURL = this._chartsMain.referenceURL
  }


  // ==========================================================================
  // Setup chart container
  // ==========================================================================

  _setupContainer()
  {
    // Get parent container (the one that contains all charts)
    let parentContainer = $('#' + this._chartsMain.parentContainer)

    // Setup wrapper for all chart elements
    let chartWrapper = this._domElementCreator.create(
        'div',                              // Element type
        this._chartMain.name + '-wrapper',  // ID
        ['chart-wrapper', 'box']            // Classes
      )
    parentContainer.append(chartWrapper)
    this._chartWrapper = $('#' + this._chartMain.name + '-wrapper')
    this._chartWrapper.css('width', this._chartsMain.positions.width)
    this._chartWrapper.css('height', this._chartHeight)

    // Add toolbar container
    // -> will be placed on top of chart, but will not be printed

    this._toolbar = this._domElementCreator.create(
      'div', this._chartMain.name+'-toolbar', ['toolbar']
    )
    this._chartWrapper[0].appendChild(this._toolbar)

    // Add actual chart -> svg canvas
    this._chart = d3.select(chartWrapper)
      .classed('svg-container', true)
      .append('svg')
      .attr('id', this._chartMain.name)
      .attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('width', this._chartsMain.positions.width)
      .attr('height', this._chartHeight)
      // Do not use viewBox, since it incorporates a new coordinate systems
      // .attr('viewBox', ''
      //   + '0 0 '  + this._chartsMain.positions.width
      //   + ' '     + this._chartHeight
      // )
      .classed('svg-content-responsive', true)
      .style('font-size',       this._chartsMain.fontSizes.basic+'px')
      .style('font-family',     'Arial, sans-serif')
      .style('font-style',      'normal')
      .style('font-variant',    'normal')
      .style('font-weight',     'normal')
      .style('shape-rendering', 'default')
      .style('text-rendering',  'optimizeLegibility')
      .style('background-color','transparent')

    // Final dimensions of the main chart area
    this._mainPos = {
      left : 0,
      top : ( 0
        + this._chartsMain.positions.main.top
      ),
      right : ( 0
        + this._chartsMain.positions.width
      ),
      bottom : ( 0
        + this._chartHeight
        - this._chartsMain.positions.main.top
        - this._chartsMain.positions.main.bottom
      ),
    }

    this._mainPos.width = 0
      + this._mainPos.right
      - this._mainPos.left
    this._mainPos.height = 0
      + this._mainPos.bottom
      - this._mainPos.top

  }


  // ==========================================================================
  // Write chart-independent meta information into chart header / footer
  // ==========================================================================

  _setupHeaderFooter()
  {
    // Title
    this._chart.append('text')
      .attr('id', this._chartName + '-title')
      .attr('class', 'chart-header chart-title')
      .attr('x', this._chartsMain.positions.width/2)
      .attr('y', 0
        + this._chartsMain.positions.title.top
        + this._chartsMain.padding
      )
      .attr('text-anchor', 'middle')
      .style('font-size', this._chartsMain.fontSizes.title)
      .text(this._title)

    // Subtitle
    this._chart.append('text')
      .attr('class', 'chart-header chart-subtitle')
      .attr('x', this._chartsMain.positions.width/2)
      .attr('y', 0
        + this._chartsMain.positions.subtitle.top
        + this._chartsMain.padding
      )
      .attr('text-anchor', 'middle')
      .style('font-size', this._chartsMain.fontSizes.subtitle)
      .text(this._subtitle)

    // Footer: Source link
    this._footerElems = [2]
    this._footerElems[0] = this._chart.append('text')
      .attr('class', 'source')
      .attr('x', 0
        + this._chartsMain.padding
      )
      .attr('y', 0
        + this._chartsMain.positions.footer.top
        - this._chartsMain.padding
      )
      .style('cursor', 'pointer')
      .style('font-size', this._chartsMain.fontSizes.source + 'px')
      .style('opacity', this._chartsMain.footerOpacity)
      // .attr('link' + this._climateData.source_link)
      .text('Data Source: ' + this._climateData.source)
      .on('click', () => { window.open(this.link) })

    // Footer: Reference URL
    this._footerElems[1] = this._chart.append('text')
      .append('tspan')
      .attr('class', 'source')
      .attr('x', 0
        + this._chartsMain.positions.width
        - this._chartsMain.padding
      )
      .attr('y', 0
        + this._chartsMain.positions.footer.top
        - this._chartsMain.padding
      )
      .style('text-anchor', 'end')
      .style('font-size', this._chartsMain.fontSizes.source + 'px')
      .style('opacity', this._chartsMain.footerOpacity)
      .text(this._refURL)
  }


  // ==========================================================================
  // Resize chart height
  // ==========================================================================

  _resizeChartHeight(shiftUp)
  {
    // Reset model: Shift full height
    this._chartHeight += shiftUp
    this._mainPos.bottom += shiftUp
    this._mainPos.height += shiftUp

    // Reset model: Shift footer down
    this._chartsMain.positions.footer.top += shiftUp

    // Reset view: parent wrapper and svg container
    this._chartWrapper.css('height', this._chartHeight)
    this._chart.attr('height', this._chartHeight)

    // Reset footer elements
    for (let footerElem of this._footerElems)
    {
      let oldY = parseFloat(footerElem.attr('y'))
      footerElem.attr('y', oldY + shiftUp)
    }
  }
}
