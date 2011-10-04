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

// earningProfile is pairs of [year, salary]
var earningProfile = []
for( i = 0; i < 60; i++ )
{
    earningProfile[i] = [i, 100 * (0.1 * Math.random() + 1) * Math.pow(i,2)];
}


var donationProfile = [[0,30], [35000,30], [150000,30], [999999999,30] ];

var earningData = []
var donationData = []


function fillEarningData( earningProfile )
{
    for( step = 0; step < earningProfile.length - 1; step++ )
    {
        var salary = earningProfile[step][1];
        for( year = earningProfile[step][0]; year < earningProfile[step+1][0]; year++ )
        {
            earningData[year] = salary;
        }
    }
    chart1.series[0].setData(earningData);
}

function fillDonationData( donationProfile )
{
    year = 0;
    var donationData_graph = [];
    for( step = 0; step < donationProfile.length - 1; step++ )
    {
        var lower_bound = donationProfile[step][0]
        var upper_bound = donationProfile[step+1][0]

        var percentage = donationProfile[step][1];

        while( earningData[year] >= lower_bound && earningData[year] < upper_bound )
        {
            // inverted % for graph as we want to show it *above* the earnings
            donationData_graph[year] = earningData[year] * (100-percentage)/100;
            donationData[year] = earningData[year] * percentage/100;
            year++;
        }
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

    $( "#money_donated" ).html("£" + total.toFixed(0))
    $( "#lives_saved" ).html( (total / 300).toFixed(0) )

    drawCanvasPeople( (total / 300).toFixed(0) );
}


function updateDonationProfile()
{
    donationProfile[0][1] = $( "#slider_band_0" ).slider("value");
    donationProfile[1][1] = $( "#slider_band_1" ).slider("value");
    donationProfile[2][1] = $( "#slider_band_2" ).slider("value");
}
 function band0_update( event, ui ) {
            $( "#percentage_band_0" ).html( ui.value + "%" );

            donationProfile[0][1] = ui.value;

            fillEarningData( earningProfile );
            fillDonationData( donationProfile );
    calculateMoneyDonated();

}


 function band1_update( event, ui ) {
            $( "#percentage_band_1" ).html( ui.value + "%" );

            donationProfile[1][1] = ui.value;

            fillEarningData( earningProfile );
            fillDonationData( donationProfile );
    calculateMoneyDonated();
}


 function band2_update( event, ui ) {
            $( "#percentage_band_2" ).html( ui.value + "%" );

            donationProfile[2][1] = ui.value;

            fillEarningData( earningProfile );
            fillDonationData( donationProfile );
    calculateMoneyDonated();
}

$(function() {

    $( "#slider_band_0" ).slider({
        range: "min",
        value: 30,
        min: 10,
        max: 100,
        orientation: 'vertical',
        change: band0_update,
        slide: band0_update
    });

    $( "#slider_band_1" ).slider({
        range: "min",
        value: 30,
        min: 10,
        max: 100,
        orientation: 'vertical',
        change: band1_update,
        slide: band1_update
    });


    $( "#slider_band_2" ).slider({
        range: "min",
        value: 30,
        min: 10,
        max: 100,
        orientation: 'vertical',
        change: band2_update,
        slide: band2_update

    });

    $( "#percentage_band_0" ).html( $( "#slider_band_0" ).slider( "value" ) + "%" );
    $( "#percentage_band_1" ).html( $( "#slider_band_1" ).slider( "value" ) + "%" );
    $( "#percentage_band_2" ).html( $( "#slider_band_2" ).slider( "value" ) + "%" );


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
        <!--color: '#f30064',-->
        opacity: 0
     }, {
        name: 'Net income',
        data: [],
        color: '#ccff66',
        opacity: 100
     }]
  });

  updateDonationProfile()
  fillEarningData( earningProfile );
  fillDonationData( donationProfile );
  calculateMoneyDonated();
});

