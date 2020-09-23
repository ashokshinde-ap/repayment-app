import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'dispaly-amortization',
  templateUrl: './dispaly-amortization.component.html',
  styleUrls: ['./dispaly-amortization.component.css'],
})
export class DispalyAmortizationComponent implements OnInit {
  @Input() amortizationValues;
  @Input() excelFileName;
  constructor() { }

  ngOnInit(): void { }

  public exportTableAsExcelFile(table: HTMLElement, excelFileName = this.excelFileName): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + 'Loan_' + formatDate(new Date(), 'dd-MM-yyyy', 'en') + EXCEL_EXTENSION);
  }
}
