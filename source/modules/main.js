// 0: Weimar
// 1: Cherrapunjee
const climateDataIdx = 1


const MONTHS_IN_YEAR =
  [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

let main =
{
  config:
  {
    charts:
    {
      parentContainer:  'main-container',
      className:        'chart',
      referenceURL:     'ClimateCharts.net',
      positions:        // [px]
      {
        width:          728,  // Reference: full width
        height:         420,  // Reference: initial full height
        title:
        {
          top:          15,
        },
        subtitle:
        {
          top:          35,
        },
        main:
        {
          top:          70,
          bottom:       30,
        },
        footer:
        {
          top:          420,
        },
      },
      fontSizes:    // [px]
      {
        basic:      15,
        title:      15,
        subtitle:   15,
        source:     12,
      },
      padding:      5,
      colors:
      {
        temp:         d3.rgb(230,20, 20 ),
        prec:         d3.rgb(4,  61, 183),
        arid:         d3.rgb(255,233,15 ),
        humid:        d3.rgb(89, 131,213),
        perhumid:     d3.rgb(4,  61, 183),
        grid:         d3.rgb(211,211,211),
        axes:         d3.rgb(255,255,255),
      },
      footerOpacity:  0.4,
      charts:
      [
        {
          name:           'climate-chart',
          widthRatio:     0.75, // [%] of full width for diagram -> rest: table
          margin:         // [px]
          {
            left:         30,
            top:          10,
            right:        30,
            bottom:       10,
          },
          fontSizes:      // [px]
          {
            tick:         13,
            info:         15,
            table:        14,
          },
          prec:
          {
            caption:        "Precipitation Sum",
            unit:           "mm",
            breakValue:     100,  // [mm] at which prec scale breaks
            distBelowBreak:  20,  // Humid: distance between two ticks
            distAboveBreak: 200,  // Perhumid: distance between two ticks
          },
          temp:
          {
            caption:        "Temperature Mean",
            unit:           "°C",
            dist:            10,  // Distance between two ticks
          },
          chart:
          {
            tickSize:       5,
            gridWidth:      1,
            axesWidth:      2,
            lineWidth:      1.5,  // Lines for prec and temp
            areaOpacity:    0.7,  // For the areas between prec/temp lines
          },
          table:
          {
            heading:
            {
              month:        "Month",
              temp:         "Temp",
              prec:         "Precip",
            },
            margin:     // [px]
            {
              top:      12,   // downshift from top line
              right:    10,   // right margin for right-aligned cell values
              left:     20,   // right margin for left-aligned cell values
            },
          },
          mouseover:
          {
            circleRadius:   5.0,    // [px]
            strokeWidth:    2.0,  // [px]
          }
        },

        {
          name:           'distribution-chart',
          subplots:
          [
            {
              data:       'temp',
              title:      "Distribution of Temperature [&deg;C]",
              color:      'rgb(230, 20, 20)',
              maxRange:   [-40, +40]
            },
            {
              data:       'prec',
              title:      "Distribution of Precipitation [mm]",
              color:      'rgb(4, 61, 186)',
              maxRange:   [0, +1000]
            }
          ],
          margin:       // [px]
          {
            left :      30,
            top:        100,
            right:      30,
            bottom:     80,
            separator:  10,  // distance between temp and prec subplots
          },
          height:       500,  // [px]
          plotTitleTop: 85,   // [px] the subplot titles have to move up
          style:
          {
            lineColor:  d3.rgb(150,150,150),  // grey
            lineWidth:  1,  // [px]
          },
          switch:
          {
            title:      "Y-Axis Scaling",
            states:     ['automatic', 'fixed'],
          },
        },

        {
          name:         'availability-chart'
        },
      ],
    },
  }
}

let climateData =
[
  // Weimar
  {"name":"Weimar, Thuringia, Germany","location":{"orig":{"lat":50.98682075063399,"lng":11.320263817906381},"DD":"50.987E, 11.32N","DMS":"Position 50 59 13 N 11 19 13 E"},"hemisphere":"N","elevation":"227 m","climate_class":"Cfb","years":[1970,1998,null],"source":"dx.doi.org/10.5285/4c7fdfa6-f176-4c58-acee-683d5e9d2ed5","source_link":"http://dx.doi.org/10.5285/4c7fdfa6-f176-4c58-acee-683d5e9d2ed","doi":null,"prec":[{"raw_data":[33.3,12.3,10.4,32.3,22.4,19.1,94.3,33.5,15.9,30.9,30.7,44.8,32.1,40.3,45.9,25.9,44.4,59.4,30.5,17.9,16.3,22.5,22.8,56,42.3,58.6,1.7,16.4,25.7],"num_gaps":0,"sum":32.366},{"raw_data":[64.6,22,2.5,30.7,37,22.7,9,38.6,19.1,30.1,28.4,17,3.8,26.3,54.2,11.5,18.2,40.2,56.7,21,55.8,15.9,15.5,13.5,27.2,46.8,30.3,53.4,13.2],"num_gaps":0,"sum":28.455},{"raw_data":[30.8,16.7,39.2,17.3,28.6,35.3,14.6,60.7,25.4,89.6,21.9,50.1,19.1,32.8,7.1,27.4,66,57.9,84.6,40.8,22,20.5,88.3,11.4,55.4,28.8,19,60.1,34.7],"num_gaps":0,"sum":38.141},{"raw_data":[71.7,38.2,41.1,38.9,14.6,47.4,19.4,38.5,18.6,38.1,60.9,57.7,23.7,125.4,63.8,23.8,50.8,24.8,21.2,56.9,51.5,26.6,27.2,18.9,91.3,50.7,29.9,34.8,43.8],"num_gaps":0,"sum":43.11},{"raw_data":[71.5,58.8,63.6,49.7,66.4,48.9,47.2,22.4,79.2,34.3,28.1,68.3,42.3,91.6,126.9,42.9,82.8,92.7,21.6,25.5,15.3,26.5,26.3,76.8,80.1,72.2,76.3,38.1,52.7],"num_gaps":0,"sum":56.172},{"raw_data":[49.9,73.8,103.2,44.9,87.3,95.5,44.3,92.2,32.3,64.8,61,48.3,46.4,27.2,61.7,63.5,43.8,103.5,79.5,54.5,104.6,74.8,76.2,70.3,41.8,75.6,64.5,34.6,55.3],"num_gaps":0,"sum":64.666},{"raw_data":[64.9,11.1,100.4,65.4,61.3,32.5,43.5,69.8,50.6,64.6,65.1,53,57.9,28.8,80.3,51.3,53.7,74.4,62.8,56.2,20.7,53.6,125.4,131.7,82.8,113.4,86,70.5,74.8],"num_gaps":0,"sum":65.741},{"raw_data":[112.7,51.1,96,29.2,56.7,51,23.7,136.1,68.5,21.8,25.7,109.6,32.2,63,64.7,48.6,68,62.4,25.4,24.3,49.1,61.2,56.5,31.9,89.8,49.8,102.9,38.4,35.4],"num_gaps":0,"sum":58.128},{"raw_data":[27.9,26.1,25.9,52.2,31.1,33.9,40.8,25.8,69.8,62.9,49,60.2,9.7,48.3,63.3,24.4,54.4,88.1,31.9,42.1,45.5,24,26,45.5,47.7,86.7,27.3,13.2,94.7],"num_gaps":0,"sum":44.083},{"raw_data":[61.9,34.7,27.6,66,99.1,36.7,27.2,41.5,32.3,14.9,43.7,64.9,55.4,7,48.5,3.6,59.5,23.3,19.9,39.3,22.1,13.7,41.5,48.2,32.2,10.6,59.8,52.8,117.5],"num_gaps":0,"sum":41.566},{"raw_data":[40.9,59.4,43.7,22.8,29,28.2,41.8,89.3,6.9,57.5,36.2,58.4,14,21.4,43.3,38.7,10.3,53.4,53,56.8,59.5,24.7,71,31.1,49.6,26.8,48.9,25.6,57.6],"num_gaps":0,"sum":41.372},{"raw_data":[37.1,17.8,2.7,39.3,76.9,8.4,12,40.1,66.2,53.7,29.8,67.3,28.2,16.8,17.5,50.5,45.9,36.6,69.7,51.6,34.7,47.7,45.7,92.8,37.1,30.1,43.8,45.8,9.9],"num_gaps":0,"sum":39.852}],"temp":[{"raw_data":[-3.8,-2.6,-3.9,-0.9,2.8,4,0.5,-0.3,0,-5.5,-4,-2.8,-3.6,3.3,0.5,-6.5,-0.5,-7.4,2.7,1.5,1.5,1,0.1,1.2,2.3,-0.9,-4.9,-4,1.5],"num_gaps":0,"mean":-0.99},{"raw_data":[-1.6,0.6,1.1,0.3,2.5,0.2,-0.3,2.5,-2.3,-3.2,2,-1.3,-1.2,-2.4,-1.2,-4.4,-8.4,-1.6,1.2,2.3,5.4,-3.2,2.1,-2.5,-0.8,4,-3.1,3.5,3.7],"num_gaps":0,"mean":-0.21},{"raw_data":[0.8,0.4,5,3.6,5.2,3.4,0.5,6.1,5,3.2,2.7,6.9,4,4.5,1.4,2.4,2.8,-2.3,2.2,6.8,6.9,6.4,4.4,3.4,6.4,2.7,0.1,5.6,4.7],"num_gaps":0,"mean":3.628},{"raw_data":[5.2,7.6,6.8,4.5,7.3,6.5,6.2,5.3,6.2,6,5.5,7,6.1,8.4,6.1,7.4,5.8,8.8,7.4,7,6.7,6.7,7.5,10.5,7.9,8.2,8,5.7,8.9],"num_gaps":0,"mean":6.938},{"raw_data":[10.8,13.3,11.1,12.1,10.2,11.5,12.6,10.8,10.9,12.1,9.8,12.7,12.4,11.1,10.1,12.6,14.5,9.3,13.9,13.4,13.4,9.2,14.2,14.6,12.6,11.7,10.6,12.5,13.4],"num_gaps":0,"mean":11.979},{"raw_data":[16.6,13.3,14.3,15.5,13.5,14,16.7,15.1,14.2,16.7,14.4,15.3,16.2,15.8,13.4,12.9,15.3,13.5,14.8,14.8,15,13.5,16.7,15.5,16.2,13.8,15,15.4,16.4],"num_gaps":0,"mean":14.959},{"raw_data":[15.7,17.7,17.1,16.6,14.8,17.8,19.2,15.9,15.2,14.7,14.5,15.9,18.9,19.9,15.2,16.9,16.8,16.5,17.1,17.3,16.2,19.3,18.1,16,21.3,19.6,15.1,16.4,15.9],"num_gaps":0,"mean":16.952},{"raw_data":[16.1,17.9,15.1,17.5,16.8,18.5,15.6,15.4,14.7,15.2,16.6,15.8,17.8,17.6,16.7,16.1,16.3,15,17.4,17,18.6,17.7,19.2,16,17.7,17.8,16.5,19.3,16.7],"num_gaps":0,"mean":16.848},{"raw_data":[13.1,11.7,10.3,14.2,13.1,15.5,12.6,11.6,11.9,12.9,13.8,13.7,16.6,13.5,12,13.5,10.8,14.5,13.4,14.6,11.6,15.3,12.9,11.7,13,12.1,10,13.6,12.9],"num_gaps":0,"mean":12.979},{"raw_data":[8.3,8.2,5.7,6.6,4.7,6.7,8.8,9.6,8.5,7.5,7.5,8,9.4,8.9,9.9,8,9.3,8.6,9.3,10.3,9.6,7.7,5.8,7.1,6.8,11.2,8.3,6.8,7.8],"num_gaps":0,"mean":8.1},{"raw_data":[5.3,2.9,3.5,2.9,4.4,2.2,4.2,4.7,3.1,2.7,2.1,4.2,5.8,2.6,3.9,0,5.3,3.9,2.4,2.1,4.5,3.4,4.8,-0.9,5.5,1.8,3.9,3.3,0.8],"num_gaps":0,"mean":3.286},{"raw_data":[-0.3,3,-0.8,-0.8,4.4,0.5,-1.3,0.9,-0.5,3.2,0,-3.4,1.6,-0.6,0.3,3.4,1.5,0.9,2.5,1.8,0.1,-0.3,0.2,2.5,3,-3.1,-4.3,1,0],"num_gaps":0,"mean":0.531}],"temp_mean":7.92,"prec_sum":553.65,"monthly_short":[{"monthIdx":0,"month":"Jan","temp":-0.99,"prec":32.366},{"monthIdx":1,"month":"Feb","temp":-0.21,"prec":28.455},{"monthIdx":2,"month":"Mar","temp":3.628,"prec":38.141},{"monthIdx":3,"month":"Apr","temp":6.938,"prec":43.11},{"monthIdx":4,"month":"May","temp":11.979,"prec":56.172},{"monthIdx":5,"month":"Jun","temp":14.959,"prec":64.666},{"monthIdx":6,"month":"Jul","temp":16.952,"prec":65.741},{"monthIdx":7,"month":"Aug","temp":16.848,"prec":58.128},{"monthIdx":8,"month":"Sep","temp":12.979,"prec":44.083},{"monthIdx":9,"month":"Oct","temp":8.1,"prec":41.566},{"monthIdx":10,"month":"Nov","temp":3.286,"prec":41.372},{"monthIdx":11,"month":"Dec","temp":0.531,"prec":39.852}],"extreme":{"minTemp":-0.99,"maxTemp":16.952,"minPrec":28.455,"maxPrec":65.741}},

  // Northern India
  {"name":"Cherrapunjee, India","location":{"orig":{"lat":25.272912413364242,"lng":91.73620462417604},"DD":"25.273E, 91.736N","DMS":"Position: 25 16 22 N 91 44 10 E"},"hemisphere":"N","elevation":"1315 m","climate_class":"Cfa","years":[1970,1998,null],"source":"dx.doi.org/10.5285/4c7fdfa6-f176-4c58-acee-683d5e9d2ed5","source_link":"http://dx.doi.org/10.5285/4c7fdfa6-f176-4c58-acee-683d5e9d2ed","doi":null,"prec":[{"raw_data":[66.1,32.6,1,13.8,2.4,4.2,2.9,5.3,0,0.3,1.1,36.7,0.9,5.6,17.1,6.3,10.5,19.7,11,26.7,18.2,9.5,4,48.6,29.5,17.3,6.7,6.7,6.9],"num_gaps":0,"sum":14.193},{"raw_data":[28.5,12.6,42.7,126.3,0.1,22.4,15.2,51,16.9,12.3,58.4,20.9,13,41,0.6,34.4,1.3,18,68.3,159.3,53.6,41.7,54.5,131.9,66.3,42.6,68.5,33.1,96.4],"num_gaps":0,"sum":45.924},{"raw_data":[332.4,49.1,213.5,12.9,134.3,21.3,512.8,388.1,51.5,68.3,27.7,117.5,37.9,102,84.8,485.4,37.2,199.3,106.6,31.1,112.5,94.1,164,222.7,142.8,20.4,382.7,46.6,244.6],"num_gaps":0,"sum":153.245},{"raw_data":[518.7,234.8,392.1,667.4,853.4,647.9,266.5,743.5,123.5,178.2,86,231.2,402.5,223.8,410.3,495.8,650,387.9,209.6,739.4,825.9,414.5,166.4,170,178,166.3,365.9,165.4,201.3],"num_gaps":0,"sum":383.317},{"raw_data":[1092.7,169.9,447.4,555.1,473.3,666.4,287,993.7,495.9,828.4,87.1,491.8,426.2,267.7,1972.7,581.5,134.9,356.4,972.1,119.3,661.1,1167.8,542.5,655.7,379.2,356.4,840.6,456.8,748.1],"num_gaps":0,"sum":594.059},{"raw_data":[1566.4,1021,1340.6,1479.2,1372.2,744.9,1221.1,938.6,996.3,673.9,105.8,141.3,1084.1,608.3,996.6,1227.2,639.7,1421.4,1098.2,1176.6,1198,1344.6,1040.6,1542.1,914.7,1332.7,806.6,864.4,984.5],"num_gaps":0,"sum":1030.4},{"raw_data":[1915,814.9,803.6,926.7,3198,1664.3,730.4,848.9,868,1624,118.9,1577.2,1222.1,1368.6,2166,1444.2,770.8,1793.8,1555.3,1956.2,932.5,609.8,1335.8,1277.8,1008.4,1028.5,1510.3,950.5,1479],"num_gaps":0,"sum":1293.086},{"raw_data":[782.3,939.6,431.4,533.9,1319.3,553,929,1266.6,314.5,535.6,86.8,684.3,871.8,1009.8,522.2,767.5,641.6,813.6,2142,528.5,468.6,692.8,652.4,719.2,773.1,1037.5,789.6,669,1046.5],"num_gaps":0,"sum":776.621},{"raw_data":[851.2,313.3,347,664,664.7,590.8,176.7,257.3,352,997.2,53.2,483.2,880.7,981.5,1358.2,430.1,590.6,1090.6,931.1,761.5,782.8,762.7,523,746.5,271.6,666,187.1,821.2,285.4],"num_gaps":0,"sum":614.524},{"raw_data":[688.5,266.8,122.6,119.2,1017.3,594.6,116.2,339.4,129.2,780.7,60.2,16.3,36.9,203.4,180.7,31.3,382.3,72.6,502.5,513.8,491.2,430.1,211,153.7,63.3,38.6,374,20,79.5],"num_gaps":0,"sum":277.1},{"raw_data":[36.6,185.9,2,264.5,11.5,35.9,9.1,51.4,29.8,24.7,0,0,36.8,0.8,7.3,2.2,119.1,28.4,215.3,28.9,22.4,3.1,7.3,2.2,8.3,246.8,0,11.1,189.8],"num_gaps":0,"sum":54.524},{"raw_data":[0.1,0.4,0,85.9,0,0.4,0.2,11.4,0,40.2,0.6,83,0.9,28.1,68.4,15.8,4.1,36.7,77.6,2.4,1.4,65.4,10.7,0,0,0.1,0,38.4,0],"num_gaps":0,"sum":19.731}],"temp":[{"raw_data":[13.7,14.3,14.9,14.7,13.5,14.5,14.2,13.7,12.3,15.4,13.7,14.7,15.7,13.5,13.3,13.9,14.2,15.2,15.2,13.4,14.9,12,11.7,13.4,15.8,14.1,13.6,14.4,13.3],"num_gaps":0,"mean":14.041},{"raw_data":[16.3,15.8,14.4,17,15.8,16.1,16.5,16,15.9,15.8,15.9,16,15.7,14.7,16.2,14.7,16.1,17.5,17.7,15.1,15.9,14.7,13.9,15.2,15.2,15.3,16.7,14.5,16.9],"num_gaps":0,"mean":15.776},{"raw_data":[19.4,19.8,20.2,18.7,19.7,20.4,19.6,20.8,19.3,19.7,19.9,19.1,19.3,18.8,20.1,19.4,20.1,19.5,19.7,19.4,17.7,19.1,17.1,17,19.2,19.8,20.6,20.3,18.2],"num_gaps":0,"mean":19.376},{"raw_data":[21.7,20.9,20.7,22.7,21.4,22.2,21.9,19.9,21.9,22.8,22.6,20.4,20.7,21.2,21.9,21.2,20.6,21.6,22.7,20.9,19.6,20.1,20.8,19.8,21.6,22.6,21.9,20,23.6],"num_gaps":0,"mean":21.376},{"raw_data":[22.2,22.3,22.3,22,22.4,22.4,21.7,21,22.4,23.4,21.8,22,23.3,22,21.3,22.1,21.8,22.6,22.1,23,22.5,20.2,20.4,21.5,23.1,23.8,22.2,22.7,23.5],"num_gaps":0,"mean":22.207},{"raw_data":[23.3,22.9,23.1,22.9,22.7,23.6,22.4,22.2,21.6,24.3,23.8,23.9,23.6,23.7,23.4,23,23.6,24,23.7,23,23.1,21.6,22.2,22.5,22.9,23.8,23.3,22.7,23.5],"num_gaps":0,"mean":23.114},{"raw_data":[22.9,23.6,24,24.1,22.9,22.8,23.4,23.7,23.5,23.7,24.1,23.5,23.9,23.9,22.8,22.4,23.2,23.6,23.8,23.4,23,22.2,23.1,21.8,24.9,23.5,22.9,23.9,23.9],"num_gaps":0,"mean":23.393},{"raw_data":[23.2,23,23.6,24.1,23.6,24.1,23,23.8,25,24.4,23.6,24.1,24.4,24,24,23.9,24.2,23.8,22.6,23.8,24,22.5,22.7,23.7,24.8,24,23.5,24.9,24],"num_gaps":0,"mean":23.803},{"raw_data":[23.8,23.6,23.7,23.5,22.8,23.3,23.6,24.3,23.8,23.4,24.1,23.9,23.7,23.3,22,22.9,23,23.8,23.4,23.3,23.1,21.8,22.4,22.2,24.2,23.8,24.4,23.6,24.8],"num_gaps":0,"mean":23.431},{"raw_data":[21.6,22.6,22.6,22.9,23.2,22.6,21.6,20.9,23.5,21.8,21.6,22.5,22.2,23.1,22.3,22.3,21.2,22.4,23.1,22.5,21.6,21,21.2,20.4,22.4,23,22.2,22.8,24],"num_gaps":0,"mean":22.245},{"raw_data":[19.2,19.7,19.3,19.4,20.4,18,19.2,18.6,18.8,20,19.3,19.8,18.2,19.8,18.5,18.1,18.5,20.3,20.4,18,19.8,19.2,18.8,17.8,20.5,20.2,19.1,19.4,20.6],"num_gaps":0,"mean":19.272},{"raw_data":[16.1,16.3,15.6,15.5,14.6,14.3,14.9,15.1,16.7,15.5,16.4,15.9,14.6,14.6,14.8,15.6,15.7,16.8,16.6,14.6,15.1,13.7,13.1,17.3,15.1,15.5,17,15.3,17.7],"num_gaps":0,"mean":15.517}],"temp_mean":20.3,"prec_sum":5256.72,"monthly_short":[{"monthIdx":0,"month":"Jan","temp":14.041,"prec":14.193},{"monthIdx":1,"month":"Feb","temp":15.776,"prec":45.924},{"monthIdx":2,"month":"Mar","temp":19.376,"prec":153.245},{"monthIdx":3,"month":"Apr","temp":21.376,"prec":383.317},{"monthIdx":4,"month":"May","temp":22.207,"prec":594.059},{"monthIdx":5,"month":"Jun","temp":23.114,"prec":1030.4},{"monthIdx":6,"month":"Jul","temp":23.393,"prec":1293.086},{"monthIdx":7,"month":"Aug","temp":23.803,"prec":776.621},{"monthIdx":8,"month":"Sep","temp":23.431,"prec":614.524},{"monthIdx":9,"month":"Oct","temp":22.245,"prec":277.1},{"monthIdx":10,"month":"Nov","temp":19.272,"prec":54.524},{"monthIdx":11,"month":"Dec","temp":15.517,"prec":19.731}],"extreme":{"minTemp":14.041,"maxTemp":23.803,"minPrec":14.193,"maxPrec":1293.086}}
]

// Prepare data
let data = climateData[climateDataIdx]

// Add temp/prec_long = list of all (30) monthly temp/prec values
data.temp_long = []
for (let month of data.temp)
  data.temp_long.push(month.raw_data)
data.prec_long = []
for (let month of data.prec)
  data.prec_long.push(month.raw_data)

// DRAW !!!
new AvailabilityChart(main, data)
// new DistributionChart(main, data)
new ClimateChart(main, data)
