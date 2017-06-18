$(document).ready(function(){

    var chart;
    var data;

    function buildChart(fullData){

        $.ajax({

            type: "GET",
            url: "Time-Series_Data.csv", 


            success: function(result){
            
                
                var dataFromCSV = $.csv.toArrays(result);

                var dataArray=[];

                var max=0;

                var size=0;

                          
                if(fullData)
                    size = dataFromCSV.length;      //full data opt
                else
                    size = 10000;                   //partial data opt



                for (var i = 0; i < size; i++) {
                        
                    var date = new Date(dataFromCSV[i][0]);
                    date  = date.getTime();
                    var datestr = String(date);

                    dataArray.push({ x:Number(datestr),y:Number(dataFromCSV[i][1]) });

                    if(max<Number(dataFromCSV[i][1])){
                        max=Number(dataFromCSV[i][1]);                
                    }
                }
                
                console.log(max);

                var dataAfterBuild =[];

                dataAfterBuild.push({
                    strokeWidth: 1,
                    values: dataArray,
                    key: "counter val",
                    color: "#026eff",
                    area: true
                
                });

                data = dataAfterBuild;

               

                nv.addGraph(function() {
               
                    chart = nv.models.lineWithFocusChart()
                        .options({
                            duration: 300,
                            useInteractiveGuideline: true
                            
                        })
                    ;

                    
                    chart.xAxis
                        .axisLabel("Time (s)")
                        .tickFormat(function(d) { 
                            return d3.time.format('%b %y')(new Date(d))
                        })
                        .staggerLabels(true)
                    ;

                    chart.xScale(d3.time.scale());

                    chart.x2Axis.tickFormat(function(d) { 
                            return d3.time.format('%b %y')(new Date(d)); 
                         })
                    ;

                    chart.interactiveLayer.tooltip.headerFormatter(function (d) {
                        return moment.unix(d/1000).format('DD/MM/YYYY , h:mm:ss')
                    });
                    

                    chart.yAxis
                        .axisLabel('Counter (v)')
                        .tickFormat(function(d) {
                            if (d == null) {
                                return 'N/A';
                            }
                            return d3.format(',.2f')(d);
                        })
                    ;

                    chart.y2Axis
                         .tickFormat(function(d) { return d3.format(',.2f')(d); })
                    ;


                    chart.forceY([0, max]);

                    $('#loaderDiv').hide();

                    d3.select('#chart1').append('svg')
                        .datum(data)
                        .transition()
                        .call(chart);


                    
                    nv.utils.windowResize(function () {
                        chart.update();
                    });

                    chart.lines.dispatch.on("elementClick", function(e) {
                        //console.log(e[0].point);

                        $("#pDetails").empty();

                        var pointData = "";

                        pointData+="<p>";
                        pointData+="<b>Last point selected:</b>";
                        pointData+="<span style='color:blue'> Time (x): </span> ";
                        pointData+= (new Date(e[0].point.x));
                        pointData+="<span style='color:blue'> Counter (y): </span> ";
                        pointData+= (e[0].point.y);
                        pointData+="</p>";

                        $("#pDetails").append(pointData);
                    
                    });
                    

                    return chart;

                
                });

            }



        });
    }



    $( "#target" ).click(function() {



        var min = Number(data[0].values[0].x);

        var max = Number(data[0].values[data[0].values.length-1].x);

        chart.brushExtent([min,max]);

        chart.update();

    });

    $( "#fullbtn" ).click(function() {

        $("#pDetails").empty();

        $("svg").remove();

        buildChart(true);

        $('#loaderDiv').show();


    });

    $( "#partbtn" ).click(function() {

        $("#pDetails").empty();

        $("svg").remove();

        buildChart(false);

        $('#loaderDiv').show();
        

    });






});