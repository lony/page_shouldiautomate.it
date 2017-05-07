// Own code
$(function () {

    var INPUT = {
        "man--duration": null,
        "man--salary": null,
        "man--amount": null,
        "ato--duration": null,
        "ato--salary": null
    };
    var chart;

    function renderGraphAxis(label, color, data) {
        return {
            label: label,
            backgroundColor: "rgba(" + color + ",0.1)",
            borderColor: "rgba(" + color + ",1)",
            pointBackgroundColor: "rgba(" + color + ",1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 1,
            pointRadius: 4,
            lineTension: 0,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(" + color + ",1)",
            pointHoverBorderWidth: 1,
            borderWidth: 2,
            data: data
        };
    }

    function renderGraphData(cost) {
        var label = [];
        var man = [];
        var ato = [];
        const SCALE_MAX = 10;
        var scale = INPUT["man--amount"] / SCALE_MAX;

        // Show only amount given
        if (INPUT["man--amount"] < SCALE_MAX) {
            var scaleTo = INPUT["man--amount"];
        } else {
            var scaleTo = SCALE_MAX;
        }

        for (var i = 1; i <= scaleTo; i++) {
            var normalized = Math.ceil(scale * i);

            label.push(normalized);
            man.push((INPUT["man--duration"] * INPUT["man--salary"]) * normalized);
            ato.push(cost['ato']);
        }

        return {
            "label": label,
            "ato": ato,
            "man": man
        };
    }

    function renderGraph(cost) {
        var idChartMainWrapperCanvas = 'chart--main--wrapper--canvas'
        var elChartMainWrapperCanvas = $('#' + idChartMainWrapperCanvas);

        var color = {
            good: '80,158,81',
            bad: '226,90,88'
        };

        var label = {
            man: 'Manuel',
            ato: 'Automate'
        };

        var optionsLineChart = {
            responsive: true,
            title: {
                display: true,
                text: 'Total cost over repetions',
                fontColor: "#444",
                fontFamily: 'Tahoma',
                padding: 0
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'grey',
                    usePointStyle: true
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Total cost in €'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '# of repetitions'
                    }
                }]
            },
            tooltips: {
                mode: "index",
                intersect: true,
                position: 'nearest',
                bodySpacing: 4,
                callbacks: {
                    title: function (tooltipItem, data) {
                        return "Repetition " + data.labels[tooltipItem[0].index];
                    }
                }
            }
        };

        // Generate axis data
        var data = renderGraphData(cost);

        // Render result cost
        if (cost['man'] <= cost['ato']) {
            dataset = [
                renderGraphAxis(label['man'], color['good'], data['man']),
                renderGraphAxis(label['ato'], color['bad'], data['ato'])
            ];
        } else {
            dataset = [
                renderGraphAxis(label['man'], color['bad'], data['man']),
                renderGraphAxis(label['ato'], color['good'], data['ato'])
            ];
        }

        // Configure data
        var chartOptions = {
            type: 'line',
            data: {
                labels: data["label"],
                datasets: dataset
            },
            options: optionsLineChart
        };

        // Show box
        elChartMainWrapperCanvas.closest('.row').removeClass('startHidden');

        // Style font
        Chart.defaults.global.defaultFontColor = 'grey';
        Chart.defaults.global.defaultFontFamily = "Tahoma";
        Chart.defaults.global.defaultFontSize = 11;
        Chart.defaults.global.defaultFontStyle = 'normal';

        // Destroy old graph
        if (chart) {
            chart.destroy();
        }

        // Render chart
        chart = new Chart(
            document.getElementById(idChartMainWrapperCanvas),
            chartOptions
        );
    }

    function renderBoxCost(cost, shouldAutomate) {
        var style = {
            success: {
                color: 'alert-success',
                icon: 'fa-check'
            },
            failure: {
                color: 'alert-danger',
                icon: 'fa-times'
            }
        };

        var msg = {
            man: 'total cost of doing the task repetetive',
            ato: 'total cost of automating the task once'
        };

        var markUp = '<div class="col-xs-6"><h3 class="alert {{color}} text-center">{{cost}} &euro; ' +
            '<i class="fa {{icon}}" aria-hidden="true"></i>' +
            '<br /><small>{{msg}}</small></h3></div>';

        var resMan = 'success', resAto = 'failure';

        if (shouldAutomate) {
            resMan = 'failure', resAto = 'success';
        }

        return markUp.replace(/{{color}}/g, style[resMan]['color']) // Manual
            .replace(/{{cost}}/g, cost['man'])
            .replace(/{{icon}}/g, style[resMan]['icon'])
            .replace(/{{msg}}/g, msg['man']) +
            markUp.replace(/{{color}}/g, style[resAto]['color']) // Automate
                .replace(/{{cost}}/g, cost['ato'])
                .replace(/{{icon}}/g, style[resAto]['icon'])
                .replace(/{{msg}}/g, msg['ato']);
    }

    function calulateCost() {

        var costMan = (INPUT["man--duration"] * INPUT["man--salary"]) * INPUT["man--amount"];
        var costAto = INPUT["ato--duration"] * INPUT["ato--salary"];

        if (costMan % 1 != 0 || costAto % 1 != 0) {
            costMan = costMan.toFixed(2);
            costAto = costAto.toFixed(2);
        }

        return {
            "man": costMan,
            "ato": costAto
        };
    }

    function renderBox(cost) {
        var elMain = $('#box--main');
        var elMainMsgStatus = $('#box--main--msg--status');
        var elMainCost = $('#box--main--cost');

        // Show box
        elMain.closest('.row').removeClass('startHidden');

        // Render result cost
        if (cost['man'] <= cost['ato']) {
            elMain.removeClass('alert-success').addClass('alert-danger');
            elMainMsgStatus.text('NO');
            elMainCost.html(renderBoxCost(cost, false));
        } else {
            elMain.removeClass('alert-danger').addClass('alert-success');
            elMainMsgStatus.text('YES');
            elMainCost.html(renderBoxCost(cost, true));
        }
    }

    function render() {
        var cost = calulateCost();
        renderBox(cost);
        renderGraph(cost);
    }

    function react() {
        var id = this.id;
        var el = $(this);
        var val = el.val().replace(/,/g, '.');

        // Validate input field
        if (!val || isNaN(parseFloat(val)) || !isFinite(val)) {
            el.closest('.form-group').addClass('has-error');
            return;
        } else {
            el.closest('.form-group').removeClass('has-error');
        }

        // Update input
        INPUT[id] = val;

        // Check if all inputs are set
        for (var key in INPUT) {
            if (INPUT.hasOwnProperty(key) && INPUT[key] == null) {
                return;
            }
        }

        // Render cost
        render();
    }

    // Bind input elements to react function
    $('#man--duration,#man--salary,#man--amount,#ato--duration,#ato--salary').on('input', react);

});

// Google Analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-98693658-1', 'auto');
ga('send', 'pageview');
