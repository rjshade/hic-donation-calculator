var chart1; // globally available
function drawCanvasPeople( number )
{
    var buttonsToDraw = number / 10;

    var buttonWidth  = 12;
    var buttonHeight = 12;

    var buttonsPerRow = 60;

    var canvas = document.getElementById('myCanvas');
    canvas.width = buttonsPerRow * buttonWidth;
    canvas.height = Math.ceil( buttonsToDraw / buttonsPerRow ) * buttonHeight;

    if (canvas.getContext)
    {
        var ctx = canvas.getContext('2d');

        person = new Image();
        person.src = "./images/person.png"
        person.onload = function() 
        {
            var col = 0;
            var row = 0;
            for( var num = 0; num < buttonsToDraw; num++ )
            {
                ctx.drawImage( person, buttonWidth*col, buttonHeight*row )
                col++
                if( col >= buttonsPerRow )
                { row++; col = 0; }
            }

        }
    }
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

var startingSalary = 20000;
var endingSalary = 1000000;
var yearsToWork = 50;

// earningProfile is pairs of [year, salary]
var earningProfile = []


function calculateEarningProfile(){
  for( i = 0; i < yearsToWork; i++ )
  {
    y0 = startingSalary;
    y1 = endingSalary;
    x0 = 0;
    x1 = yearsToWork;
    val = y0 + i * (y1 - y0)/(yearsToWork);
    noise = (0.1 * (Math.random() - 0.5)) * val;

    earningProfile[i] = [i, val + noise];
  }
}


var donationPercentage = 10;
var earningData = [];
var donationData = [];

function fillEarningData( earningProfile )
{
  for( year = 0; year < yearsToWork; year++ )
  {
    var salary = earningProfile[year][1];
    earningData[year] = salary;
  }

  chart1.series[0].setData(earningData);
}

function fillDonationData( earningData )
{
    var donationData_graph = [];
    for( year = 0; year < yearsToWork; year++ )
    {
      // inverted % for graph as we want to show it *above* the earnings
      donationData_graph[year] = earningData[year] * (100-donationPercentage)/100;
      donationData[year] = earningData[year] * donationPercentage/100;
    }

    chart1.series[1].setData(donationData_graph);
}


function calculateMoneyDonated()
{
    var total = 0
    for( year = 0; year < donationData.length; year++ )
    {
        total += donationData[year]
    }

    $( "#money_donated" ).html("£" + numberWithCommas(total.toFixed(0)))
    $( "#lives_saved" ).html( (total / 300).toFixed(0) )

    //drawCanvasPeople( (total / 300).toFixed(0) );
}


function updateDonationProfile()
{
  donationPercentage = $( "#donation_slider" ).slider("value");
}

function startingSalarySliderUpdate( event, ui ) {
  startingSalary = ui.value;
  $( "#starting_salary_value" ).html("£" + numberWithCommas(ui.value) );

  calculateEarningProfile();
  fillEarningData( earningProfile );
  fillDonationData( earningData );
  calculateMoneyDonated();
}
function endingSalarySliderUpdate( event, ui ) {
  endingSalary = ui.value;
  $( "#ending_salary_value" ).html("£" + numberWithCommas(ui.value) );

  calculateEarningProfile();
  fillEarningData( earningProfile );
  fillDonationData( earningData );
  calculateMoneyDonated();
}

function donationSliderUpdate( event, ui ) {

  donationPercentage = ui.value;

  $( "#donation_value" ).html( ui.value + "%" );
  
  fillEarningData( earningProfile );
  fillDonationData( earningData );
  calculateMoneyDonated();
}

$(function() {
  $( "#starting_salary_slider" ).slider({
      range: "min",
      value: 20,
      min: 10000,
      max: 10000000, 
      //orientation: 'vertical',
      change: startingSalarySliderUpdate,
      slide: startingSalarySliderUpdate
  });
  $( "#starting_salary_value" ).html( "£" + numberWithCommas($( "#starting_salary_slider" ).slider( "value" )) );

  $( "#ending_salary_slider" ).slider({
      range: "min",
      value: 50,
      min: 10000,
      max: 10000000, 
      //orientation: 'vertical',
      change: endingSalarySliderUpdate,
      slide: endingSalarySliderUpdate
  });
  $( "#ending_salary_value" ).html( "£" + numberWithCommas($( "#ending_salary_slider" ).slider( "value" )) );


  $( "#donation_slider" ).slider({
      range: "min",
      value: 10,
      min: 10,
      max: 100,
      //orientation: 'vertical',
      change: donationSliderUpdate,
      slide: donationSliderUpdate
  });
  $( "#donation_value" ).html( $( "#donation_slider" ).slider( "value" ) + "%" );

  chart1 = new Highcharts.Chart({

     chart: {
        renderTo: 'chart-container',
        type: 'area'
     },

     title: {
        text: 'earnings and donations'
     },

     xAxis: {
        title: {
            text: 'years'
        }
     },

     yAxis: {
        title: {
           text: '£'
        }
     },


  plotOptions: {
    area: {
        fillOpacity: 0,
        marker: {
           enabled: false,
           symbol: 'circle',
           radius: 2,
           states: {
              hover: {
                 enabled: true
              }
           }
        }
      }
  },

     series: [{
        name: 'Donations',
        data: [],
        color: '#f30064',
        opacity: 0.5
     }, {
        name: 'Net income',
        data: [],
        color: '#ccff66',
        opacity: 0.5
     }]
  });

  calculateEarningProfile();
  updateDonationProfile()
  fillEarningData( earningProfile );
  fillDonationData( earningData );
  calculateMoneyDonated();
});

