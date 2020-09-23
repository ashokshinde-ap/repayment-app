import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() set barTotalPayment(data) {
    this.barChartData[0].data = data;

  };

  @Input() set lineBalance(data) {
    this.lineChartData[0].data = data;
  };

  @Input() set barIntrestTotalPayment(data) {
    this.barChartData[1].data = data;
  };
  @Input() set barYear(data) {
    this.barChartLabels = data;
    this.lineChartLabels = data;
  };

  @Input() set pieChart(data) {
    this.pieChartData = data;
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartColors: Color[] = [
    { backgroundColor: '#28a745' },
    { backgroundColor: '#c30101' },
  ]

  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.barTotalPayment, label: 'Total Payment' },
    { data: this.barIntrestTotalPayment, label: 'Total Interest' }
  ];
  //Pie Chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartColors: Array<any> = [{
    backgroundColor: ['#28a745', '#c30101'],
  }];
  public pieChartLabels: Label[] = ['Total Amount Paid', 'Total Interest Paid'];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //line chart

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Remaining Balance' },
  ];
  public lineChartLabels: Label[];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: '#f0a500',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  ngOnInit(): void {
    this.pieChartType = 'pie';
  }

}
