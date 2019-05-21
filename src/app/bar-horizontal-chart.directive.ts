import { Directive, Input, ElementRef, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';


@Directive({
  selector: '[barHorizontalChart]'
})
export class BarHorizontalChartDirective implements OnInit, OnChanges {

  @Input() width = 459;
  @Input() height = 252;
  @Input() margin = { top: 50, right: 20, bottom: 50, left: 100 };
  @Input() data = [{ 'name': 'Australia', 'percentValue': 68, 'numericValue': 12755 },
  { 'name': 'South Africa', 'percentValue': 58, 'numericValue': 11454 },
  { 'name': 'New Zealand', 'percentValue': 7, 'numericValue': 1822 }
  ];
  @Input() colors = ['#C3CE3D', '#67C1BA', '#0E709E'];
  @Output() OutputBarData: EventEmitter<any> = new EventEmitter();

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html((d) => {
      return '<div class="customPopover"> <div class="content" style="background-color:fff;">' +
        // tslint:disable-next-line:max-line-length
        '<ul class="addPopUp__list"><li class="addPopUp__item"><span class="lbl">' + d.name + '</span><span class="val">' + d.percentValue + '</span></li></div></div>';
    });

  public labelTip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html(d => {
      if (d.name.length < 18 && (this.labelTip !== undefined) && document.getElementsByClassName('addPopUp').length) {
        document.getElementsByClassName('addPopUp')[1].className = 'hideAddPopUp';
      } else {
        if (document.getElementsByClassName('hideAddPopUp').length) {
          document.getElementsByClassName('hideAddPopUp')[0].className = 'addPopUp';
        }
        return '<div class="customPopover"> <div class="content" style="background-color:fff;">' +
          '<ul class="addPopUp__list"><li class="addPopUp__item"><span class="">' + d.name + '</span></li></div></div>';
      }
    });

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.drawChart();
  }

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    this.data.sort((a, b) => parseFloat(a.percentValue + '') - parseFloat(b.percentValue + ''));

    let width = this.width,
      height = this.height;

    let svg = d3.select(this.element.nativeElement);
    svg.selectAll("*").remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr("width", width)
      .attr("height", height);

    width = +svg.attr("width") - this.margin.left - this.margin.right;
    height = +svg.attr("height") - this.margin.top - this.margin.bottom;


    // let tooltip = d3.select("body").attr("class", "addPopUp");

    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleBand().range([height, 0]);

    let g = svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    x.domain([0, 100]);
    y.domain(this.data.map(function (d) { return d.name; })).padding(0.1);

    g.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function (d) {

        return d + '%';
      }).tickSizeInner([-height]).tickSizeOuter(0));

    g.append("g")
      .attr("class", "y-axis axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y).tickFormat(function (d) {
        return (d.length > 14) ? d.substring(0, 18) + '...' : d;
      }).tickSizeInner([-width]).tickSizeOuter(0)); /*tickSizeOuter(0) is used to remove starting and ending tick lines of axis*/

    g.append("g")
      .attr('class', 'allBars');
    const self = this;
    let bars = d3.select('.allBars')
      .selectAll(".bar")
      .data(self.data)
      .enter();

    bars.append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("height", Math.min(y.bandwidth() - 2, 25))
      .attr("y", function (d) { return y(d.name) + (y.bandwidth() - 25) / 2; })
      .attr("width", function (d) { return x(d.percentValue); })
      .attr('fill', (d, i) => self.colors[i])
      .on("mouseover", function (d) {
        self.tip.show(d, this);
      })
      .on("mouseout", function (d) { self.tip.hide(d, this); })
      .on("click", function (d) {
        self.OutputBarData.emit(d.name);
      });

    bars.append('rect').attr('class', 'back')
      .attr('x', function (d) {
        return x(d.percentValue);
      })
      .attr("height", Math.min(y.bandwidth() - 2, 25))
      .attr('y', function (d) { return y(d.name) + (y.bandwidth() - 25) / 2; })
      .attr('width', function (d) {
        return x(100 - d.percentValue);
      })
      .attr('fill', function (d) {
        return '#DFDFDF';
      });

    /* -- logic to add the text above rectangle starts -- */
    const percentText = g.append('g').classed('textArea', true).selectAll('.text').data(this.data).enter()
      .append('g').attr('class', 'text');

    const numericText = g.append('g').classed('textArea', true).selectAll('.text').data(this.data).enter()
      .append('g').attr('class', 'text');

    percentText.append('text').attr('class', 'barText')
      .attr('x', function (d) {
        return x(d.percentValue) + 10;
      })

      .attr('y', function (d) {
        return (y(d.name) + (y.bandwidth()) / 2) + 5;
      }).text(function (d) {
        if ((self.getTextWidth(d.numericValue + ' ', 10, 'CiscoSans') + 20) > x(d.percentValue)) {
          return '(' + d.numericValue + ') ' + d.percentValue + '%';
        }
        return d.percentValue + '%';
      });

    numericText.append('text').attr('class', 'barText')
      .attr('x', function (d) {
        return x(d.percentValue) - self.getTextWidth(d.numericValue + ' ', 10, 'CiscoSans') - 20;
      })

      .attr('y', function (d) {
        return (y(d.name) + (y.bandwidth()) / 2) + 5;
      }).text(function (d) {
        console.log("1", self.getTextWidth(d.numericValue + '', 10, 'CiscoSans'), "\n 2", x(d.percentValue))
        if ((self.getTextWidth(d.numericValue + '', 10, 'CiscoSans') + 20) <= x(d.percentValue)) {
          return d.numericValue
        }
      });

    g.call(this.tip);
    g.call(this.labelTip);
    /* X axis labels are moved down*/
    g.selectAll(".x-axis text")
      .attr("y", "10");

    d3.selectAll('.y-axis .tick')
      .data(this.data)
      .on('mouseover', this.labelTip.show)
      .on('mouseout', this.labelTip.hide);
  }

  getTextWidth(text, fontSize, fontFace) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = fontSize + 'px ' + fontFace;
    return context.measureText(text).width;
  }
}

