import { NegativeCheckingValidator } from './shared/negativevalue.validator';
import { IAmortization } from './IAmortization';
import { ILoanCalculatorField } from './ILoanCalculatorField';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  myForm: FormGroup;

  excelFileName = ' ';
  LineChartDataSet = [];
  installmentLabel = [];
  yearWisePrincipalAmount = [];
  yearWiseInterestAmount = [];
  pieChart = [];
  change = 1;

  emiValue = 0;
  totalIntrest = 0;
  totalAmountPaid = 0;

  LoanCalValue: ILoanCalculatorField; //get form values.
  amortizationValues: IAmortization[] = []; //calculated Amortization table vaules.
  amortization: IAmortization = {
    installment: null,
    principal: null,
    interest: null,
    balance: null,
    totalPayment: null,
    startingLoanBalance: null,
    loanPaidTodate: null,
  };

  loanTypeValue = [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Auto' },
    { id: 3, name: 'Student' },
    { id: 4, name: 'Personal' },
    { id: 5, name: 'Credit Card' },
    { id: 6, name: 'Other' },
  ];

  constructor(private fb: FormBuilder, private toastr: ToastrService) { }
  ngOnInit() {
    this.myForm = this.fb.group({
      loanAmount: [
        '5000',
        [Validators.required, NegativeCheckingValidator.isNegative],
      ],
      loanTerm: ['1', [Validators.required, NegativeCheckingValidator.isNegative]],
      interestRate: ['10', [Validators.required, NegativeCheckingValidator.isNegative]],
      loanType: ['', [Validators.required]],
      termType: ['1', [Validators.required]],
    });
  }

  onSubmit(form: FormGroup) {
    this.LoanCalValue = form.value;
    this.totalAmountPaid = 0;
    this.totalIntrest = 0;
    this.emiValue = this.calculateEmi();
    this.excelFileName = this.loanTypeValue[this.LoanCalValue.loanType - 1].name;
    this.calculateAmortization();
    this.createInstallmentTable();
    this.createPieChartValue();
    this.calculateYearWisePrincipal();
    this.calculateYearWiseInterest();
    this.createLineChartDataset();
    // console.log(formatDate(new Date(), 'dd-MM-yyyy', 'en'));
  }

  calculateRateOfInterestMonthly(): number {
    return this.LoanCalValue.interestRate / 12 / 100;
  }

  convertYearIntoMonth(): number {
    if (this.LoanCalValue.termType == 1)
      return this.LoanCalValue.loanTerm * 12;
    else return this.LoanCalValue.loanTerm;
  }

  calculateAmortization() {
    this.amortizationValues = [];
    let emi = this.calculateEmi();
    // console.log(emi);
    let loanAmount = this.LoanCalValue.loanAmount;
    let startingLoanBalance = loanAmount;
    // console.log(this.convertYearIntoMonth());
    for (let i = 0; i < this.convertYearIntoMonth(); i++) {
      let interest = loanAmount * this.calculateRateOfInterestMonthly();
      let principal = emi - interest;
      this.amortization.loanPaidTodate = (principal / loanAmount) * 100;
      // console.log(this.amortizationValues[i].installment);
      this.amortization.principal = principal;
      this.amortization.interest = interest;
      this.totalIntrest += interest;
      this.amortization.startingLoanBalance = startingLoanBalance;
      loanAmount = loanAmount - principal;
      startingLoanBalance = loanAmount;
      this.amortization.balance = loanAmount;
      this.amortization.totalPayment = emi;
      this.totalAmountPaid += emi;
      this.amortizationValues.push(this.amortization);
      this.amortization = {
        installment: null,
        principal: null,
        interest: null,
        balance: null,
        totalPayment: null,
        startingLoanBalance: null,
        loanPaidTodate: null
      };
      interest = 0;
      principal = 0;
    }
  }

  calculateEmi() {
    let rateOfIntrest = this.calculateRateOfInterestMonthly() + 1;
    // console.log(+this.convertYearIntoMonth());
    return (
      (this.LoanCalValue.loanAmount *
        this.calculateRateOfInterestMonthly() *
        Math.pow(rateOfIntrest, +this.convertYearIntoMonth())) /
      (Math.pow(rateOfIntrest, +this.convertYearIntoMonth()) - 1)
    );
  }
  onChangeValue() {
    // this.change = !this.change;
    let loanTermValue = this.myForm.get('loanTerm').value;
    if (loanTermValue) {
      if (this.myForm.get('termType').value == 1) {
        this.change = 1;
        // this.toastr.success('Selected Tenure type is Year');
        this.myForm.patchValue({
          loanTerm: loanTermValue / 12,
        });
      }
      if (this.myForm.get('termType').value == 2) {
        this.change = 2;
        // this.toastr.success('Selected Tenure type is Month');
        this.myForm.patchValue({
          loanTerm: loanTermValue * 12,
        });
      }
    } else {
      this.toastr.error('please enter a Loan Term');
    }
  }

  createPieChartValue() {
    // this.pieChart.push(Math.round(this.emiValue));
    this.pieChart = [];
    this.pieChart.push(Math.round(this.totalAmountPaid));
    this.pieChart.push(Math.round(this.totalIntrest));
  }
  createLineChartDataset() {
    this.LineChartDataSet = [];
    for (let i = 0; i < this.amortizationValues.length; i++) {
      if ((!(this.amortizationValues[i].installment == null)) && (i != 0)) {
        this.LineChartDataSet.push(Math.round(this.amortizationValues[i].balance));
      }
      if ((this.amortizationValues.length - 1) == i) {
        this.LineChartDataSet.push(Math.round(this.amortizationValues[i].balance));
      }

    }
  }
  //create table view
  createInstallmentTable() {
    let repatedTimes = Math.round(this.convertYearIntoMonth());
    // console.log(repatedTimes);

    this.installmentLabel = [];
    // this.calculateAmortization();
    let d = new Date();
    let n = d.getMonth() + 1;
    let monthCount = n;
    let yearCounter = 1;
    // console.log(n);
    for (let i = 0; i < repatedTimes; i++) {
      // console.log(repatedTimes);
      if (monthCount <= 12) {
        // console.log(monthCount);
        if (monthCount == 12 || i == 0) {
          if (!(i == 0)) {
            this.installmentLabel.push('Year ' + yearCounter);
            this.amortizationValues[i].installment = yearCounter;
            // yearWisePrincipalAmount.push(principalAmount);
            yearCounter++;
            // console.log('*' + monthCount);
            monthCount = 1;
          } else {
            this.installmentLabel.push('Year ' + yearCounter);
            this.amortizationValues[i].installment = yearCounter;
            yearCounter++;
            // console.log('#' + monthCount);
          }
        } else if (i == repatedTimes - 1 && monthCount == 12) {
          // console.log(monthCount);
          this.amortizationValues[i].installment = yearCounter;
          this.installmentLabel.push('Year ' + yearCounter);
          // yearWisePrincipalAmount.push(principalAmount);
          yearCounter++;
          // console.log(monthCount);
          console.log('z' + monthCount);
          monthCount = 1;
          // console.log('z' + monthCount);
        }
        else {
          // console.log('x' + monthCount);
          monthCount++;
        }
      }
    }
    // console.log(this.amortizationValues);
    // console.log(this.installmentLabel);
  }

  calculateYearWisePrincipal() {
    this.yearWisePrincipalAmount = [];
    let principalAmount = 0;
    for (let i = 0; i < this.amortizationValues.length; i++) {
      if ((!(this.amortizationValues[i].installment == null)) && (i != 0)) {
        this.yearWisePrincipalAmount.push(Math.round(principalAmount));
        principalAmount = 0;
      }
      if ((this.amortizationValues.length - 1) == i) {
        principalAmount += this.amortizationValues[i].principal;
        this.yearWisePrincipalAmount.push(Math.round(principalAmount));
      }
      principalAmount += this.amortizationValues[i].principal;
    }
    // console.log(yearWisePrincipalAmount);
  }

  calculateYearWiseInterest() {
    this.yearWiseInterestAmount = [];
    let interestAmount = 0;
    for (let i = 0; i < this.amortizationValues.length; i++) {
      if ((!(this.amortizationValues[i].installment == null)) && (i != 0)) {
        this.yearWiseInterestAmount.push(Math.round(interestAmount));
        interestAmount = 0;
      }
      if ((this.amortizationValues.length - 1) == i) {
        interestAmount += this.amortizationValues[i].interest;
        this.yearWiseInterestAmount.push(Math.round(interestAmount));
      }
      interestAmount += this.amortizationValues[i].interest;
    }
    // console.log(this.yearWiseInterestAmount);
  }
}